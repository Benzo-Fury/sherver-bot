import { eventModule, EventType } from "@sern/handler";
import type { Message } from "discord.js";
import dotenv from "dotenv";
import userSchema from "../../utility/database/schemas/userSchema";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "messageCreate",
  async execute(msg: Message) {
    if (!msg.inGuild()) return;
    if (msg.author.bot) return;
    const xpToGive = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
    const userResult = await userSchema.findOne({ _id: msg.author.id });
    if (!userResult) {
      await userSchema.create({
        _id: msg.author.id,
        xp: xpToGive,
        level: 1,
      });
    } else {
      const newXP = userResult.xp + xpToGive;
      const update = {
        $inc: { xp: xpToGive },
        level: newXP >= 1000 ? userResult.level + 1 : userResult.level,
      };
      await userSchema.updateOne({ _id: msg.author.id }, update);
    }
  },
});