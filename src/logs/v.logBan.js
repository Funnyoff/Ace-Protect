const Discord = require('discord.js');
const {
     blue,
    emojiValidé,
    logs,
    emojiAttention
} = require('../../config.json');
const db = require('quick.db')
const fs = require('fs').promises;

module.exports = (client) => {

    client.on('guildBanAdd', async (guild, user) => {

        if (!guild) return;
        if (!user) return;

        let color;
        if (db.get(`${guild.id}.Color`)) {
            color = db.get(`${guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
            await db.set(`${guild.id}.language`, "fr")
            language = db.get(`${guild.id}.language`)
        }
        language = db.get(`${guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!guild.me.hasPermission("ADMINISTRATOR")) return;
        let choice5 = db.get(`${guild.id}.logsKB`);

        if (choice5 == undefined || choice5 == null) {
            choice5 = true;
        }

        if (choice5 === true) {

            if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            let logchannel;
            if (db.get(`${guild.id}.Logs`)) {
                logchannel = guild.channels.cache.get(db.get(`${guild.id}.Logs`))
            } else {
                logchannel = guild.channels.cache.find((ch) => ch.name === logs)
            }

            if (!banLog) {

                const embed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${user.tag} ${lang.logBan1}  ${guild.name}, ${lang.logBan2}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);
                if (!logchannel) return
                else logchannel.send(embed1)
            }

            const {
                executor,
                target
            } = banLog;

            if (executor == client.user.id) return;

            if (banLog) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${target} ${lang.logBan1} ${guild.name}.\n ${lang.BanAuthor} ${executor}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);

                if (!logchannel) return
                try {
                    logchannel.send(embed)
                } catch (error) {
                    return;
                }
            }
        }
    });
}