import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET() { return NextResponse.json(await prisma.activity.findMany({ orderBy: { sortOrder: 'asc' } })); }
export async function POST(req) { return NextResponse.json(await prisma.activity.create({ data: await req.json() })); }
