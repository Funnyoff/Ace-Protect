const Discord = require('discord.js');
const db = require('quick.db');
const {
     blue,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {

        if(!reaction) return;
        if(!user) return;
        let message = reaction.message;
        if(!message.guild) return;

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return;

        let language;
        if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
            await db.set(`${message.guild.id}.language`, "fr")
            language = db.get(`${message.guild.id}.language`)
        }
        language = db.get(`${message.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        const member = message.guild.members.cache.get(user.id);
        const emoji = reaction.emoji.name;
        const userReaction = message.reactions.cache.filter(reaction => reaction.users.cache.has(member.user.id));
        if (member.user.bot) return;

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (["🎟️"].includes(emoji)) {
            switch (emoji) {
                case "🎟️":
                    if (db.get(`${reaction.message.guild.id}.ticket`) === undefined) return;
                    if (reaction.message.id !== db.get(`${reaction.message.guild.id}.ticket`)) return;
                    reaction.users.remove(member.user.id);
            }
            let alreadyOpenned = false;
            reaction.message.guild.channels.cache.filter(c => c.name.startsWith("ticket-")).forEach(c => {
                if (c.topic === user.id) alreadyOpenned = true
            })
            if(alreadyOpenned) return;

            message.guild.channels.create(`ticket-${user.username}`, {
                type: 'text'
            }).then(async channel => {
                channel.setTopic(`${user.id}`);

                const everyone = message.guild.roles.everyone

                await channel.updateOverwrite(everyone, {
                    "VIEW_CHANNEL": false,
                    "SEND_MESSAGES": false
                })

                await channel.updateOverwrite(message.guild.members.cache.get(user.id), {
                    "VIEW_CHANNEL": true,
                    "SEND_MESSAGES": true,
                    "READ_MESSAGE_HISTORY": true,
                    "EMBED_LINKS": true
                })

                let Embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`🎟️ Ticket ${user.username}`)
                    .setDescription(`${user} ${lang.Ticket1} ${message.guild.name} !
                    ${lang.Ticket2}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);

                channel.send(Embed).then(async msg => {
                    await msg.react("🔒")
                })
            })
        }

        if (["🔒"].includes(emoji)) {
            switch (emoji) {
                case "🔒":
                    try {
                        if (!message.channel.name.startsWith("ticket-")) return;
                        for (const reaction of userReaction.values()) {
                            reaction.users.remove(member.user.id);
                        }
                    } catch (err) {

                    }
            }
            message.channel.delete()
        }
    })

}