const db = require('quick.db');
const {
     blue,
    emojiAttention,
    prefix,
    logs
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('message', async (message) => {

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

        if (!message.member || message.channel.type == 'dm') return;
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        let choice = db.get(`${message.guild.id}.antieveryone`);
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {

            if (message.author.id == client.user.id) return;

            if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
                if (message.guild.owner) {
                    db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
                }
            }

            if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
                if (message.guild.owner) {
                    db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
                }
            }

            if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) return;
            if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) return;

            if (db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) return;
            if (db.get(`${message.guild.id}.Owners`).includes(message.author.id)) return;

            if (message.content.includes('@everyone')) {

                const member = message.guild.members.cache.get(message.author.id)
                if (!member) return;
                if (member) {
                    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return;
                }

                if (db.get(`${message.guild.id}.users.${message.author.id}.Everyone`) === null || db.get(`${message.guild.id}.users.${message.author.id}.Everyone`) === undefined) {
                    return db.set(`${message.guild.id}.users.${message.author.id}.Everyone`, 1)
                }
                setTimeout(() => {
                    try {
                        db.delete(`${message.guild.id}.users.${message.author.id}`)
                    } catch (error) {
                        return;
                    }
                }, 3600000);

                if (db.get(`${message.guild.id}.users.${message.author.id}.Everyone`) === 1) {
                    return db.set(`${message.guild.id}.users.${message.author.id}.Everyone`, 2)
                }
                setTimeout(() => {
                    try {
                        db.delete(`${message.guild.id}.users.${message.author.id}`)
                    } catch (error) {
                        return;
                    }
                }, 3600000);

                if (db.get(`${message.guild.id}.users.${message.author.id}.Everyone`) === 2) {
                    db.set(`${message.guild.id}.users.${message.author.id}.Everyone`, 3)
                }
                setTimeout(() => {
                    try {
                        db.delete(`${message.guild.id}.users.${message.author.id}`)
                    } catch (error) {
                        return;
                    }
                }, 3600000);


                if (db.get(`${message.guild.id}.users.${message.author.id}.Everyone`) === 3) {

                    let logchannel;
                    if (db.get(`${message.guild.id}.Logs`)) {
                        logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
                    } else {
                        logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
                    }

                    if (db.get(`${message.guild.id}.sanction`) === undefined || db.get(`${message.guild.id}.sanction`) === null) {
                        db.set(`${message.guild.id}.sanction`, `ban`)
                    }

                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return;
                    if (db.get(`${message.guild.id}.sanction`) === 'ban') {
                        try {
                            message.guild.members.ban(message.member, {
                                reason: 'Anti-Everyone',
                            });
                        } catch (error) {
                            return;
                        }
                    }

                    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return;
                    if (db.get(`${message.guild.id}.sanction`) === 'kick') {
                        try {
                            message.guild.member(message.member).kick('Anti-Everyone')
                        } catch (error) {
                            return;
                        }
                    }

                    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return;
                    if (db.get(`${message.guild.id}.sanction`) === 'derank') {
                        try {
                            message.member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => message.member.roles.remove(role))
                        } catch (error) {
                            return;
                        }
                    }

                    const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`${message.author} a été ${db.get(`${message.guild.id}.sanction`)} ${lang.AntiEveryone} \n ${lang.BanReason} ${lang.AntiEveryoneMotif}`)
                        .setTimestamp()
                        .setFooter(`${client.user.username} `);

                    if (!logchannel) return
                    logchannel.send(embed)

                    try {
                        db.delete(`${message.guild.id}.users.${message.author.id}`)
                    } catch (error) {
                        return;
                    }

                }
                setTimeout(() => {
                    try {
                        db.delete(`${message.guild.id}.users.${message.author.id}`)
                    } catch (error) {
                        return;
                    }
                }, 3600000);
            }
        }
    });
};