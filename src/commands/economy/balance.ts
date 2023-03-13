import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../../plugins/publish";
import { serverOnly } from "../../plugins/serverOnly";
import userSchema from "../../utility/database/schemas/userSchema";
import dotenv from 'dotenv'

dotenv.config()

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    serverOnly(["1080050500155748365"], "This command cannot be used here."),
  ],
  description: "Returns your current balance.",
  options: [
    {
      name: "user",
      description: "The user's who's balance you would like to see.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  execute: async (ctx) => {
    const user = ctx.interaction.options.getUser("user")! || ctx.user;
    const bal = await userSchema.findOne({_id: user.id})
    if(!bal) {
        await userSchema.create({_id: user.id})
        return await ctx.reply("You do not have any money right now.")
    }
    const embed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setAuthor({name: `${ctx.user.username} | Balance`, iconURL: ctx.user.displayAvatarURL()})
    .setDescription(`You currently have **${bal.money} ${process.env.CURRENCY}**`)

    await ctx.reply({embeds: [embed]})
  },
});
