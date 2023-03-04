import { GuildMember, TextChannel } from 'discord.js';

const welcomeMessages = [
  'Welcome to our server! We hope you have a great time here!',
  'Hey there, welcome to the community!',
  'We\'re glad you\'re here! Welcome to our server!',
  'Welcome, friend! We hope you enjoy your stay with us!'
];

export default function welcomeNewMember(member: GuildMember) {
  // Get a random welcome message from the array
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const randomMessage = welcomeMessages[randomIndex];
  
  // Send the message to a specific channel (replace CHANNEL_ID with your desired channel ID)
  const channel = member.guild.channels.cache.get('CHANNEL_ID') as TextChannel;
  channel.send(`${randomMessage} ${member.user.username}!`);
}