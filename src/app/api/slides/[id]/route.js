import { itemHandlers } from "@/lib/crud";
import { slideSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("slide", slideSchema);
