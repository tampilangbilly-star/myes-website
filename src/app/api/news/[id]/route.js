import { itemHandlers } from "@/lib/crud";
import { newsSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("news", newsSchema);
