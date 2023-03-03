import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Events,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { publish } from "../../plugins/publish";
import { requirePermission } from "../../plugins/requirePermission";
import { serverOnly } from "../../plugins/serverOnly";
import warnSchema from "../../utility/database/schemas/warnSchema";
import uniqid from "uniqid";

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    serverOnly(["1080050500155748365"], "This command cannot be used here."),
    requirePermission("user", ["KickMembers"]),
  ], //require permissions plugin will ensure user is mod
  description: "Warns the specified user.",
  options: [
    {
      name: "user",
      description: "The user you would like to warn.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason this user is receiving a warning.",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        {
          name: "Spamming",
          value: "Spamming",
        },
        {
          name: "Harassment",
          value: "Harassment",
        },
        {
          name: "Posting Unsafe Material",
          value: "Unsafe material",
        },
        {
          name: "Advertisement",
          value: "Advertisement",
        },
        {
          name: "Other",
          value: "Other",
        },
      ],
    },
  ],
  execute: async (ctx, args) => {
    let reason = ctx.interaction.options.getString("reason")
      ? ctx.interaction.options.getString("reason")
      : "No Reason Specified.";
    const user = ctx.interaction.options.getUser("user")!;
    const id = uniqid("w-");
    //creating embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: user?.username, iconURL: user.displayAvatarURL() })
      .setColor("#ff5050")
      .addFields(
        {
          name: `User Warned:`,
          value: user.username,
        },
        {
          name: "Channel:",
          value: `<#${ctx.channel?.id}>`,
        },
        {
          name: "ID:",
          value: id,
        }
      );

    if (reason === "Other") {
      //Creating modal to check what mod would like to specify as the reason
      const modal = new ModalBuilder()
        .setCustomId("reasonCheckModal")
        .setTitle("Other Reason");

      const reasonInput = new TextInputBuilder()
        .setCustomId("otherReasonInput")
        .setLabel("What's your favorite color?")
        .setStyle(TextInputStyle.Short);
      const firstActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          reasonInput
        );
      modal.addComponents(firstActionRow);
      await ctx.interaction.showModal(modal);
      ctx.client.on(Events.InteractionCreate, async (interaction) => {
        if (
          !interaction.isModalSubmit() ||
          interaction.customId !== "reasonCheckModal"
        )
          return;
        reason = interaction.fields.getTextInputValue("otherReasonInput");
        embed.addFields({
          name: "Reason:",
          value: reason,
        });
        await interaction.reply({ embeds: [embed] });
      });
    } else {
      embed.addFields({
        name: "Reason:",
        value: `${reason}`,
      });
      await ctx.interaction.reply({ embeds: [embed] });
    }
    //updating database
    await warnSchema.create({
      _id: id,
      channel: ctx.channel?.id,
      mod: ctx.user.id,
      time: new Date(),
      reason: reason,
      user: user,
    });

    //alerting user
    try {
      user.send({ embeds: [embed] });
    } catch {
		// TODO: send message in channel alerting mod that user did not get notified
	}
  },
});
