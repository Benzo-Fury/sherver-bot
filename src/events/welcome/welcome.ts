export default eventModule({
    type: EventType.Discord,
    plugins : []],
    name: 'guildMemberAdd', //name of event.
    async execute(member: GuildMember) {
      (await member.guild.channels.fetch('1080053561863442464') as TextChannel).send(`Welcome, ${member}`); 
    }
  })
