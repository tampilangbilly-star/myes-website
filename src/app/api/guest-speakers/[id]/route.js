import { itemHandlers } from "@/lib/crud";
import { guestSpeakerSchema } from "@/lib/validation";

export const { GET, PUT, DELETE } = itemHandlers("guestSpeaker", guestSpeakerSchema);
