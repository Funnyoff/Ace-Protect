const Discord = require('discord.js');
const db = require('quick.db');
const {
     blue,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {

        if (!user) return;
        if (!reaction) return;
        
        let message = reaction.message;
        if (!message.guild) return;
        const member = message.guild.members.cache.get(user.id);
        if(!member) return;
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return;
        if (user.bot) return;

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (db.get(`${message.guild.id}.RoleMenu.${message.id}.roleReact`)) {
            let roleid = db.get(`${message.guild.id}.RoleMenu.${message.id}.roleReact`).find(r => r.reaction.includes(reaction.id ? reaction.emoji.id : reaction.emoji.name))
            if (!roleid) return;
            try {
                member.roles.add(roleid.role)
            } catch {
                return;
            }
        }
    })
}