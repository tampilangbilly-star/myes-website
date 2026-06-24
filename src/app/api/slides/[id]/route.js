import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  const data = await req.json();
  const slide = await prisma.slide.update({ where: { id: parseInt(params.id) }, data });
  return NextResponse.json(slide);
}

export async function DELETE(req, { params }) {
  await prisma.slide.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
