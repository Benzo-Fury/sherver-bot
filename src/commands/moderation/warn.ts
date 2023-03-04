import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Events,
  Interaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextChannel,
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
    requirePermission("user", ["KickMembers"], 'You are not a moderator'),
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
    let rReason =
      ctx.interaction.options.getString("reason") ?? "No Reason Specified.";
    const user = ctx.interaction.options.getUser("user")!;
    const id = uniqid("w-");
    let logChannel: TextChannel | null = (await ctx.client.channels.fetch(
      "1080302218458177547"
    )) as TextChannel | null;
    if (!logChannel) {
      return ctx.interaction.reply(
        "NO LOG CHANNEL FOUND OR ITS TYPE HAS BEEN CHANGED. WARN VOIDED"
      );
    }

    async function waitForModalSubmit(): Promise<ModalSubmitInteraction> {
      return new Promise((resolve) => {
        const listener = (interaction: Interaction) => {
          if (interaction.isModalSubmit()) {
            ctx.client.off(Events.InteractionCreate, listener);
            resolve(interaction);
          }
        };
        ctx.client.on(Events.InteractionCreate, listener);
      });
    }

    async function warnUser(reason: string) {
      const isOtherReason = reason === "Other";

      // Set up the modal and input fields for other reason, if applicable
      let otherReasonInput;
      let modal;
      if (isOtherReason) {
        otherReasonInput = new TextInputBuilder()
          .setCustomId("otherReasonInput")
          .setLabel("Please specify the reason:")
          .setStyle(TextInputStyle.Short);

        modal = new ModalBuilder()
          .setCustomId("reasonCheckModal")
          .setTitle("Other Reason")
          .addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              otherReasonInput
            )
          );

        // Show the modal and wait for user input
        await ctx.interaction.showModal(modal);
        const modalSub = await waitForModalSubmit();
        reason = isOtherReason
          ? modalSub.fields.getTextInputValue("otherReasonInput")
          : rReason;
      }

      // Add the reason to the embed
      const logEmbed = new EmbedBuilder()
        .setColor("#ff5050")
        .addFields(
          { name: "Reason:", value: reason },
          { name: "ID:", value: id },
          {
            name: "Channel:",
            value: `<#${ctx.channel?.id}>`,
          },
          {
            name: "Moderator",
            value: ctx.user.id,
          }
        )
        .setFooter({ text: `ID: ${id}` })
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL(),
        });

      // Alert the user and log the warning
      await logChannel?.send({ embeds: [logEmbed] });
      try {
        const userEmbed = new EmbedBuilder()
          .setColor("#ff5050")
          .addFields(
            { name: "Reason:", value: reason, inline: true },
            { name: "ID:", value: id, inline: true }
          )
          .setAuthor({
            name: "You have been Warned!",
            iconURL: user.displayAvatarURL(),
          })
          .setTimestamp();
        await user.send({ embeds: [userEmbed] });
      } catch {
        // TODO: send message in channel alerting mod that user did not get notified
      }

      // Update the database
      await warnSchema.create({
        _id: id,
        channel: ctx.channel?.id,
        mod: ctx.user.id,
        time: new Date(),
        reason: reason,
        user: user.id,
      });
    }

    try {
      await warnUser(rReason);
      await ctx.interaction.reply({
        content: "User has been warned!",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await ctx.interaction.reply({
        content: "An error occurred.",
        ephemeral: true,
      });
    }
  },
});
