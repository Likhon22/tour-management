import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Participant, Category, Expense, Deposit } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    try {
        // Run all queries in parallel for maximum speed
        const [participants, categories, expenses, deposits] = await Promise.all([
            Participant.find({}).sort({ name: 1 }),
            Category.find({}).sort({ name: 1 }),
            Expense.find({}).populate('category').sort({ date: -1 }).limit(50),
            Deposit.find({}).populate('contributor').sort({ date: -1 }).limit(50)
        ]);

        return NextResponse.json({
            participants,
            categories,
            expenses,
            deposits,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("Init API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch initial data' }, { status: 500 });
    }
}
