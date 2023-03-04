import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  ComponentType,
  EmbedBuilder,
  PermissionsBitField,
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
  description: "Lists all warns a specific user has.",
  options: [
    {
      name: "user",
      description: "The user who's warns you would like to see.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const user = ctx.interaction.options.getUser("user")!;
    const result: any = await warnSchema.find({ user: user.id });
    if (result.length === 0)
      return ctx.reply({
        content: "No warnings have been found for that user.",
        ephemeral: true,
      });

    //creating embeds
    let embeds: EmbedBuilder[] = [];
    result.forEach((element: any) => {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "Channel:",
            value: `<#${element.channel}>`,
            inline: true,
          },
          {
            name: "User Warned:",
            value: `<@${element.user}>`,
            inline: true,
          },
          {
            name: "Mod:",
            value: `<@${element.mod}>`,
            inline: true,
          },
          {
            name: "Reason:",
            value: element.reason,
            inline: true,
          },
          {
            name: "ID:",
            value: element._id,
            inline: true,
          },
          {
            name: "Time:",
            value: element.time,
            inline: true,
          }
        )
        .setColor("BLACK" as ColorResolvable);
      embeds.push(embed);
    });
    //creating buttons
    let currentEmbed = 1;
    function createRow(currentEmbed: Number): ActionRowBuilder<ButtonBuilder> {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("left")
          .setLabel("<<")
          .setDisabled(currentEmbed == 1 ? true : false)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("right")
          .setLabel(">>")
          .setDisabled(embeds.length == currentEmbed ? true : false)
          .setStyle(ButtonStyle.Primary)
      );
      return row;
    }

    const sg = await ctx.reply({
      embeds: [embeds[currentEmbed - 1]],
      components: [createRow(currentEmbed)],
    });

    //starting collector
    const collector = sg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000,
      maxComponents: Infinity,
    });

    collector.on("collect", async (i) => {
      if (
        (i.member?.permissions as Readonly<PermissionsBitField>).has([
          PermissionsBitField.Flags.KickMembers,
        ])
      ) {
        if (i.customId == "left") {
          //left
          currentEmbed = currentEmbed - 1;
          await i.deferUpdate();
          await ctx.interaction.editReply({
            embeds: [embeds[currentEmbed - 1]],
            components: [createRow(currentEmbed)],
          });
        } else {
          //right
          currentEmbed = currentEmbed + 1;
          await i.deferUpdate();
          await ctx.interaction.editReply({
            embeds: [embeds[currentEmbed - 1]],
            components: [createRow(currentEmbed)],
          });
        }
      } else {
        i.reply({ content: `You are not a moderator!`, ephemeral: true });
      }
    });
    const endRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("left")
        .setLabel("<<")
        .setDisabled(true)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("right")
        .setLabel(">>")
        .setDisabled(true)
        .setStyle(ButtonStyle.Primary)
    );
    collector.on("end", (i) => {
      ctx.interaction.editReply({
        embeds: [embeds[currentEmbed - 1]],
        components: [endRow],
      });
    });
  },
});
