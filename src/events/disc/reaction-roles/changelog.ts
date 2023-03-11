import { eventModule, EventType } from "@sern/handler";
import type { Interaction } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "interactionCreate",
  async execute(i: Interaction) {
    //TODO: check if user already has the role and deny them from adding again
    if (!i.isButton()) return;
    if (i.customId !== "clp") return;
    const role = await i.guild?.roles.fetch("1083955302296199238");
    if (!role)
      return await i.reply({
        content: "Hmm, I couldn't find the right role to give you.",
        ephemeral: true,
      });
    const member = await i.guild?.members.fetch(i.user.id);
    if (!member) throw new Error("No member found!");
    await member.roles.add(role);
    await i.reply({
      content: "You now have the new changelog ping.",
      ephemeral: true,
    });
  },
});
