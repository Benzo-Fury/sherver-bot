import { commandModule, CommandType } from "@sern/handler";
import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { publish } from "../../plugins/publish";
import { requirePermission } from "../../plugins/requirePermission";
import { serverOnly } from "../../plugins/serverOnly";
import warnSchema from "../../utility/database/schemas/warnSchema";

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    serverOnly(["1080050500155748365"], "This command cannot be used here."),
    requirePermission("user", ["KickMembers"], "You are not a moderator"),
  ],
  description: "Searches the database for a specific warn.",
  options: [
    {
      name: "id",
      description: "The Id to search the database with.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const query = ctx.interaction.options.getString("id");
    if (!query?.startsWith("w-")) return ctx.reply("That is not a valid ID");
    const result = await warnSchema.findOne({ _id: query });
    if (!result)
      return ctx.reply({
        content:
          "No warning could be found. Try using /list to see all warning for a specific user.",
      });
    const user = await ctx.client.users.fetch(result.user);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Reason:",
          value: result.reason,
        },
        {
          name: "User Warned:",
          value: `<@${result.user}>`,
        },
        {
          name: "Mod:",
          value: `<@${result.mod}>`,
        },
        {
          name: "Channel:",
          value: `<#${result.channel}>`,
        },
        {
          name: "Time:",
          value: result.time,
        }
      )
      .setColor("BLACK" as ColorResolvable);
    await ctx.reply({ embeds: [embed] });
  },
});
