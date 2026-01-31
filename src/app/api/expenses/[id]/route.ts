import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Expense } from '@/models';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        await Expense.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Expense deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const data = await request.json();

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            {
                amount: data.amount,
                description: data.description || "",
                category: data.category,
                date: data.date || Date.now()
            },
            { new: true }
        ).populate('category');

        return NextResponse.json(updatedExpense);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
