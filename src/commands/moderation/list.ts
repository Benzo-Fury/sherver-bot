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
    const result = await warnSchema.find({ user: user.id });
    if (!result)
      return ctx.reply({
        content: "No warnings have been found for that user.",
        ephemeral: true,
      });

    //creating embeds
    let embeds: EmbedBuilder[] = [];
    result.forEach((element) => {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "Reason:",
            value: element.reason,
          },
          {
            name: "User Warned:",
            value: `<@${element.user}>`,
          },
          {
            name: "Mod:",
            value: `<@${element.mod}>`,
          },
          {
            name: "Channel:",
            value: `<#${element.channel}>`,
          },
          {
            name: "Time:",
            value: element.time,
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

    console.log(embeds[currentEmbed - 1]);
    const sg = await ctx.reply({
      embeds: [embeds[currentEmbed]],
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
        console.log(embeds.length, embeds, currentEmbed);
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
          console.log(currentEmbed);
          currentEmbed = currentEmbed + 1;
          console.log(currentEmbed);
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
        embeds: [embeds[currentEmbed]],
        components: [endRow],
      });
    });
  },
});
