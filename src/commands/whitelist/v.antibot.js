/* eslint-disable no-undef */
const db = require('quick.db');
const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'antibot',
    description: 'Désactive / Active l\'antibot',
    aliases: ['antibot', 'Antibot'],
    usage: 'antibot [on/off]',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *antibot* sur |${message.guild.name}|`)
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

        const WLAlready = new Discord.MessageEmbed()
            .setColor(blue)
            .setDescription(`🚨 <@${message.author.id}> ${lang.WhitelistNoInWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
            }
        }
        if (!db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) {
            return message.channel.send(WLAlready);
        }
        if (args[0] === 'on') {
            db.set(`${message.guild.id}.antibot`, true);
            message.channel.send({
                embed: {
                    color: blue,
                    description: `${lang.BanAction} ${lang.AntiBotEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: blue,
                    description: `${lang.BanAction} ${lang.AntiBotEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else if (args[0] === 'off') {
            db.set(`${message.guild.id}.antibot`, false);
            message.channel.send({
                embed: {
                    color: blue,
                    description: `${lang.BanAction} ${lang.AntiBotDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: blue,
                    description: `${lang.BanAction} ${lang.AntiBotDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else {
            message.channel.send({
                embed: {
                    color: blue,
                    description: `${lang.WhitelistPreciseOFFoON} ${lang.AntiBotFinalWord}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        }
    },
};