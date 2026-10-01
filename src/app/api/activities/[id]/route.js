import { itemHandlers } from "@/lib/crud";
import { activitySchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("activity", activitySchema);
