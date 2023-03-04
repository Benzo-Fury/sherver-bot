import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish'

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'A ping command',
	execute: async (ctx) => {
		await ctx.reply('Pong 🏓');
	},
});
