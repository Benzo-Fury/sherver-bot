import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { publish } from '../../plugins/publish'

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Mutes a user.',
    options: [
        {
            name: "user",
            description: "The user you would like to mute.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "time",
            description: "The time this user should be muted for.",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "reason",
            description: "The reason this user is receiving a mute.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    execute: async (ctx) => {
        const user = ctx.interaction.options.getUser('user')!;
        const member = await ctx.guild?.members.fetch(user.id)!;
        const time = ctx.interaction.options.getNumber('time');
        const reason = ctx.interaction.options.getString('reason') || 'No reason provided'
        if (!member.manageable) {
            return await ctx.reply({ content: "I cannot mute that user. Ask a admin to check my role is above there highest role.", ephemeral: true })
        }
        try {
            await member.timeout(time, reason)
        } catch {
            return await ctx.reply({ content: "There was an error while processing your request.", ephemeral: true })
        }
        const embed = new EmbedBuilder()
            .setColor('#FF7F7F')
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setDescription(`Successfully muted ${member.displayName} with reason: ${reason}`)
            .setTimestamp()
        await ctx.reply({ embeds: [embed] })
    },
});
