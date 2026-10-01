import { collectionHandlers } from "@/lib/crud";
import { personnelSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("personnel", personnelSchema, { orderBy: { sortOrder: "asc" } });
