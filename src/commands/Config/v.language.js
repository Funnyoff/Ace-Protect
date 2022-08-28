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
    name: 'language',
    aliases: ['setlang', 'lang'],
    description: 'Choisis la langue du bot',
    usage: 'setlang <fr | eng>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *language* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
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

            if (args[0] === db.get(`${message.guild.id}.language`)) {
                return message.channel.send(`${lang.LangAlreadySet} ${db.get(`${message.guild.id}.language`)}`)
            }
            if (args[0] === 'fr') {
                await db.set(`${message.guild.id}.language`, `fr`)
                return message.channel.send(`${lang.LangSetOn} \`fr\` 🇫🇷`)
            }

            if (args[0] === 'eng') {
                await db.set(`${message.guild.id}.language`, `eng`)
                return message.channel.send(`${lang.LangSetOn} \`eng\` 🇬🇧`)
            }
            return message.channel.send(`${lang.LangErrorBadLang}`)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}