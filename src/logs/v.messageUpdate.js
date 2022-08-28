const MessageEmbed = require('discord.js');
const db = require('quick.db')
const Discord = require('discord.js')
const {
     blue,
    logs,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('messageUpdate', async (oldMessage, newMessage) => {

        if (!oldMessage) return;
        if (!newMessage) return;
        if (!newMessage.guild) return;

        let color;
        if (db.get(`${newMessage.guild.id}.Color`)) {
            color = db.get(`${newMessage.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${newMessage.guild.id}.language`) === undefined || db.get(`${newMessage.guild.id}.language`) === null) {
            await db.set(`${newMessage.guild.id}.language`, "fr")
            language = db.get(`${newMessage.guild.id}.language`)
        }
        language = db.get(`${newMessage.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (oldMessage.partial) {
            try {
                await oldMessage.fetch()
            } catch {
                return
            }
        }
        if (newMessage.partial) {
            try {
                await newMessage.fetch()
            } catch {
                return
            }
        }

        if (newMessage.channel.type == 'dm') return;
        if (!newMessage.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (newMessage.author.bot) return;

        let choice7 = db.get(`${newMessage.guild.id}.logsMSG`);

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (newMessage.channel.type === 'dm') return;

            let logchannel;
            if (db.get(`${newMessage.guild.id}.Logs`)) {
                logchannel = newMessage.guild.channels.cache.get(db.get(`${newMessage.guild.id}.Logs`))
            } else {
                logchannel = newMessage.guild.channels.cache.find((ch) => ch.name === logs)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.messageUpdate1} ${newMessage.author} !** \n ${lang.messageUpdate2} ${oldMessage} \n ${lang.messageUpdate3} ${newMessage}`)
                .setTimestamp()
                .setFooter(`${client.user.username}` )
            if (!logchannel) return;
            try {
                logchannel.send(embed);
            } catch (error) {
                return;
            }
        }
    });
};