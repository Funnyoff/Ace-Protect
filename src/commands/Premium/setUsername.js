const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const Discord = require('discord.js');
const {
    emojiAttention,
    owner,
    blue,
} = require('../../../config.json');
const emojis = require('../../../emojis.json')

module.exports = {
    name: 'setusername',
    aliases: ['setusername'],
    description: 'Choisis le nom du bot',
    usage: 'setusername <username>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *setusername* sur |${message.guild.name}|`)
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
            
            if (db.get(`${client.user.id}.username`) === true) {
                return message.channel.send(`${lang.SetUsernameFiveHour}`)
            }

            if (!args[0]) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            let newusername = args.join(' ')
            if (newusername.length > 32) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            if (newusername.length < 2) {
                return message.channel.send(`${lang.SetUsernameInvalid}`)
            }
            client.user.setUsername(newusername)
            message.channel.send(`${lang.SetUsernameNewName} **${newusername}**`)
            db.set(`${client.user.id}.username`, true)

            setTimeout(() => {
                db.set(`${client.user.id}.username`, false)
            }, 18000000);
        } else {
            return message.lineReply(WLAlready);
        }

    }
}