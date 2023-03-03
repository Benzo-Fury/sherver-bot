import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "ready", //name of event.
  async execute(client: Client) {
    //connecting to mongodb db
    await mongoose.connect(process.env.MONGOURI || '', {
        keepAlive: true
    })
  },
});
