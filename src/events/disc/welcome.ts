import { eventModule, EventType } from "@sern/handler";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import dotenv from "dotenv";
import serverSchema from "../../utility/database/schemas/serverSchema";
import { boostAI } from "boost-ai";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    if (member.guild.id !== "1080050500155748365") return;
    const serverResult: any = await serverSchema.findOne({
      _id: "1080050500155748365",
    });
    if (!serverResult) return;
    let welcomeChannel = await member.guild.channels.fetch(serverResult.memberRole) as TextChannel;
    if (!welcomeChannel) return;
    const api = new boostAI(process.env.OPENAIAPI || "");
    const response = await api.generateText({
      prompt: `Write me a welcome message for a new user joining a discord server called ${member.guild.name}. You should write the welcome message with a lisp in the text. The users name is ${member.displayName}`,
    });
    const embed = new EmbedBuilder()
    .setAuthor({name: `Welcome ${member.displayName}!`})
    .setDescription(response as string)
    .setFooter({text: `You are the #${member.guild.memberCount} member`})
    .setColor("#ff5050");

    await welcomeChannel.send({embeds: [embed]})
  },
});
