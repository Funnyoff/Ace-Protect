const db = require('quick.db');
const {
     blue,
    emojiAttention,
    prefix,
    muteSpamTime,
    logs
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('message', async (message) => {

        if (!message) return;
        if (!message.guild) return;
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
             color = "2f3136";
        }
        if (!color) return;

        let muteRole;
        if (db.get(`${message.guild.id}.RoleMuted`)) {
            muteRole = db.get(`${message.guild.id}.RoleMuted`)
        } else {
            let role = message.guild.roles.cache.find((role) => role.name === '🚫・Muted')
            if (!role) return;
            muteRole = role.id
        }
        if (!muteRole) return;

        let logchannel;
        if (db.get(`${message.guild.id}.Logs`)) {
            logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
        } else {
            logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
        }
        if (!logchannel) return;

        let language;
        if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
            await db.set(`${message.guild.id}.language`, "fr")
            language = db.get(`${message.guild.id}.language`)
        }
        language = db.get(`${message.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!message.member || message.channel.type == 'dm') return;
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
        if (message.member.hasPermission('ADMINISTRATOR')) return;

        let choice = db.get(`${message.guild.id}.antiWordChoice`);
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {

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
            if (db.get(`${message.guild.id}.WLChannels`) === undefined || db.get(`${message.guild.id}.WLChannels`) === null) return;

            if (db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) return;
            if (db.get(`${message.guild.id}.Owners`).includes(message.author.id)) return;
            if (db.get(`${message.guild.id}.WLChannels`).includes(message.channel.id)) return;

            if (message.author.id == client.user.id) return;

            let dbInsulte = db.get(`${message.guild.id}.AntiWord`)

            if (dbInsulte === null || dbInsulte === undefined) return;

            if (dbInsulte.some(insulte => message.content.includes(insulte))) {
                if (!message.channel.messages.cache.find((msg) => msg.id == message.id)) return;
                try {
                    message.delete()
                } catch {
                    return;
                }
                message.channel.send(`${message.author}, ${lang.AntiWordMuted}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 10000,
                        })
                    } catch {

                    }
                });
                if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
                    try {
                        message.member.roles.add(muteRole);
                    } catch {

                    }
                }

                const logEmbed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} ${lang.AntiWordBadMSG}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `);

                if (!logchannel) return;
                logchannel.send(logEmbed1);

                setTimeout(() => {
                    if (!message.member) return;
                    if (message.member.roles.cache.find((x) => x.id == muteRole)) {
                        try {
                            message.member.roles.remove(muteRole).then(() => {
                                const logEmbed2 = new Discord.MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} ${lang.AntiWordBadMSG}`)
                                    .setTimestamp()
                                    .setFooter(`${client.user.username} `);

                                if (!logchannel) return;
                                logchannel.send(logEmbed2);
                            });
                        } catch {

                        }
                    }
                }, muteSpamTime);
            }
        }
    });
};