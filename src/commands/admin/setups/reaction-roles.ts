import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from 'discord.js';
import { publish } from '../../../plugins/publish'

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Sends the default reaction role message.',
	execute: async (ctx) => {
		//creating embeds
		const pingEmbed = new EmbedBuilder()
			.setColor('#1f76cc')
			.setTitle('Ping Roles')
			.setURL('https://github.com/Benzo-Fury')
			.setDescription('***These reaction roles are accessible by any user***\n\n__**Roles:\n\**__🪵<@&1083955302296199238>\n📣<@&1083955549206478858>\n\nClick the buttons below with the correct emoji to gain roles.')
		//creating buttons
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`clp`)
					.setEmoji('🪵')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(`ap`)
					.setEmoji('📣')
					.setStyle(ButtonStyle.Secondary),
			);
		await (ctx.channel as TextChannel).send({embeds: [pingEmbed], components: [row]})
		//TODO: Finish reaction roles
	},
});
