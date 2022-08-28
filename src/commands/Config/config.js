const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const {
    emojiAttention,
    blue,
    prefix,
    owner
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'config',
    aliases: ['configuration', 'settings', 'setting'],
    description: 'Affiche les paramètres du bot',
    usage: 'config',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *config* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        let prefixbot = db.get(`${message.guild.id}.prefix`)
        if (prefixbot === null || prefixbot === undefined) {
            prefixbot = prefix
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.LangErrorNoOwner}`)
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

            const channelID = db.get(`${message.guild.id}.Logs`)
            let channel = message.guild.channels.cache.get(channelID)

            let sanction = db.get(`${message.guild.id}.sanction`)
            if (!sanction) {
                sanction = `ban`
            }
            if (!channel) {
                channel = `Non défini`
            }

            let categorytempvoc;

            let categorytempvocID = db.get(`${message.guild.id}.categoryTempvoc`)
            if (!categorytempvocID) {
                categorytempvoc = `Non défini`
            }
            categorytempvoc = message.guild.channels.cache.get(categorytempvocID)
            if (!categorytempvoc) {
                categorytempvoc = `Non défini`
            }

            let tempvocal;
            let tempvocalID = db.get(`${message.guild.id}.tempvoc.channel`)
            if (!tempvocalID) {
                tempvocal = `Non défini`
            }
            tempvocal = message.guild.channels.cache.get(tempvocalID)
            if (!tempvocal) {
                tempvocal = `Non défini`
            }
            if (tempvocal.parentID !== categorytempvocID) {
                tempvocal = `Non défini`
            }

            let roleID;
            let roles;
            if (db.get(`${message.guild.id}.RoleMuted`)) {
                roleID = db.get(`${message.guild.id}.RoleMuted`)
                roles = message.guild.roles.cache.get(roleID)
            } else {
                roles = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${emojis.settings} Configuration :`)
                .setDescription(`**Language :** ${db.get(`${message.guild.id}.language`)} ${db.get(`${message.guild.id}.language`) === 'fr' ? `🇫🇷` : `🇬🇧`}
            **Channel Logs :** ${channel}
            **Role Muted :** ${roles}
            **Prefix :** ${prefixbot}
            **Sanction :** ${sanction}
            **Color :** ${color}
            **Tempvocal :** *Channel :* ${tempvocal}
            `)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}