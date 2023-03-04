import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "ready", //name of event.
  async execute(client: Client) {
    //connecting to mongodb db
    await mongoose.connect(process.env.MONGOURI || "", {
      keepAlive: true,
    });
    //running status's
    var status = [
      "wif Molly.",
      "with Nwo.",
      "with yaw mumma.",
      "I'm hewe to he'p you!",
      "I'm a bot with a lisp, thith ith how I talk!",
      "I'm always weady to make new fwiends on Discord!",
    ];
    setInterval(() => {
      client.user?.setActivity(
        status[Math.floor(Math.random() * status.length)]
      );
    }, 10000);
  },
});
