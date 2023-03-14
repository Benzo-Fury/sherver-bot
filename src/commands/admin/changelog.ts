import { commandModule, CommandType } from "@sern/handler";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { publish } from "../../plugins/publish";
import { requirePermission } from "../../plugins/requirePermission";

export default commandModule({
  type: CommandType.Text,
  plugins: [
    requirePermission(
      "user",
      ["Administrator"],
      "You are not allowed to use that"
    ),
  ],
  description: "Creates a new changelog.",
  execute: async (ctx, args) => {
    const version = args[1][0]
    const desc = ctx.message.content.replace(`)changelog ${args[1][0]} `, '')
    if (!version) {
      return await ctx.reply({
        content: "Specify a version.",
        ephemeral: true,
      });
    }
    if (!desc) {
      return await ctx.reply({ content: "Specify a desc.", ephemeral: true });
    }
    const msg = await (ctx.channel as TextChannel).send('<@&1083955302296199238>')
    await msg.delete()
    const embed = new EmbedBuilder()
      .setColor("#1f76cc")
      .setAuthor({
        name: `Release | ${version}`,
        iconURL: ctx.client.user?.displayAvatarURL(),
      })
      .setDescription(desc)
      .setFooter({ text: "This update has been released:" })
      .setTimestamp();
    await (ctx.channel as TextChannel).send({ embeds: [embed] }); //TODO: Ping changelog ping here
  },
});
