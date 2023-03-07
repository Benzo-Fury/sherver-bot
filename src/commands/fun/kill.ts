import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description:
    "Kills a user, be carful the chance of you getting muted is high.",
  options: [
    {
      name: "user",
      description: "The user you want to kill.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const random = Math.floor(Math.random() * 100) + 1;
    const random1 = Math.floor(Math.random() * 100) + 1;
    const user = ctx.interaction.options.getUser("user")!;
    const member = await ctx.guild?.members.fetch(user.id)!;
    if (!member.manageable)
      return await ctx.reply({
        content: "Cannot kill that user",
        ephemeral: true,
      });
    if (!member) {
      return await ctx.reply("err monkey");
    }
    try {
      if (random === random1) {
        member.timeout(10000);
        const embed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setAuthor({
            name: ctx.user.username,
            iconURL: ctx.user.displayAvatarURL(),
          })
          .setDescription(`You successfully killed ${member.displayName}.`)
          .setFooter({text: 'Congrats'});
        await ctx.reply({ embeds: [embed] });
      } else {
        await (await ctx.guild?.members.fetch(ctx.user.id)!).timeout(10000);
      }
    } catch {}
  },
});
