import { collectionHandlers } from "@/lib/crud";
import { homeMomentSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("homeMoment", homeMomentSchema, { orderBy: { sortOrder: "asc" } });
