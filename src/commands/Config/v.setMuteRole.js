const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const {
    emojiAttention,
    owner,
    blue
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'setmuterole',
    aliases: ['setmuterole'],
    description: 'Choisis le rôle muted',
    usage: 'setmuterole <@&role>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *setMuteRole* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SetMuteRoleErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const samechannel = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SetMuteRoleErrorAlreadyThisRole}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
            }
        }

        if(!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {

            if (!args[0]) {
                return message.channel.send(`${lang.SetMuteRoleErrorInvalidRole}`)
            }

            const channelID = args[0].replace(/[<>@&]/g, '')

            if (channelID === db.get(`${message.guild.id}.RoleMuted`)) {
                return message.channel.send(samechannel)
            }
            const channel = await message.guild.roles.cache.get(channelID)

            if (!channel) {
                return message.channel.send(`${lang.SetMuteRoleErrorInvalidRole}`)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.SetMuteRoleFinalMessage1} ${channel} ${lang.SetMuteRoleFinalMessage2}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
            db.set(`${message.guild.id}.RoleMuted`, channelID)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}