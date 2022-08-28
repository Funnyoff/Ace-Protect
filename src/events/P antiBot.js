const {
    logs,
     blue,
    emojiAttention
} = require('../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs').promises;

module.exports = (client) => {

    client.on('guildMemberAdd', async (member) => {

        if (!member.guild) return;

        let color;
        if (db.get(`${member.guild.id}.Color`)) {
            color = db.get(`${member.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${member.guild.id}.language`) === undefined || db.get(`${member.guild.id}.language`) === null) {
            await db.set(`${member.guild.id}.language`, "fr")
            language = db.get(`${member.guild.id}.language`)
        }
        language = db.get(`${member.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let choice9 = db.get(`${member.guild.id}.antibot`);
        if (!member.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice9 === undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'BOT_ADD',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (member.id !== target.id) return
            if (!member) return;

            if (target.flags.has('VERIFIED_BOT')) return;
            if (member.roles.highest.position >= member.guild.me.roles.highest.position) return;
            if (executor == client.user.id) return;

            if (db.get(`${member.guild.id}.WLUsers`) === undefined || db.get(`${member.guild.id}.WLUsers`) === null) {
                db.push(`${member.guild.id}.WLUsers`, member.guild.owner.id);
            }

            if (db.get(`${member.guild.id}.Owners`) === undefined || db.get(`${member.guild.id}.Owners`) === null) {
                db.push(`${member.guild.id}.Owners`, member.guild.owner.id);
            }

            if (db.get(`${member.guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${member.guild.id}.Owners`).includes(executor.id)) return;


            let logchannel;
            if (db.get(`${member.guild.id}.Logs`)) {
                logchannel = member.guild.channels.cache.get(db.get(`${member.guild.id}.Logs`))
            } else {
                logchannel = member.guild.channels.cache.find((ch) => ch.name === logs)
            }

            if (db.get(`${member.guild.id}.sanction`) === undefined || db.get(`${member.guild.id}.sanction`) === null) {
                db.set(`${member.guild.id}.sanction`, `ban`)
            }
            if (db.get(`${member.guild.id}.sanction`) === 'ban') {
                try {
                    member.guild.members.ban(executor, {
                        reason: 'Anti-BOT',
                    });
                } catch {
                    return;
                }
            }
            if (db.get(`${member.guild.id}.sanction`) === 'kick') {
                try {
                    member.guild.member(executor).kick('Anti-BOT')
                } catch {
                    return;
                }
            }
            if (db.get(`${member.guild.id}.sanction`) === 'derank') {
                try {
                    member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                } catch {
                    return;
                }
            }
            try {
                member.guild.members.ban(target, {
                    reason: 'Anti-BOT',
                });
            } catch {
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${db.get(`${member.guild.id}.sanction`)} ${lang.AntiBot} \n ${lang.BanReason} ${lang.AntiBotMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

}