import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function PUT(req, { params }) {
  const data = await req.json();
  const item = await prisma.program.update({ where: { id: parseInt(params.id) }, data });
  return NextResponse.json(item);
}
export async function DELETE(req, { params }) {
  await prisma.program.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
