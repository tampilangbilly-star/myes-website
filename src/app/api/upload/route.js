import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const folder = formData.get('folder') || 'uploads';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2,9)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(process.cwd(), 'public', 'uploads', filename), buffer);

  return NextResponse.json({ path: filename });
}
