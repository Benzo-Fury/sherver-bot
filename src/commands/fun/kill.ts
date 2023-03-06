import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description:
    "Kills a user, be carful the chance of you getting muted is high.",
  options: [
    {
      name: "user",
      description: "The user you want to kill.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const random = Math.floor(Math.random() * 100) + 1;
    const random1 = Math.floor(Math.random() * 100) + 1;
    const user = ctx.interaction.options.getUser("user")!;
    const member = await ctx.guild?.members.fetch(user.id)!;
    if (!member) {
      return await ctx.reply("err monkey");
    }
    try {
      if (random === random1) {
        member.timeout(10000);
      } else {
        await (await ctx.guild?.members.fetch(ctx.user.id)!).timeout(10000);
      }
    } catch {}
  },
});
