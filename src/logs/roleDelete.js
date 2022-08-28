const db = require('quick.db');
const Discord = require('discord.js');
const fs = require('fs').promises;
const {
     blue,
    logs,
    emojiAttention
} = require('../../config.json');

module.exports = (client) => {
    client.on('roleDelete', async (role) => {

        if (!role) return;
        if (!role.guild) return;

        let color;
        if (db.get(`${role.guild.id}.Color`)) {
            color = db.get(`${role.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${role.guild.id}.language`) === undefined || db.get(`${role.guild.id}.language`) === null) {
            await db.set(`${role.guild.id}.language`, "fr")
            language = db.get(`${role.guild.id}.language`)
        }
        language = db.get(`${role.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!role.guild.me.hasPermission("ADMINISTRATOR")) return

        let choice7 = db.get(`${role.guild.id}.logRoles`);

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (!role.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: 'ROLE_DELETE',
            });

            if (!fetchedLogs) return;

            const roleCreated = fetchedLogs.entries.first();

            if (!roleCreated) return;

            const {
                executor
            } = roleCreated

            let logchannel;
            if (db.get(`${role.guild.id}.Logs`)) {
                logchannel = role.guild.channels.cache.get(db.get(`${role.guild.id}.Logs`))
            } else {
                logchannel = role.guild.channels.cache.find((ch) => ch.name === logs)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.roleDelete} ${role.name}  \n ${lang.BanAuthor} ${executor}`)
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