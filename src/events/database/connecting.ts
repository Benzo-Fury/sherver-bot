import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";

export default eventModule({
    type: EventType.External,
    emitter: "mongoose",
    name: "connected",
    async execute(process) {
        console.log('DB Connected')
    },
});