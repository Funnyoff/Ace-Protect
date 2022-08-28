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
    name: 'color',
    aliases: ['setcolor'],
    description: 'Choisis la couleur des embeds du bot',
    usage: 'color <HEX>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *color* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ColorErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const Length = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ColorErrorBadCode}`)
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

            const regex = /^[0-9A-F]{6}$/i

            if (!args[0]) return message.channel.send(Length)
            if (args[0].startsWith('#')) {
                let codecolor = args[0].replace(/[#]/g, '')
                if (codecolor.match(regex)) {
                    db.set(`${message.guild.id}.Color`, codecolor)
                    const embedcolor = new Discord.MessageEmbed()
                        .setColor(db.get(`${message.guild.id}.Color`))
                        .setDescription('­')
                    message.channel.send(`${lang.CodeColorSetted1} \`${codecolor}\`, ${lang.CodeColorSetted2}`)
                    return message.channel.send(embedcolor)
                } else {
                    return message.channel.send(Length)
                }
            }
            if (args[0].match(regex)) {
                let codecolor = args[0]
                db.set(`${message.guild.id}.Color`, codecolor)
                const embedcolor = new Discord.MessageEmbed()
                    .setColor(db.get(`${message.guild.id}.Color`))
                    .setDescription('­')
                message.channel.send(`${lang.CodeColorSetted1} \`${codecolor}\`, ${lang.CodeColorSetted2}`)
                return message.channel.send(embedcolor)
            }
            return message.channel.send(Length)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}