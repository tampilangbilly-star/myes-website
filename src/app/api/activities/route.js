import { collectionHandlers } from "@/lib/crud";
import { activitySchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("activity", activitySchema, { orderBy: { sortOrder: "asc" } });
