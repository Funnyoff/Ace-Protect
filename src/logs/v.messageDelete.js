const db = require('quick.db');
const Discord = require('discord.js');
const {
     blue,
    logs,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('messageDelete', async (message) => {

        if (!message) return;
        if (!message.guild) return;

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
            await db.set(`${message.guild.id}.language`, "fr")
            language = db.get(`${message.guild.id}.language`)
        }
        language = db.get(`${message.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (message.channel.type == 'dm') return
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (message.author.bot) return;

        let choice7 = db.get(`${message.guild.id}.logsMSG`);

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (message.channel.type === 'dm') return;

            if (!message.guild.me.hasPermission("VIEW_AUDIT_LOG")) return

            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            });

            if (!fetchedLogs) return;

            const messageDeleted = fetchedLogs.entries.first();

            if (!messageDeleted) return

            const {
                executor
            } = messageDeleted

            let logchannel;
            if (db.get(`${message.guild.id}.Logs`)) {
                logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
            } else {
                logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.messageDelete1} ${message.author}  \n ${lang.messageDelete2} ${message.content}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `);
            if (!logchannel) return;
            try {
                logchannel.send(embed);
            } catch (error) {
                return;
            }
        }
    });
};