const Discord = require('discord.js');
const db = require('quick.db')
const {
    blue,
    logs,
    emojiAttention,
    emojiON,
    emojiOFF,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'logs',
    description: 'affiche les logs activés / désactivés du discord',
    aliases: ['logs'],
    usage: 'logs',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *logs-serv* sur |${message.guild.name}|`)
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

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(NoPerms);

        let logsBan = db.get(`${message.guild.id}.logsKB`)
        if (logsBan == undefined) {
            logsBan = `${emojis.on}`
        }
        if (logsBan == null) {
            logsBan = `${emojis.off}`
        }
        if (logsBan == false) {
            logsBan = `${emojis.off}`
        }
        if (logsBan == true) {
            logsBan = `${emojis.on}`
        }

        let logsChannel = db.get(`${message.guild.id}.logsC`);
        if (logsChannel == undefined) {
            logsChannel = `${emojis.on}`
        }
        if (logsChannel == null) {
            logsChannel = `${emojis.off}`
        }
        if (logsChannel == false) {
            logsChannel = `${emojis.off}`
        }
        if (logsChannel == true) {
            logsChannel = `${emojis.on}`
        }

        let logsMessages = db.get(`${message.guild.id}.logsMSG`)
        if (logsMessages == undefined) {
            logsMessages = `${emojis.on}`
        }
        if (logsMessages == null) {
            logsMessages = `${emojis.off}`
        }
        if (logsMessages == false) {
            logsMessages = `${emojis.off}`
        }
        if (logsMessages == true) {
            logsMessages = `${emojis.on}`
        }
        let logsRoles = db.get(`${message.guild.id}.logsRoles`)
        if (logsRoles == undefined) {
            logsRoles = `${emojis.on}`
        }
        if (logsRoles == null) {
            logsRoles = `${emojis.off}`
        }
        if (logsRoles == false) {
            logsRoles = `${emojis.off}`
        }
        if (logsRoles == true) {
            logsRoles = `${emojis.on}`
        }

        const soutien = new Discord.MessageEmbed()
            .setTitle(`${lang.LogsServEmbed}`)
            .setColor(color)
            .setDescription(`• Logs ban : ${logsBan} \n • Logs channels : ${logsChannel} \n • Logs messages : ${logsMessages} \n • Logs Rôles : ${logsRoles}`)
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
        message.channel.send(soutien)

    }
}