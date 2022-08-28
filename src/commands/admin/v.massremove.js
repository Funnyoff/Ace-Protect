const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const {
    emojiAttention,
    blue,
    emojiValidé
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'massremove',
    aliases: ['massremove', 'masser'],
    description: 'Retire un rôle à tous les membres',
    usage: 'massremove + <@&role>',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *massremove* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const Nopresencestatutsoutien = new MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} ${lang.MassRemoveErrorRoleIncorect}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const rolenotfound = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.MassRemoveErrorRoleNotFound}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const roleprblm = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.MassRemoveErrorRoleHighest}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const rolemanaged = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.MassRemoveErrorRoleManaged}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const NoPerms = new MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.permsAdmin}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(NoPerms);

        const roleRegex = /(<@&(\d{17,19})>)|(^\d{17,19}$)/g
        if (!args[0] || !args[0].match(roleRegex)) return message.channel.send(Nopresencestatutsoutien)
        const role = await message.guild.roles.fetch(args[0].replace(/[<@&>]/g, ''))

        if (role.managed) {
            return message.channel.send(rolemanaged)
        }
        if (!role) {
            return message.channel.send(rolenotfound)
        }
        if (role.position > message.guild.me.roles.highest.position) {
            return message.channel.send(roleprblm)
        }
        const commenco = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`**<@${message.author.id}>** ${lang.MassRemoveMessage} **${role}** ${lang.MassRemoveMessageAdding}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const msg = await message.channel.send(commenco)

        const members = await message.guild.members.fetch()
        for (member of members) {
            await member[1].roles.remove(role)
        }

        const finito = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.yes} <@${message.author.id}> ${lang.MassRemoveMessage} **${role}** ${lang.MassRemoveMessageAdded}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        msg.edit(finito)
    }
}