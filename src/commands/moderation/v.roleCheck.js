const Discord = require('discord.js');
const db = require('quick.db')
const {
    blue,
    logs,
    emojiAttention,
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'rolecheck',
    description: 'Affiche le nombre de personne possedant un rôle',
    aliases: ['rolecheck', 'rolec'],
    usage: 'rolec + <@user>',
    perms: `\`MENTION_EVERYONE\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *rolecheck* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const NoPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.roleCheckNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('MENTION_EVERYONE')) return message.lineReply(NoPerms);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("MENTION_EVERYONE")) return message.channel.send(embedbotPerms)

        const roleRegex = /(<@&(\d{17,19})>)|(^\d{17,19}$)/g
        const prblm = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} ${lang.roleCheckErrorRole}`)
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
    
        if (!args[0] || !args[0].match(roleRegex)) return message.channel.send(prblm)

        const role = await message.guild.roles.fetch(args[0].replace(/[<@&>]/g, ''))
        const norole = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.roleCheckErrorInvalidRole}`)
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
        if (!role) return message.channel.send(norole)

        const security1 = new Discord.MessageEmbed()
        .setTitle('💠 Role checker:')
        .setColor(color)
        .setDescription(`• ${role.members.size} ${lang.roleCheckFinalMessage}`)
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)

        return message.channel.send(security1)
    },
};