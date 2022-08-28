const Discord = require("discord.js");
const {
    blue,
    emojiValidé,
    emojiAttention
} = require('../../../config.json')
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'nuke',
    aliases: ['renew', 'crenew'],
    description: 'Refait le salon',
    usage: 'nuke',
    perms: `\`MANAGE_CHANNELS\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *renew* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const embedPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.LockErrorNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.lineReply(embedPerms);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(embedbotPerms)

        let filter = m => m.author.id === message.author.id
        const renew = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${lang.NukeQuestion}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        message.channel.send(renew)
        message.channel.awaitMessages(filter, {
                max: 1,
                time: 20000,
                errors: ['time']
            })
            .then(message => {
                message = message.first()
                if (message.content.toLowerCase() == 'oui' || message.content.toLowerCase() == 'y' || message.content.toLowerCase() == 'yes') {
                    let channel = client.channels.cache.get(message.channel.id)
                    let posisi = channel.position
                    channel.clone().then((channel2) => {
                        channel2.setPosition(posisi)
                        try {
                            channel.delete()
                        } catch {

                        }
                        const renew2 = new Discord.MessageEmbed()
                            .setColor(color)
                            .setDescription(`${emojis.yes} Le salon à bien été recréé !`)
                            //${lang.NukeRecreated}
                            .setTimestamp()
                            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
                        channel2.send(renew2)
                    })
                } else if (message.content.toLowerCase() == 'non' || message.content.toLowerCase() == 'n' || message.content.toLowerCase() == 'no') {
                    const renew3 = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`${lang.NukeCancel}`)
                        .setTimestamp()
                        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
                    return message.channel.send(renew3)
                } else {
                    const renew4 = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`${emojis.yes} ${lang.NukeErrorResponse}`)
                        .setTimestamp()
                        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
                    message.channel.send(renew4)
                }
            }).catch(err => {
                const renew4 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${emojis.yes} ${lang.NukeErrorTime}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
                message.channel.send(renew4)

            })
    }
}