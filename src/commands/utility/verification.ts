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
    },
    {
      name: "role",
      description: "The role that will be given to users.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const channel = (await ctx.interaction.options.getChannel(
      "channel"
    )) as TextChannel;
    const role = ctx.interaction.options.getRole("role")!;
    if (channel.type !== ChannelType.GuildText) {
      return await ctx.reply({
        content: "That channel is not a plain text channel.",
        ephemeral: true,
      });
    }
    await serverSchema.findOneAndUpdate(
      {
        _id: ctx.guild?.id,
      },
      {
        memberRole: role.id,
        welcomeChannel: channel.id,
      },
      {
        upsert: true,
      }
    );
    //creating buttons and sending messages
    const msg = await ctx.reply("Verification setup complete.");
    //creating embed here
    const embed = new EmbedBuilder()
      .setTitle("Verification!")
      .setDescription(
        "To gain full access to this server you are required to click/tap the button below. By doing this you are agreeing to abide by our <#1080054195048161310>."
      )
      .setColor("#00FF00");
    //creating row here
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("verify")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Success)
    );
    await channel.send({ embeds: [embed], components: [row] });
    setTimeout(() => {
      msg.delete();
    }, 2000);
  },
});
