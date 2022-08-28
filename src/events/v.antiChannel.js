const {
    logs,
     blue,
    emojiAttention
} = require('../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs').promises;

module.exports = (client) => {

    /// //////////////////////////////////////////////////////////////
    /// /////////////////////// CHANNEL EDIT ////////////////////////
    /// ////////////////////////////////////////////////////////////

    client.on('channelUpdate', async (oldChannel, newChannel) => {

        if (!oldChannel) return;
        if (!newChannel) return;
        if (!newChannel.guild) return;

        let color;
        if (db.get(`${newChannel.guild.id}.Color`)) {
            color = db.get(`${newChannel.guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${newChannel.guild.id}.language`) === undefined || db.get(`${newChannel.guild.id}.language`) === null) {
            await db.set(`${newChannel.guild.id}.language`, "fr")
            language = db.get(`${newChannel.guild.id}.language`)
        }
        language = db.get(`${newChannel.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let choice9 = db.get(`${newChannel.guild.id}.antiChannel`);
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (newChannel.parentID === db.get(`${newChannel.guild.id}.categoryTempvoc`)) {
                return;
            }

            if (!newChannel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            if (!newChannel.guild.me.hasPermission("ADMINISTRATOR")) return;

            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_UPDATE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (newChannel.id !== target.id) return

            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = newChannel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= newChannel.guild.me.roles.highest.position) return;

            if (db.get(`${newChannel.guild.id}.WLUsers`) === undefined || db.get(`${newChannel.guild.id}.WLUsers`) === null) {
                if (channel.guild.owner) {
                    db.push(`${newChannel.guild.id}.WLUsers`, newChannel.guild.owner.id);
                }
            }
            if (db.get(`${newChannel.guild.id}.Owners`) === undefined || db.get(`${newChannel.guild.id}.Owners`) === null) {
                if (channel.guild.owner) {
                    db.push(`${newChannel.guild.id}.Owners`, newChannel.guild.owner.id);
                }
            }

            if (db.get(`${newChannel.guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${newChannel.guild.id}.Owners`).includes(executor.id)) return;


            let logchannel;
            if (db.get(`${newChannel.guild.id}.Logs`)) {
                logchannel = newChannel.guild.channels.cache.get(db.get(`${newChannel.guild.id}.Logs`))
            } else {
                logchannel = newChannel.guild.channels.cache.find((ch) => ch.name === logs)
            }

            if (db.get(`${newChannel.guild.id}.sanction`) === undefined || db.get(`${newChannel.guild.id}.sanction`) === null) {
                db.set(`${newChannel.guild.id}.sanction`, `ban`)
            }

            if (!newChannel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (db.get(`${newChannel.guild.id}.sanction`) === 'ban') {
                try {
                    newChannel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!newChannel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (db.get(`${newChannel.guild.id}.sanction`) === 'kick') {
                try {
                    newChannel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            if (!newChannel.guild.me.hasPermission("MANAGE_ROLES")) return;
            if (db.get(`${newChannel.guild.id}.sanction`) === 'derank') {
                try {
                    member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                } catch (error) {
                    return;
                }
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${db.get(`${newChannel.guild.id}.sanction`)} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

    /////////////////////////////////////////////////////////////////
    ////////////////////////// CREATION CHANNEL ////////////////////
    ///////////////////////////////////////////////////////////////


    client.on('channelCreate', async (channel) => {

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

        let choice9 = db.get(`${channel.guild.id}.antiChannel`);
        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (channel.parentID === db.get(`${channel.guild.id}.categoryTempvoc`)) {
                return;
            }

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_CREATE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (channel.id !== target.id) return
            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = channel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;

            if (db.get(`${channel.guild.id}.WLUsers`) === undefined || db.get(`${channel.guild.id}.WLUsers`) === null) {
                if (channel.guild.owner) {
                    db.push(`${channel.guild.id}.WLUsers`, channel.guild.owner.id);
                }
            }
            if (db.get(`${channel.guild.id}.Owners`) === undefined || db.get(`${channel.guild.id}.Owners`) === null) {
                if (channel.guild.owner) {
                    db.push(`${channel.guild.id}.Owners`, channel.guild.owner.id);
                }
            }

            if (db.get(`${channel.guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${channel.guild.id}.Owners`).includes(executor.id)) return;


            let logchannel;
            if (db.get(`${channel.guild.id}.Logs`)) {
                logchannel = channel.guild.channels.cache.get(db.get(`${channel.guild.id}.Logs`))
            } else {
                logchannel = channel.guild.channels.cache.find((ch) => ch.name === logs)
            }

            try {
                channel.delete()
            } catch (error) {
                return;
            }

            if (db.get(`${channel.guild.id}.sanction`) === undefined || db.get(`${channel.guild.id}.sanction`) === null) {
                db.set(`${channel.guild.id}.sanction`, `ban`)
            }

            if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'ban') {
                try {
                    channel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'kick') {
                try {
                    channel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'derank') {
                try {
                    member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                } catch (error) {
                    return;
                }
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${db.get(`${channel.guild.id}.sanction`)} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

    /////////////////////////////////////////////////////////////////
    ////////////////////////// SUPPRESSION CHANNEL /////////////////
    ///////////////////////////////////////////////////////////////


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

        let choice9 = db.get(`${channel.guild.id}.antiChannel`);
        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (channel.parentID === db.get(`${channel.guild.id}.categoryTempvoc`)) {
                return;
            }

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_DELETE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (channel.id !== target.id) return
            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = channel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;

            if (db.get(`${channel.guild.id}.WLUsers`) === undefined || db.get(`${channel.guild.id}.WLUsers`) === null) {
                if (channel.guild.owner) {
                    db.push(`${channel.guild.id}.WLUsers`, channel.guild.owner.id);
                }
            }
            if (db.get(`${channel.guild.id}.Owners`) === undefined || db.get(`${channel.guild.id}.Owners`) === null) {
                if (channel.guild.owner) {
                    db.push(`${channel.guild.id}.Owners`, channel.guild.owner.id);
                }
            }

            if (db.get(`${channel.guild.id}.WLUsers`).includes(executor.id)) return;
            if (db.get(`${channel.guild.id}.Owners`).includes(executor.id)) return;


            let logchannel;
            if (db.get(`${channel.guild.id}.Logs`)) {
                logchannel = channel.guild.channels.cache.get(db.get(`${channel.guild.id}.Logs`))
            } else {
                logchannel = channel.guild.channels.cache.find((ch) => ch.name === logs)
            }
            try {
                let position;
                let posi;
                if (channel.parent === undefined) {
                    posi = false;
                }
                if (channel.parent) {
                    posi = true;
                    position = channel.rawPosition
                }

                channel.clone().then((channel2) => {
                    if (posi === true) {
                        try {
                            channel2.setPosition(position)
                        } catch {

                        }
                    }
                })
            } catch (error) {
                return;
            }

            if (db.get(`${channel.guild.id}.sanction`) === undefined || db.get(`${channel.guild.id}.sanction`) === null) {
                db.set(`${channel.guild.id}.sanction`, `ban`)
            }

            if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'ban') {
                try {
                    channel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'kick') {
                try {
                    channel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
            if (db.get(`${channel.guild.id}.sanction`) === 'derank') {
                try {
                    member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                } catch (error) {
                    return;
                }
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${db.get(`${channel.guild.id}.sanction`)} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

}