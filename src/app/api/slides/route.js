import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const slides = await prisma.slide.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(req) {
  const data = await req.json();
  const slide = await prisma.slide.create({ data });
  return NextResponse.json(slide);
}
