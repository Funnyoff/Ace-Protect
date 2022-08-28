const db = require('quick.db');
const Discord = require('discord.js');
const fs = require('fs').promises;
const {
     blue,
    logs,
    emojiAttention
} = require('../../config.json');

module.exports = (client) => {
    client.on('channelDelete', async (channel) => {

        if (!channel) return;
        if (!channel.guild) return;

        let color;
        if (db.get(`${channel.guild.id}.Color`)) {
            color = db.get(`${channel.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${channel.guild.id}.language`) === undefined || db.get(`${channel.guild.id}.language`) === null) {
            await db.set(`${channel.guild.id}.language`, "fr")
            language = db.get(`${channel.guild.id}.language`)
        }
        language = db.get(`${channel.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (channel.type == 'dm') return;

        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return

        let choice6 = db.get(`${channel.guild.id}.logsC`);

        if (choice6 == undefined || choice6 == null) {
            choice6 = true;
        }

        if (choice6 === true) {

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_DELETE',
            });

            if (!fetchedLogs) return;

            const channelDeleted = fetchedLogs.entries.first();

            if (!channelDeleted) return;

            const {
                executor
            } = channelDeleted

            let logchannel;
            if (db.get(`${channel.guild.id}.Logs`)) {
                logchannel = channel.guild.channels.cache.get(db.get(`${channel.guild.id}.Logs`))
            } else {
                logchannel = channel.guild.channels.cache.find((ch) => ch.name === logs)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.ChannelDelete} ${channel.name}  \n ${lang.BanAuthor} ${executor}`)
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