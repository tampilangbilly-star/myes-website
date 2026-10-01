import { itemHandlers } from "@/lib/crud";
import { personnelSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("personnel", personnelSchema);
