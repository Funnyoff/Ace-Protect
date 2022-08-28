const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')

module.exports = {
    name: 'ban',
    description: 'ban la personne mentionné',
    aliases: ['ban'],
    usage: 'ban + <@user>',
    perms: `\`BAN_MEMBERS\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *ban* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        if (!args[0]) {
            return message.channel.send({
                embed: {

                    color: color,
                    description: `${lang.BanErrorNoPerson}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        }
        const banned = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        const reason = args.slice(1).join(' ') || `${lang.BanNoReason}`;
        let logchannel;
        if (db.get(`${message.guild.id}.Logs`)) {
            logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
        } else {
            logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
        }

        // MESSAGES

        if (!message.member.permissions.has('BAN_MEMBERS')) {
            const nopermsembed = new Discord.MessageEmbed()
                .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.BanErrorNoPerms}`)
                .setColor(color)
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            return message.lineReply(nopermsembed);
        }

        if (!banned) {
            return message.channel.send({
                embed: {

                    color: color,
                    description: `${lang.BanErrorNoPerson}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        }

        if (message.author === banned) {
            const sanctionyourselfembed = new Discord.MessageEmbed()
                .setDescription(`${lang.BanErrorYourself}`)
                .setColor(color)
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            return message.channel.send(sanctionyourselfembed);

        }

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.BanErrorRoleHighest}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const embednopermss = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.BanErrorCantBan}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(embedbotPerms)
        }

        if (banned.roles.highest.position > message.guild.me.roles.highest.position) {
            return message.channel.send(embedbotPerms)
        }

        if (banned.roles.highest.position >= message.member.roles.highest.position) {
            return message.channel.send(embednopermss)
        }

        try {
            message.guild.members.ban(banned, {
                reason,
            });
        } catch {

        }

        const successfullyembed = new Discord.MessageEmbed()
            .setAuthor(banned.user.username, banned.user.avatarURL())
            .setColor(color)
            .setDescription(`${lang.BanAction} Ban \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        message.channel.send(successfullyembed);

        const embed = new Discord.MessageEmbed()
            .setAuthor(banned.user.username, banned.user.avatarURL())
            .setColor(color)
            .setDescription(`${lang.BanAction} Ban \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!logchannel) return;
        logchannel.send(embed);
    },
};