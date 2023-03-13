import { commandModule, CommandType } from "@sern/handler";
import { EmbedBuilder, TextChannel } from "discord.js";
import { publish } from "../../plugins/publish";
import userSchema from "../../utility/database/schemas/userSchema";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Pings the moderators.",
  execute: async (ctx) => {
    const userResult = await userSchema.findOne({ _id: ctx.user.id });
    if (userResult?.pingBlackListed) {
      return await ctx.reply({
        content: "You have been blacklisted from pinging the moderators.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
    .setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
    .setTitle('Mod Ping!')
    .setColor("#FF7F7F")
    .setDescription(`<@${ctx.user.id}> has pinged the moderators.`)
    .setTimestamp()

    const msg = await (ctx.channel as TextChannel).send('<@1080683192543105125>')
    await msg.delete()

    await ctx.reply({embeds: [embed]})
  },
});
