import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Participant } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    const participants = await Participant.find({});
    return NextResponse.json(participants);
}

export async function POST(request: Request) {
    await dbConnect();
    const data = await request.json();
    const participant = await Participant.create(data);
    return NextResponse.json(participant);
}
