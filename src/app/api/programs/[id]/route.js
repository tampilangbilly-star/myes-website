import { itemHandlers } from "@/lib/crud";
import { programSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("program", programSchema);
