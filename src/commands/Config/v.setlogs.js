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
    name: 'setlogs',
    aliases: ['setlog', 'setlogschannel'],
    description: 'Choisis le salon logs du bot',
    usage: 'setlogschannel <#channel>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *setlogs* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SetLogsErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const samechannel = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SetLogsErrorAlreadyThisChannel}`)
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
                return message.channel.send(`${lang.SetLogsErrorInvalidChannel}`)
            }

            const channelID = args[0].replace(/[<>#]/g, '')
            if (channelID === db.get(`${message.guild.id}.Logs`)) {
                return message.channel.send(samechannel)
            }
            const channel = await message.guild.channels.cache.get(channelID)

            if (!channel) {
                return message.channel.send(`${lang.SetLogsErrorInvalidChannel}`)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.SetLogsFinalMessage1} ${channel} ${lang.SetLogsFinalMessage2}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
            db.set(`${message.guild.id}.Logs`, channelID)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}