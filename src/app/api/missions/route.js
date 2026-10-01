import { collectionHandlers } from "@/lib/crud";
import { missionSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("mission", missionSchema, { orderBy: { sortOrder: "asc" } });
