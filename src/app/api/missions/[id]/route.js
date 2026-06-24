import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function PUT(req, { params }) { return NextResponse.json(await prisma.mission.update({ where: { id: parseInt(params.id) }, data: await req.json() })); }
export async function DELETE(req, { params }) { await prisma.mission.delete({ where: { id: parseInt(params.id) } }); return NextResponse.json({ success: true }); }
