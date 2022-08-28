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
    name: 'serverlist',
    aliases: ['server', 'leaveserver', 'leaveserv'],
    description: 'Affiche les serveurs du bot, possibilité de les faires leaves',
    usage: 'setavatar <lien de l\'avatar>',
    perms: `\`OWNER (du bot premium)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *serverlist* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.serverListNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
        }

        if (message.author.id === owner) {

            const idServer = [];
            const arrayServer = [];
            let i = 1;

            client.guilds.cache.forEach(r => {
                arrayServer.push(
                    `**${i})** ${emojis.flechebleu} ${r.name}  |  **${r.memberCount}** ${lang.serverListMembers} | *(${r.id})*`
                )
                idServer.push(r.id)
                i++
            });

            const size = client.guilds.cache.size

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${emojis.info} ${lang.serverListEmbedTitle} :`)
                .setDescription(arrayServer.join('\n'))
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
           const msg = await message.channel.send(embed)
            //message.channel.send(`${lang.serverListMessage}`)
            

        } else {
            return message.lineReply(WLAlready);
        }
    }
}