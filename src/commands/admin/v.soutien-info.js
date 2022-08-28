const Discord = require('discord.js');
const db = require('quick.db')
const {
    blue,
    logs,
    emojiAttention,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'soutien-info',
    description: 'Affiche les réglages de la commande soutien',
    aliases: ['soutien-info'],
    usage: 'soutien',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *soutien-info* sur |${message.guild.name}|`)
        let prefixchange;
        if(!prefixchange) {
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

        const embedPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.permsAdmin}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embedPerms);

        const embedbotPerms = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

        let roleSoutien = ` <@&${db.get(`${message.guild.id}.RoleSoutien`)}>`
        if (!roleSoutien) {
            roleSoutien = `Undefined, ${prefixchange}statut`
        }
        let soutienStatut = db.get(`${message.guild.id}.statutchange`);
        if (!soutienStatut) {
            soutienStatut = `Undefined, ${prefixchange}statut`
        }

        const soutien = new Discord.MessageEmbed()
            .setTitle(`${lang.SoutienInfoTitle}`)
            .setColor(color)
            .setDescription(`${lang.SoutienInfoRole} ${roleSoutien} \n ${lang.SoutienInfoStatut} ${soutienStatut}`)
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
        message.channel.send(soutien)

    }
}