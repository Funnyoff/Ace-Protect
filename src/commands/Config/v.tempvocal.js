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
    name: 'tempvocal',
    aliases: ['tempvoc', 'tempvocal', 'vocaltemp'],
    description: 'Met en place le système de vocaux temporaire',
    usage: 'tempvocal',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *tempvoc* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const permsrequired = [
            'SEND_MESSAGES',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
        ]

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.TempVocalErrorNoOwner}`)
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
            if (!message.guild.me.hasPermission(permsrequired)) return message.channel.send(embedbotPerms)

            const channelcheck = message.guild.channels.resolve(db.get(`${message.guild.id}.tempvoc.channel`))
            const categorycheck = message.guild.channels.resolve(db.get(`${message.guild.id}.categoryTempvoc`))

            if (!categorycheck && channelcheck) {
                const category = await message.guild.channels.create(`${lang.TempVocalCategoryCreate}`, {
                    type: 'category'
                })
                channelcheck.setParent(category)
                db.set(`${message.guild.id}.categoryTempvoc`, category.id)
                return message.channel.send(`${lang.TempVocalCategoryCreated}`)
            }
            if (categorycheck && !channelcheck) {
                const channel = await message.guild.channels.create(`${lang.TempVocalChannelCreate}`, {
                    type: 'voice',
                    parent: categorycheck
                })
                channel.setParent(categorycheck)
                db.set(`${message.guild.id}.tempvoc.channel`, channel.id)
                return message.channel.send(`${lang.TempVocalChannelCreated}`)
            }
            if (!categorycheck && !channelcheck) {
                const category = await message.guild.channels.create(`${lang.TempVocalCategoryCreate}`, {
                    type: 'category'
                })
                db.set(`${message.guild.id}.categoryTempvoc`, category.id)
                const channel = await message.guild.channels.create(`${lang.TempVocalChannelCreate}`, {
                    type: 'voice',
                    parent: category
                })
                db.set(`${message.guild.id}.tempvoc.channel`, channel.id)
                const embedCreated = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.TempVocalAllCreated1} \n ${emojis.alert} ${lang.TempVocalAllCreated2} \`${lang.TempVocalChannelCreate}\` ${lang.TempVocalAllCreated3}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                return message.channel.send(embedCreated)
            }
            if (channelcheck.parentID !== categorycheck.id) {
                channelcheck.setParent(categorycheck)
                return message.channel.send(`${lang.TempVocalAllCreated2} \`${lang.TempVocalChannelCreate}\` ${lang.TempVocalBadCategory}`)
            }
            if (channelcheck && categorycheck) {
                return message.channel.send(`${lang.TempVocalAlreadyCreated}`)
            }

        } else {
            message.channel.send(WLAlready)
        }
    }
}