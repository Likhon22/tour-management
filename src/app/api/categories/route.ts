import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/models';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
    'Transportation (Home → Destination)',
    'Transportation (Destination → Home)',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Hotel Rent',
    'Extra Food',
    'Extra Transportation',
    'Cigarettes',
    'Drinks',
];

export async function GET() {
    await dbConnect();
    let categories = await Category.find({});

    if (categories.length === 0) {
        // Seed default categories if none exist
        await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name, isDefault: true })));
        categories = await Category.find({});
    }

    return NextResponse.json(categories);
}

export async function POST(request: Request) {
    await dbConnect();
    const data = await request.json();
    const category = await Category.create(data);
    return NextResponse.json(category);
}
