import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../../plugins/publish";
import userSchema from "../../utility/database/schemas/userSchema";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Blacklists a user from ever pinging mods.",
  options: [
    {
      name: "user",
      description: "The user you would like to blacklist",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const user = ctx.interaction.options.getUser("user")!;
    await userSchema.findOneAndUpdate(
      {
        _id: user.id,
      },
      {
        pingBlackListed: true,
      },
      {
        upsert: true,
      }
    );
    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `${user?.username} | Black Listed`,
        iconURL: user?.displayAvatarURL(),
      })
      .setDescription(
        `I have black listed ${user} from using the mod ping command.`
      )
      .setTimestamp();
    await ctx.reply({ embeds: [embed] });
  },
});
