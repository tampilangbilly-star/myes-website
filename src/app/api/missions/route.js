import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET() { return NextResponse.json(await prisma.mission.findMany({ orderBy: { sortOrder: 'asc' } })); }
export async function POST(req) { return NextResponse.json(await prisma.mission.create({ data: await req.json() })); }
