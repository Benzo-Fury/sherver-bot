import { eventModule, EventType } from "@sern/handler";
import type { Interaction, RoleResolvable } from "discord.js";
import serverSchema from "../../utility/database/schemas/serverSchema";
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "verify") return;
    if (!interaction.guild) return;
    const serverResult: any = await serverSchema.findOne({
      _id: interaction.guild?.id,
    });
    if (!serverResult) return;
    const member = interaction.guild.members.cache.get(interaction.user.id)!;
    await member?.roles.add(serverResult.memberRole);
    await interaction.reply({content: "You are now a verified member!", ephemeral: true})
  },
});

//check if this works and add cmd to add verification messages.