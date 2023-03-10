import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, EmbedBuilder, TextChannel } from 'discord.js';
import { publish } from '../../plugins/publish'
import { requirePermission } from '../../plugins/requirePermission';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish(), requirePermission('user', ['Administrator'], 'You are not allowed to use that')],
    description: 'Creates a new changelog.',
    options: [
        {
            name: "version",
            description: "The version of this changelog.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "description",
            description: "The contents of this changelog.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    execute: async (ctx) => {
        const version = ctx.interaction.options.getString('version')!;
        const desc = ctx.interaction.options.getString('description')
        const embed = new EmbedBuilder()
        .setColor("#1f76cc")
        .setAuthor({name: `Update | ${version}`, iconURL: ctx.client.user?.displayAvatarURL()})
        .setDescription(desc)
        .setFooter({text: 'This update has been released at'})
        .setTimestamp()
        await (ctx.channel as TextChannel).send({embeds: [embed]}) //TODO: Ping changelog ping here
    },
});
