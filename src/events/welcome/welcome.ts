export default eventModule({
    type: EventType.Discord,
    plugins : []],
    name: 'guildMemberAdd', //name of event.
    async execute(member: GuildMember) {
      (await member.guild.channels.fetch('channel-id') as TextChannel).send(`Welcome, ${member}`); 
    }
  })
  