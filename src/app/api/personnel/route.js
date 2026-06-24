import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.personnel.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(items);
}
export async function POST(req) {
  const data = await req.json();
  const item = await prisma.personnel.create({ data });
  return NextResponse.json(item);
}
