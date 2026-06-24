import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get('group');
  const where = group ? { group } : {};
  const items = await prisma.setting.findMany({ where });
  return NextResponse.json(items);
}
export async function POST(req) {
  const { key, valueEn, valueId, group } = await req.json();
  const item = await prisma.setting.upsert({
    where: { key },
    update: { valueEn, valueId, group },
    create: { key, valueEn, valueId, group },
  });
  return NextResponse.json(item);
}
