const Discord = require('discord.js');
const db = require('quick.db');
const {
    blue,
    emojiAttention,
    logs
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("guildMemberUpdate", async (oldMember, newMember) => {

        if (!oldMember) return;
        if (!newMember) return;

        if (!newMember.guild.me.hasPermission("ADMINISTRATOR")) return;

        let color;
        if (db.get(`${newMember.guild.id}.Color`)) {
            color = db.get(`${newMember.guild.id}.Color`)
        } else {
            color = "2f3136";
        }

        let language;
        if (db.get(`${newMember.guild.id}.language`) === undefined || db.get(`${newMember.guild.id}.language`) === null) {
            await db.set(`${newMember.guild.id}.language`, "fr")
            language = db.get(`${newMember.guild.id}.language`)
        }
        language = db.get(`${newMember.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let logchannel;
        if (db.get(`${newMember.guild.id}.Logs`)) {
            logchannel = newMember.guild.channels.cache.get(db.get(`${newMember.guild.id}.Logs`))
        } else {
            logchannel = newMember.guild.channels.cache.find((ch) => ch.name === logs)
        }

        let choice = db.get(`${newMember.guild.id}.antiRole`);
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {
            const oldRoles = oldMember.roles.cache.filter((r) => r.name !== '@everyone').keyArray()
            const newRoles = newMember.roles.cache.filter((r) => r.name !== '@everyone').keyArray()

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
            });

            if (!fetchedLogs) return;

            const RoleLog = fetchedLogs.entries.first();

            if (!RoleLog) return;

            const {
                executor,
                target
            } = RoleLog;

            if (newMember.id !== target.id) return

            const member = newMember.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= newMember.guild.me.roles.highest.position) return;

            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;

            if (db.get(`${newMember.guild.id}.WLUsers`) === undefined || db.get(`${newMember.guild.id}.WLUsers`) === null) {
                if (newMember.guild.owner) {
                    db.push(`${newMember.guild.id}.WLUsers`, newMember.guild.owner.id);
                }
            }
            if (db.get(`${newMember.guild.id}.Owners`) === undefined || db.get(`${newMember.guild.id}.Owners`) === null) {
                if (newMember.guild.owner) {
                    db.push(`${newMember.guild.id}.Owners`, newMember.guild.owner.id);
                }
            }

            if (db.get(`${newMember.guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${newMember.guild.id}.Owners`).includes(executor.id)) return;

            if (db.get(`${newMember.guild.id}.sanction`) === undefined || db.get(`${newMember.guild.id}.sanction`) === null) {
                db.set(`${newMember.guild.id}.sanction`, `ban`)
            }
            if (db.get(`${newMember.guild.id}.sanction`) === 'ban') {
                try {
                    newMember.guild.members.ban(executor, {
                        reason: 'Anti-Role',
                    });
                } catch (error) {
                    return;
                }
            }
            if (db.get(`${newMember.guild.id}.sanction`) === 'kick') {
                try {
                    newMember.guild.member(executor).kick('Anti-Role')
                } catch (error) {
                    return;
                }
            }
            if (db.get(`${newMember.guild.id}.sanction`) === 'derank') {
                try {
                    member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                } catch {
                    return;
                }
            }

            if (oldRoles.length > newRoles.length) {
                const difference = oldRoles.filter(dif => !newRoles.includes(dif))
                try {
                    newMember.roles.add(difference)
                } catch {

                }
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} ${lang.AntiRoleEventRemoved} <@&${difference}> ${lang.AntiRoleEventTo} ${target} ${lang.AntiRoleEvent1} ${db.get(`${member.guild.id}.sanction`)} ${lang.AntiRoleEventReAdded} \n ${lang.BanReason} Anti-Role`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);
                if (!logchannel) return
                logchannel.send(embed)
            }

            if (oldRoles.length < newRoles.length) {
                const difference = newRoles.filter(dif => !oldRoles.includes(dif))
                try {
                    newMember.roles.remove(difference)
                } catch {

                }
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} a ajouté <@&${difference}> ${lang.AntiRoleEventTo} ${target} ${lang.AntiRoleEvent1} ${db.get(`${member.guild.id}.sanction`)} ${lang.AntiRoleEventReRemoved} \n ${lang.BanReason} Anti-Role`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);
                if (!logchannel) return
                logchannel.send(embed)
            }
        }
    })
}