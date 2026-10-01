import { collectionHandlers } from "@/lib/crud";
import { programSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("program", programSchema, { orderBy: { sortOrder: "asc" } });
