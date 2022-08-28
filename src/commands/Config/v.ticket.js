const Discord = require("discord.js");
const {
    blue,
    emojiAttention,
    owner
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'ticket',
    description: 'Envoie le message de ticket',
    aliases: ['ticket'],
    usage: 'ticket',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,


    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *ticket* sur |${message.guild.name}|`)
        try {
            message.delete()
        } catch {

        }

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.TicketErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
            }
        }

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {

            const embedbotPerms = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send(embedbotPerms)

            let Embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`${lang.TicketEmbedAuthor}`)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true,
                    size: 512
                }))
                .setDescription(`${lang.TicketEmbedDescription}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

            message.channel.send(Embed).then(async msg => {
                try {
                    await msg.react("🎟️")
                } catch {

                }
                db.set(`${message.guild.id}.ticket`, msg.id)
            })

        } else {
            message.channel.send(WLAlready)
        }
    }
}