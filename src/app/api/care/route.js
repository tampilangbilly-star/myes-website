import { collectionHandlers } from "@/lib/crud";
import { careSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("careActivity", careSchema, {
  orderBy: { activityDate: "desc" },
  include: { media: true },
  beforeCreate: ({ media, ...data }) => ({ ...data, media: { create: media } }),
});
