import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish";
import userSchema from "../../utility/database/schemas/userSchema";
import canvacord from "canvacord";
import { ApplicationCommandOptionType } from "discord.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Gets your current rank.",
  options: [
    {
      name: "user",
      description: "The user who's rank you would like to see.",
      type: ApplicationCommandOptionType.User,
      required: false
    }
  ],
  execute: async (ctx) => {
    const user = ctx.interaction.options.getUser('user') || ctx.user
    async function getUserRank(userId: any) {
      const user: any = await userSchema.findById(userId)!;

      if (!user) {
        return await ctx.reply({
          content: "Please try that again.",
          ephemeral: true,
        });
      }

      const rank = await userSchema.aggregate([
        {
          $match: {
            $or: [
              { level: { $gt: user.level } },
              {
                $and: [
                  { level: { $eq: user.level } },
                  { xp: { $gt: user.xp } },
                ],
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      if (rank.length === 0) {
        // The user is ranked #1 if there are no users with a higher level
        return 1;
      } else {
        // Add 1 to the rank to account for the user themselves
        return rank[0].count + 1;
      }
    }
    const userResult = await userSchema.findOne({ _id: user })!;
    if (!userResult) return;
    const rank = new canvacord.Rank()
      .setAvatar(user.displayAvatarURL())
      .setCurrentXP(userResult.xp)
      .setRequiredXP(1000)
      .setStatus("online")
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
      .setRank(await getUserRank(user), "#")
      .setLevel(userResult.level)
      .setCustomStatusColor("#ADD8E6");
    rank.build().then(async (buffer) => {
      canvacord.write(buffer, "RankCard.png");
      await ctx.reply({ files: [buffer] });
    });
  },
});
