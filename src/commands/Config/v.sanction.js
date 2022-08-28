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
    name: 'sanction',
    aliases: ['sanction'],
    description: 'Choisis la sanction des commandes de sécurité',
    usage: 'sanction <ban | kick>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *sanction* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SanctionErrorNoOwner}`)
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
            if (args[0] === 'ban') {
                db.set(`${message.guild.id}.sanction`, `ban`)
                return message.channel.send(`${lang.SanctionSetOn} \`ban\``)
            }
            if (args[0] === 'kick') {
                db.set(`${message.guild.id}.sanction`, `kick`)
                return message.channel.send(`${lang.SanctionSetOn} \`kick\``)
            }
            if(args[0] === 'derank') {
                db.set(`${message.guild.id}.sanction`, `derank`)
                return message.channel.send(`${lang.SanctionSetOn} \`derank\``)
            }
            return message.channel.send(`${lang.SanctionErrorBadSanction}`)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}