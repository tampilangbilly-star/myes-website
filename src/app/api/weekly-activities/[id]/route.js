import prisma from "@/lib/prisma";
import { itemHandlers } from "@/lib/crud";
import { weeklyGallerySchema } from "@/lib/validation";

/** Edit galeri mingguan: foto lama diganti daftar foto dari form (urutan ikut form). */
export const { GET, PUT, DELETE } = itemHandlers("activityGallery", weeklyGallerySchema, {
  include: { photos: true },
  toData: (id, { photos, ...data }) =>
    prisma.$transaction(async (tx) => {
      await tx.activityPhoto.deleteMany({ where: { galleryId: id } });
      return tx.activityGallery.update({
        where: { id },
        data: { ...data, photos: { create: photos.map((image) => ({ image })) } },
        include: { photos: true },
      });
    }),
});
