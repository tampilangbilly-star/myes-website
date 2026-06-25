import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  const items = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(items);
}
export async function POST(req) {
  const data = await req.json();
  if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
  const item = await prisma.news.create({ data });
  return NextResponse.json(item);
}
