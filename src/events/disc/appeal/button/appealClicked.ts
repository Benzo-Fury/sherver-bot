import { eventModule, EventType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, ComponentType, EmbedBuilder, Interaction, ModalActionRowComponentBuilder, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import dotenv from "dotenv";
import userSchema from "../../../../utility/database/schemas/userSchema";

dotenv.config();

export default eventModule({
    type: EventType.Discord,
    plugins: [],
    name: "interactionCreate",
    async execute(i: Interaction) {
        if (!i.isButton()) return;
        if (i.customId !== 'appeal') return;
        const userResult = await userSchema.findOne({ _id: i.user.id })
        if (userResult && userResult.appealed) {
            return await i.reply("You've already submitted an appeal.")
        }
        let reason: string
        //creating modal for reason
        const modal = new ModalBuilder()
            .setCustomId('reasonModal')
            .setTitle('Why?');
        const reasonInput = new TextInputBuilder()
            .setCustomId('reasonInput')
            .setLabel("Why should you be unbanned?")
            .setStyle(TextInputStyle.Paragraph);
        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(reasonInput);
        modal.addComponents(firstActionRow);
        //awaiting modal
        i.awaitModalSubmit({ time: 60_000 })
            .then(interaction => {
                if (!interaction.isModalSubmit()) return;
                reason = interaction.fields.getTextInputValue('reasonInput');
            })
            .catch(async err => { await i.user.send('You did not submit a recent modal. This has not counted towards you\'r 1 ban appeal.') });
        const guild = await i.client.guilds.fetch('1080050500155748365')
        if (!guild) return console.log('NO GUILD');
        const channel = await guild.channels.fetch('1082600734547263510') as TextChannel
        if (!channel) return console.log('NO CHANNEL');
        await userSchema.findOneAndUpdate(
            {
                _id: i.user.id
            },
            {
                appealed: true
            },
            {
                upsert: true
            }
        )
        //creating embeds and rows
        const embed = new EmbedBuilder()
            .setColor("#ff5050")
            .setAuthor({ name: `${i.user.username} | Appeal`, iconURL: i.user.displayAvatarURL() })
            .setDescription(`${i.user.tag} has submitted a ban appeal with reason: \n\n \`\`todo\`\``)
            .setTimestamp()
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`unban`)
                    .setLabel('Unban')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`denied`)
                    .setLabel('Deny')
                    .setStyle(ButtonStyle.Primary)
            );
        //sending embeds and rows
        const msg = await channel.send({ embeds: [embed], components: [row] })
        await i.reply({ content: "Your appeal has been submitted. Our admins will review your appeal and get back to you within 1 - 24 hours." })
        //awaiting button submit
        const filter = (ie: any) => {
            ie.deferUpdate()
            return ie.user.id === i.user.id;
        };
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        msg.awaitMessageComponent({ componentType: ComponentType.Button, time: 60000 })
            .then(async interaction => {
                switch (interaction.customId) {
                    case 'unban':
                        {
                            //unban user here and alert user
                            const unbannedEmbed = new EmbedBuilder()
                                .setTitle('Unbanned')
                                .setColor('Green')
                                .setDescription('Your ban appeal has been reviewed and accepted. Your ban has been lifted and you can rejoin from the link below:')
                                .setTimestamp()
                            try {
                                await i.user.send({ embeds: [unbannedEmbed] })
                                await i.user.send("https://discord.gg/m2v5BugtVf")
                            } catch {
                                await interaction.editReply('User has been unbanned. Could not notify them!')
                                break;
                            }
                            await interaction.editReply('User has been unbanned.')
                            break;
                        }
                    case 'denied':
                        {
                            //create modal for why user is being unbanned and send to them
                            const modal = new ModalBuilder()
                                .setCustomId(`ap-den-${i.user.id}`)
                                .setTitle('Denied');
                            const reasonInput = new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel("What is the reason this user is being denied?")
                                .setStyle(TextInputStyle.Short);
                            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(reasonInput);
                            modal.addComponents(firstActionRow);
                            await interaction.showModal(modal)
                        }
                        break;
                }

            })
            .catch(() => {
                msg.edit({ embeds: [embed], components: [row] })
            });
    },
});
