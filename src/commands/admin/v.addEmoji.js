const Discord = require('discord.js');
const db = require('quick.db')
const {
    blue,
    logs,
    emojiAttention,
    emojiON,
    emojiOFF,
    emojiValidé,
    prefix
} = require('../../../config.json');
const { parse } = require("twemoji-parser");
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'addemoji',
    description: 'Ajoute un émoji sur le Discord',
    aliases: ['create'],
    usage: 'addemoji <emoji> <nom>',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang) {

        let prefixchange;
        if (!prefixchange) {
            prefixchange = prefix
        } else {
            prefixchange = db.get(`${message.guild.id}.prefix`)
        }

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        let logchannel;
        if (db.get(`${message.guild.id}.Logs`)) {
            logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
        } else {
            logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
        }

        const NoPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.permsAdmin}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(NoPerms);

        const emoji = args[0];
        if (!emoji) return message.lineReply(`${emojis.no} ${lang.unvalidEmoji}`);

        let customemoji = Discord.Util.parseEmoji(emoji);

        if (customemoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
        customemoji.animated ? "gif" : "png"
    }`;
            const name = args.slice(1).join(" ");
            message.guild.emojis.create(
                `${Link}`,
                `${name || `${customemoji.name}`}`
            ).catch(error => {
            })
           // const emojiname = client.emojis.cache.find((emoji) => emoji.id === '797862184126382170');
           // const emojiid = client.emojis.cache.find((emoji) => emoji.id === '797865238028222495');
           console.log(`${message.author.tag}, utilise la commande *addemoji* sur |${message.guild.name}|`)
            const Added = new Discord.MessageEmbed()
                .setTitle(`${emojis.yes} ${lang.EmojiAdded}`)
                .setColor(color)
                .setDescription(`__**${lang.EmojiAddedInformations}:**__\n\n ${emojis.user} **${lang.EmojiAddedNom}:** \`${name || `${customemoji.name}`}\`\n ${emojis.id} **ID:** \`${customemoji.id}\``)
                .setImage(`${Link}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            return message.channel.send(Added).catch(e => {
            })
        } else {
            let CheckEmoji = parse(emoji, {
                assetType: "png"
            });
            if (!CheckEmoji[0])
                return message.channel.send(`${lang.unvalidEmoji}`);
            message.channel.send(
                `${lang.EmojiNormal}`
            );
        }
    }
}