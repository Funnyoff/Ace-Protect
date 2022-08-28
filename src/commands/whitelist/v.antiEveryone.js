/* eslint-disable no-undef */
const db = require('quick.db');
const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'antieveryone',
    description: 'Désactive / Active l\'Antieveryone',
    aliases: ['antieveryone', 'Antieveryone'],
    usage: 'antieveryone [on/off]',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *antieveryone* sur |${message.guild.name}|`)
        let prefixchange;
        if (!prefixchange) {
            prefixchange = prefix
        } else {
            prefixchange = db.get(`${message.guild.id}.prefix`)
        }

        let logchannel;
        if (db.get(`${message.guild.id}.Logs`)) {
            logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
        } else {
            logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
        }

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
            }
        }

        if (!message.guild.owner) return;

        if (!db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) {
            return message.channel.send(WLAlready);
        }
        if (args[0] === 'on') {
            db.set(`${message.guild.id}.antieveryone`, true);
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else if (args[0] === 'off') {
            db.set(`${message.guild.id}.antieveryone`, false);
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else {
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.WhitelistPreciseOFFoON} ${lang.AntiEveryoneFinalWord}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        }
    },
};