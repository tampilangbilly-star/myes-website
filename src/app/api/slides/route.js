import { collectionHandlers } from "@/lib/crud";
import { slideSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("slide", slideSchema, { orderBy: { sortOrder: "asc" } });
