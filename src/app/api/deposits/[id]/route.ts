import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Deposit, Participant } from '@/models';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    const session = await Participant.startSession();
    session.startTransaction();

    try {
        const deposit = await Deposit.findById(id);
        if (!deposit) {
            return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
        }

        // Revert participant's totalContributed
        await Participant.findByIdAndUpdate(
            deposit.contributor,
            { $inc: { totalContributed: -deposit.amount } },
            { session }
        );

        await Deposit.findByIdAndDelete(id, { session });

        await session.commitTransaction();
        session.endSession();
        return NextResponse.json({ message: 'Deposit deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    const session = await Participant.startSession();
    session.startTransaction();

    try {
        const oldDeposit = await Deposit.findById(id);
        if (!oldDeposit) {
            return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
        }

        // If amount or contributor changed, we need to adjust totalContributed for both old and new
        if (oldDeposit.contributor.toString() !== data.contributor || oldDeposit.amount !== data.amount) {
            // Revert old
            await Participant.findByIdAndUpdate(
                oldDeposit.contributor,
                { $inc: { totalContributed: -oldDeposit.amount } },
                { session }
            );
            // Apply new
            await Participant.findByIdAndUpdate(
                data.contributor,
                { $inc: { totalContributed: data.amount } },
                { session }
            );
        }

        const updatedDeposit = await Deposit.findByIdAndUpdate(
            id,
            {
                amount: data.amount,
                contributor: data.contributor,
                date: data.date || Date.now()
            },
            { new: true, session }
        ).populate('contributor');

        await session.commitTransaction();
        session.endSession();
        return NextResponse.json(updatedDeposit);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
