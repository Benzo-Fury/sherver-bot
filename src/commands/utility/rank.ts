import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish";
import userSchema from "../../utility/database/schemas/userSchema";
import canvacord from "canvacord";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Gets your current rank.",
  execute: async (ctx) => {
    async function getUserRank(userId: any) {
      const user: any = await userSchema.findById(userId)!;

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
    console.log(await getUserRank(ctx.user.id));
    const userResult = await userSchema.findOne({ _id: ctx.user.id })!;
    if (!userResult)
      return await ctx.reply({ content: "Please try again", ephemeral: true });
    const rank = new canvacord.Rank()
      .setAvatar(ctx.user.displayAvatarURL())
      .setCurrentXP(userResult.xp)
      .setRequiredXP(1000)
      .setStatus("online")
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(ctx.user.username)
      .setDiscriminator(ctx.user.discriminator)
      .setRank(await getUserRank(ctx.user.id), "#");
    rank.build().then(async (buffer) => {
      canvacord.write(buffer, "RankCard.png");
      await ctx.reply({ files: [buffer] });
    });
  },
});
