import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.Slash,
	plugins: [],
	description: 'A ping command',
	execute: async (ctx, args) => {
		await ctx.reply('Pong 🏓');
	},
});
