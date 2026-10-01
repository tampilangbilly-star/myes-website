import { itemHandlers } from "@/lib/crud";
import { missionSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("mission", missionSchema);
