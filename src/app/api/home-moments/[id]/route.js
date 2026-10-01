import { itemHandlers } from "@/lib/crud";
import { homeMomentSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("homeMoment", homeMomentSchema);
