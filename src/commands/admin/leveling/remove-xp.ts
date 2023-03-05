import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../../../plugins/publish";
import userSchema from "../../../utility/database/schemas/userSchema";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Removes xp from the specified user.",
  options: [
    {
      name: "user",
      description: "The user you would like to remove xp from.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "amount",
      description: "The amount of xp you would like to remove.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  execute: async (ctx) => {
    function isDecimal(num: number) {
      return num % 1 !== 0;
    }
    function isNegative(num: number) {
      return num < 0;
    }
    const amount = ctx.interaction.options.getNumber("amount")!;
    const user = ctx.interaction.options.getUser("user")!;
    if (isNegative(amount) || isDecimal(amount)) {
      return await ctx.reply({
        content: "You may only specify a valid number.",
        ephemeral: true,
      });
    }

    const userResult: any = await userSchema.findOne({ _id: user.id });
    if (!userResult) {
      await userSchema.create({ _id: user.id, level: 1, xp: 0 });
    } else {
      const xp = userResult.xp - amount;
      const levels = Math.floor(xp / 1000);
      const remainingXp = xp % 1000;
      const update = {
        xp: remainingXp,
        level: userResult.level + levels,
      };
      if (isNegative(remainingXp)) {
        update.xp = 1
      } 
      await userSchema.updateOne({ _id: user.id }, update);
    }

    await ctx.reply("Xp has been removed.");
  },
});
