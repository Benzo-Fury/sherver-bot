import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
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
  description: "Removes a specific warn.",
  options: [
    {
      name: "id",
      description: "The ID of the warning you would like to remove.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx, args) => {
    const ID = ctx.interaction.options.getString("id");
    if (!ID?.startsWith("w-"))
      return ctx.reply({ content: "That is not a valid ID", ephemeral: true });
    if (!(await warnSchema.findOne({ _id: ID })))
      return await ctx.reply({content: "That warning does not exist", ephemeral: true});
    await warnSchema.deleteOne({ _id: ID });
    await ctx.reply("That warning has been removed.");
  },
});
