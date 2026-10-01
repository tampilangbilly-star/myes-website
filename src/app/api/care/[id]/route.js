import prisma from "@/lib/prisma";
import { itemHandlers } from "@/lib/crud";
import { careSchema } from "@/lib/validation";

/** Media lama diganti dengan media dari form (dalam satu transaksi). */
export const { GET, PUT, DELETE } = itemHandlers("careActivity", careSchema, {
  include: { media: true },
  toData: (id, { media, ...data }) =>
    prisma.$transaction(async (tx) => {
      await tx.careMedia.deleteMany({ where: { careActivityId: id } });
      return tx.careActivity.update({ where: { id }, data: { ...data, media: { create: media } }, include: { media: true } });
    }),
});
