import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Expense } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    try {
        const expenses = await Expense.find({})
            .populate('category')
            .sort({ date: -1 });
        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const data = await request.json();

        // Create expense without paidBy (as it always comes from Fund)
        const expense = await Expense.create({
            amount: data.amount,
            description: data.description || "",
            category: data.category
        });

        const populated = await Expense.findById(expense._id).populate('category');
        return NextResponse.json(populated);
    } catch (error) {
        console.error("Expense POST Error:", error);
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}
