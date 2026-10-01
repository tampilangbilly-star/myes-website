import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { apiError, parseId, requireAdmin } from "./api-auth";

/**
 * Handler CRUD standar untuk API admin. SEMUA operasi (termasuk GET daftar) wajib login admin;
 * halaman publik membaca data langsung lewat Prisma di server, bukan lewat API ini.
 */
export function collectionHandlers(model, schema, { orderBy = { id: "desc" }, include, beforeCreate } = {}) {
  return {
    async GET() {
      const { error } = await requireAdmin();
      if (error) return error;
      try {
        return NextResponse.json(await prisma[model].findMany({ orderBy, include }));
      } catch (err) {
        return apiError(err, "Gagal mengambil data.");
      }
    },
    async POST(req) {
      const { error } = await requireAdmin();
      if (error) return error;
      try {
        let data = schema.parse(await req.json());
        if (beforeCreate) data = await beforeCreate(data);
        const item = await prisma[model].create({ data, include });
        revalidatePath("/", "layout");
        return NextResponse.json(item, { status: 201 });
      } catch (err) {
        return apiError(err, "Gagal menyimpan data.");
      }
    },
  };
}

export function itemHandlers(model, schema, { include, toData } = {}) {
  return {
    async GET(_req, { params }) {
      const { error } = await requireAdmin();
      if (error) return error;
      const id = parseId((await params).id);
      if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
      const item = await prisma[model].findUnique({ where: { id }, include });
      return item ? NextResponse.json(item) : NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    },
    async PUT(req, { params }) {
      const { error } = await requireAdmin();
      if (error) return error;
      const id = parseId((await params).id);
      if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
      try {
        const parsed = schema.parse(await req.json());
        const item = toData ? await toData(id, parsed) : await prisma[model].update({ where: { id }, data: parsed, include });
        revalidatePath("/", "layout");
        return NextResponse.json(item);
      } catch (err) {
        return apiError(err, "Gagal memperbarui data.");
      }
    },
    async DELETE(_req, { params }) {
      const { error } = await requireAdmin();
      if (error) return error;
      const id = parseId((await params).id);
      if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
      try {
        await prisma[model].delete({ where: { id } });
        revalidatePath("/", "layout");
        return NextResponse.json({ success: true });
      } catch (err) {
        return apiError(err, "Gagal menghapus data.");
      }
    },
  };
}
