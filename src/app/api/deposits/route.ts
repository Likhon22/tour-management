import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Deposit, Participant } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    const deposits = await Deposit.find({})
        .populate('contributor')
        .sort({ date: -1 });
    return NextResponse.json(deposits);
}

export async function POST(request: Request) {
    await dbConnect();
    const data = await request.json();

    const session = await Deposit.startSession();
    session.startTransaction();

    try {
        const deposit = await Deposit.create([data], { session });

        // Update participant's totalContributed
        await Participant.findByIdAndUpdate(
            data.contributor,
            { $inc: { totalContributed: data.amount } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        const populatedDeposit = await Deposit.findById(deposit[0]._id).populate('contributor');
        return NextResponse.json(populatedDeposit);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: 'Failed to create deposit' }, { status: 500 });
    }
}
