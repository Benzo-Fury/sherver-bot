import { eventModule, EventType } from "@sern/handler";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import dotenv from "dotenv";
import serverSchema from "../../utility/database/schemas/serverSchema";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAIAPI,
});
const openai = new OpenAIApi(configuration);

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    return
    if (member.guild.id !== "1080050500155748365") return;
    const serverResult: any = await serverSchema.findOne({
      _id: "1080050500155748365",
    });
    if (!serverResult) return;
    let welcomeChannel = await member.guild.channels.fetch(serverResult.memberRole) as TextChannel;
    if (!welcomeChannel) return;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Say this is a test",
      max_tokens: 7,
      temperature: 0,
    });
    const embed = new EmbedBuilder()
    .setAuthor({name: `Welcome ${member.displayName}!`})
    .setDescription(response.data.choices[0].text!)
    .setFooter({text: `You are the #${member.guild.memberCount} member`})
    .setColor("#ff5050");

    await welcomeChannel.send({embeds: [embed]})
  },
});
