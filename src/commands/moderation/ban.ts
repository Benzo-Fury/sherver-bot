import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../../plugins/publish";
import { requirePermission } from "../../plugins/requirePermission";
import { serverOnly } from "../../plugins/serverOnly";

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    serverOnly(["1080050500155748365"], "This command cannot be used here."),
    requirePermission("user", ["BanMembers"], "You are not a moderator"),
  ],
  description: "Bans a user.",
  options: [
    {
      name: "user",
      description: "The user to ban.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const user = ctx.interaction.options.getUser("user")!;
    const member = await ctx.guild?.members.fetch(user)!;
    if (!member.bannable) {
      return await ctx.reply({
        content: "I cannot ban that member!",
        ephemeral: true,
      });
    }
    await member.ban()
    await ctx.reply(`I have banned ${member.displayName}.`)
  },
});
