const usersMap = new Map();
const {
    logs,
     blue,
    emojiAttention
} = require('../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
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
        let choice8 = db.get(`${guild.id}.antiban`);
        if (choice8 === undefined || choice8 === null) {
            choice8 = true;
        }

        if (choice8 === true) {

            if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;


            if (executor == client.user.id) return;
            if (executor.flags.has('VERIFIED_BOT')) return;
            const member = guild.members.cache.get(executor.id)
            if (!member) return;
            if (member) {
                if (member.roles.highest.position >= guild.me.roles.highest.position) return;
            }
            if (db.get(`${guild.id}.WLUsers`) === undefined || db.get(`${guild.id}.WLUsers`) === null) {
                if (guild.owner) {
                    db.push(`${guild.id}.WLUsers`, guild.owner.id);
                }
            }

            if (db.get(`${guild.id}.Owners`) === undefined || db.get(`${guild.id}.Owners`) === null) {
                if (guild.owner) {
                    db.push(`${guild.id}.Owners`, guild.owner.id);
                }
            }

            if (db.get(`${guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${guild.id}.Owners`).includes(executor.id)) return;


            if (!usersMap.has(executor.id)) {
                usersMap.set(executor.id, 2)
                setTimeout(() => {
                    usersMap.delete(executor.id)
                }, 1000 * 60);

            } else if (usersMap.get(executor.id) === 1) {
                //usersMap.get(executor.id) == usersMap.get(executor.id) + 1;
                usersMap.set(executor.id, usersMap.get(executor.id) + 1)

            } else {
                let logchannel;
                if (db.get(`${guild.id}.Logs`)) {
                    logchannel = guild.channels.cache.get(db.get(`${guild.id}.Logs`))
                } else {
                    logchannel = guild.channels.cache.find((ch) => ch.name === logs)
                }

                if (db.get(`${guild.id}.sanction`) === undefined || db.get(`${guild.id}.sanction`) === null) {
                    db.set(`${guild.id}.sanction`, `ban`)
                }

                if (!guild.me.hasPermission("BAN_MEMBERS")) return;
                if (db.get(`${guild.id}.sanction`) === 'ban') {
                    try {
                        member.guild.members.ban(executor, {
                            reason: 'Antiban',
                        });
                    } catch (error) {
                        return;
                    }
                }

                if (!guild.me.hasPermission("KICK_MEMBERS")) return;
                if (db.get(`${guild.id}.sanction`) === 'kick') {
                    try {
                        member.guild.member(executor).kick('Antiban')
                    } catch (error) {
                        return;
                    }
                }

                if (!guild.me.hasPermission("MANAGE_ROLES")) return;
                if (db.get(`${guild.id}.sanction`) === 'derank') {
                    try {
                        member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                    } catch (error) {
                        return;
                    }
                }

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} ${lang.EventsAete} ${db.get(`${guild.id}.sanction`)} ${lang.AntiBan} \n ${lang.BanReason} ${lang.AntiBanMotif}`)
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
    })

}