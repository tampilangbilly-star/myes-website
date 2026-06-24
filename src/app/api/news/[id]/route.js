import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function PUT(req, { params }) {
  const data = await req.json();
  if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
  const item = await prisma.news.update({ where: { id: parseInt(params.id) }, data });
  return NextResponse.json(item);
}
export async function DELETE(req, { params }) {
  await prisma.news.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
