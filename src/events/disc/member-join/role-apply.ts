import { eventModule, EventType } from "@sern/handler";
import type { GuildMember } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "guildMemberUpdate",
  async execute(oldMember: GuildMember, newMember: GuildMember) {
    if(oldMember.pending && !newMember.pending) {
        const role = await newMember.guild.roles.fetch('1080306915004924026')
        if(!role) return;
        await newMember.roles.add(role)
    }
  },
});
