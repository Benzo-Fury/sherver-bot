import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { publish } from '../../plugins/publish'

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Shows the specified users profile picture.',
    options: [
        {
            name: "user",
            description: "The users pfp you would like to see.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
	execute: async (ctx) => {
        const user = ctx.interaction.options.getUser('user') || ctx.user
		const embed = new EmbedBuilder()
        .setAuthor({name: `Pfp - ${user.username}`})
        .setImage(user.displayAvatarURL({size: 1024}))
        .setColor("#2b2d31")
        .setTimestamp()
        await ctx.reply({embeds: [embed]})
	},
});
