import { eventModule, EventType } from "@sern/handler";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import dotenv from "dotenv";
import serverSchema from "../../../utility/database/schemas/serverSchema";

dotenv.config();

let welcomeMsgs = [
  "Welcome to LispyRedHead's server! We're so happy you've decided to join our community. To access all of our channels and features, please click the verification button in <#1080715513140871258>",
  "Hey there! Thanks for joining LispyRedHead's server. We're a community for everyone, and we can't wait to get to know you better. Just click the verification button in <#1080715513140871258> to unlock the rest of the server.",
  "Welcome to LispyRedHead's server, a place where everyone is welcome. To access all the channels and features, make sure you verify your account by clicking the button in <#1080715513140871258>",
  "Hi there! We're thrilled you've joined LispyRedHead's server. Our community is open to all, and we can't wait to see you inside. To get started, please click the verification button in <#1080715513140871258>",
  "Thanks for joining LispyRedHead's server! We're a community that embraces diversity, and we're glad you're here. To unlock the rest of the server, please click the verification button in <#1080715513140871258>",
  "Welcome to LispyRedHead's server, where everyone is welcome to join our community. To access all the channels and features, make sure you click the verification button in <#1080715513140871258>",
  "Hey, welcome to LispyRedHead's server! We're excited to have you join us. To get the most out of our community, please verify your account by clicking the button in <#1080715513140871258>",
  "Welcome to LispyRedHead's server, a community where everyone is valued and respected. To unlock the rest of the server, make sure you verify your account by clicking the button in <#1080715513140871258>"
]

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
    let welcomeChannel = await member.guild.channels.fetch(serverResult.welcomeChannel) as TextChannel;
    if (!welcomeChannel) return;
    const embed = new EmbedBuilder()
      .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL()})
      .setTitle('Welcome!')
      .setDescription(welcomeMsgs[Math.floor(Math.random() * welcomeMsgs.length)])
      .setFooter({ text: `You are the #${member.guild.memberCount} member.` })
      .setColor("#1f76cc")
      .setImage('https://i.imgur.com/ZDgirZI.jpg');

    await welcomeChannel.send({ content: `||<@${member.id}>||` ,embeds: [embed] })
  },
});
