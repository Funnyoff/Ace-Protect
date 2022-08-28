const Discord = require("discord.js");
const {
    blue,
    emojiValidé,
    emojiAttention,
    prefix
} = require('../../../config.json')
const db = require('quick.db')
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'deletewebhooks',
    description: 'Supprime tous les webhooks du Discord',
    aliases: ['deletewebhook', 'deletewebhooks', 'dwebhooks', 'dwebhook'],
    usage: 'dwebhooks',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *deletewebhook* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
            }
        }

        if (!message.guild.owner) return;

        if (!db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) {
            return message.channel.send(WLAlready);
        }

        const hooks = message.guild.fetchWebhooks().then(webhooks => {
                webhooks.forEach(webhook => {
                    webhook.delete()
                })
                const webhooksdeleted = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`**${webhooks.size}** ${lang.deletewebhooks}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                message.channel.send(webhooksdeleted)
            })
            .catch()
    }
}