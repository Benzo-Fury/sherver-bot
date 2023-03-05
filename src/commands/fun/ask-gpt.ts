import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish";
import { Configuration, OpenAIApi } from "openai";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAIAPI,
});
const openai = new OpenAIApi(configuration);

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Asks chat gpt a question!",
  options: [
    {
      name: "question",
      description: "The question you would like to ask GPT",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx) => {
    const question = ctx.interaction.options.getString("question")!;
    const mod = await openai.createModeration({
      input: question,
    });
    if (mod.data.results[0].flagged === true) {
      return await ctx.reply({
        content:
          "That content may been considered inappropriate or disrespectful.",
        ephemeral: true,
      });
    }
    await ctx.interaction.deferReply();
    if (question.length > 155) {
      return await ctx.reply({
        content: "That question is to long.",
        ephemeral: true,
      });
    }
    let res: any;
    try {
      res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question + ".",
        max_tokens: 4000,
      });
    } catch (err) {
      console.log(err);
      const errEmbed = new EmbedBuilder()
        .setColor("#FF3333")
        .setAuthor({ name: "Woops!" })
        .setDescription(
          "Oopths, it lookths like thomething went wrong. Maybe the gremlinths in our thythtem ate your command. We'll thend them to bed without thupper and try again, thall we?"
        )
        .setTimestamp();
      return await ctx.interaction.editReply({ embeds: [errEmbed] });
    }
    res = res.data.choices[0].text!;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: question,
        iconURL:
          "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
      })
      .setColor("#2b2d31")
      .setDescription(res.length > 2000 ? res.substring(0, 2000) : res)
      .setFooter({
        text: `Using gpt-3.5-turbo text completion.`,
      });
    await ctx.interaction.editReply({ embeds: [embed] });
  },
});
