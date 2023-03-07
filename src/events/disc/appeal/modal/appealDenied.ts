import { eventModule, EventType } from "@sern/handler";
import { Client, EmbedBuilder, Interaction } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
    type: EventType.Discord,
    plugins: [],
    name: "interactionCreate",
    async execute(i: Interaction) {
        if (!i.isModalSubmit()) return;
        if (!i.customId.startsWith('ap-den')) return; //appeal denied
        const reason = i.fields.getTextInputValue('reason');
        const userID = i.customId.replace('ap-den-', '')!
        const user = await i.client.users.fetch(userID)!
        const embed = new EmbedBuilder()
            .setTitle("Denied")
            .setColor('#ff5050')
            .setDescription(`Your recent appeal request has been denied with the following reason. \n\n\`\`${reason}\`\``)
            .setTimestamp()
        await user.send({ embeds: [embed] })
    },
});
