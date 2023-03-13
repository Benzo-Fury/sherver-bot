import { commandModule, CommandType } from "@sern/handler";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
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
    {
      name: "reason",
      description: "The reason this user is being banned.",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  execute: async (ctx) => {
    // TODO: can specify that user can not apply for appeal
    const user = ctx.interaction.options.getUser("user")!;
    const member = await ctx.guild?.members.fetch(user)!;
    const reason = ctx.interaction.options.getString('reason') || "No reason provided."
    if (!member.bannable) {
      return await ctx.reply({
        content: "I cannot ban that member!",
        ephemeral: true,
      });
    }
    //alert user and give appeal option
    //creating embed
    const embed = new EmbedBuilder()
      .setColor("#ff5050")
      .setTitle("You've Been Banned!")
      .setDescription(`You've been banned from LispyRedHead's server. A ban appeal can be submitted by clicking the button bellow. \n\nThis ban was initiated with reason: \`\`${reason}\`\``)
      .setTimestamp()
    //creating row
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`appeal`)
          .setLabel('Ban Appeal')
          .setStyle(ButtonStyle.Primary),
      );
    try {
      await user.send({ embeds: [embed], components: [row] })
    } catch {
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff5050')
        .setTitle("Well this is awkward")
        .setDescription("A recent ban request failed to alert the user that they've been banned within dms. Not to worry, the ban has still been initiated and the user will not have access to appeal.")
        .setTimestamp()
      return await ctx.reply({ embeds: [embed] })
    }
    //ban user and alert mods
    await member.ban({ reason: reason })
    const banEmbed = new EmbedBuilder()
      .setColor('#ff5050')
      .setTitle('Banned')
      .setDescription(`I have banned ${user.username} with reason:\n\n\`\`${reason}\`\``)
      .setTimestamp()
    await ctx.reply({ embeds: [banEmbed] })
  },
});
