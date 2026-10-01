import { collectionHandlers } from "@/lib/crud";
import { newsSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("news", newsSchema, { orderBy: { publishedAt: "desc" } });
