import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { publish } from "../../plugins/publish";
import { requirePermission } from "../../plugins/requirePermission";
import { serverOnly } from "../../plugins/serverOnly";
import serverSchema from "../../utility/database/schemas/serverSchema";

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    serverOnly(["1080050500155748365"], "This command cannot be used here."),
    requirePermission("user", ["Administrator"], "You are not a moderator")],
  description: "Sets up the verification for the server.",
  options: [
    {
      name: "channel",
      description:
        "The channel you would like to have verification running in.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    }
  ],
  execute: async (ctx) => {
    const channel = ctx.interaction.options.getChannel('channel')!;
    if (channel.type !== ChannelType.GuildText) {
      return ctx.reply({ content: "The channel must be a text channel!", ephemeral: true });
    };
    await serverSchema.findOneAndUpdate(
      {
        _id: ctx.guild?.id
      },
      {
        welcomeChannel: channel.id
      },
      {
        upsert: true
      }
    )
    const msg = await ctx.reply('That channel has now been set to the welcome channel.')
    setTimeout(async () => {
      try {
        await msg.delete()
      } catch {}
    }, 2000);
  },
});
