const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const {
    emojiAttention,
    blue,
    owner
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')

module.exports = {
    name: 'setavatar',
    aliases: ['setpp', 'setavatar'],
    description: 'Choisis la photo de profil du bot',
    usage: 'setavatar <lien de l\'avatar>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *setavatar* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
        }

        if (message.author.id === owner) {
            if (db.get(`${client.user.id}.avatar`) === true) {
                return message.channel.send(`${lang.SetAvatarOneHour}`)
            }

            if (!args[0]) {
                return message.channel.send(`${lang.SetAvatarInvalidLink} \n \`setavatar + <lien>\``)
            }
            let newavatar = args[0]
            if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webp)/.test(args[0])) {
                return message.channel.send(`${lang.SetAvatarInvalidLink}`)
            }

            client.user.setAvatar(newavatar)
            message.channel.send(`${lang.SetAvatarNewAvatar} \n ${newavatar}`)
            db.set(`${client.user.id}.avatar`, true)

            setTimeout(() => {
                db.set(`${client.user.id}.avatar`, false)
            }, 3600000);
        } else {
            return message.lineReply(WLAlready);
        }
    }
}