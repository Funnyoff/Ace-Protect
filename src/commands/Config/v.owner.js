/* eslint-disable no-undef */
const db = require('quick.db');
const Discord = require('discord.js');
const {
    blue,
    emojiAttention,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'owner',
    description: 'Ajout, suppression, list des utilisateurs owners',
    aliases: ['owner'],
    usage: 'owner add | remove + <@user>',
    perms: `\`OWNER (du Discord)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *owner* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        /// //////////////////////////////////////////////////////////////
        /// /////////////////////// EMBED ///////////////////////////////
        /// ////////////////////////////////////////////////////////////

        let prefixbot = db.get(`${message.guild.id}.prefix`)
        if (prefixbot == null) {
            prefixbot = prefix
        }

        const WLnoUser = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorNoMention}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorAlreadyWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const NoPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.OwnerErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLNoFind = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorWLNoExist}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLNoArgs = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} ${lang.OwnerBadArgs} \n${prefixbot}owner **add** + <@user> \n${prefixbot}owner **remove** + <@user> \n${prefixbot}owner + **list**`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLnoDB = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorNoDB}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(NoPerms)
        }

        if (message.author.id !== message.guild.owner.id) return message.channel.send(NoPerms);
        if (!(args[0])) return message.channel.send(WLNoArgs);

        if (!Array.isArray(db.get(`${message.guild.id}.Owners`))) {
            db.set(`${message.guild.id}.Owners`, []);
        }

        let memberID;

        if ((args[0]) === 'add') {
            if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
            else return message.channel.send(WLnoUser);

            if (db.get(`${message.guild.id}.Owners`).includes(memberID)) {
                return message.channel.send(WLAlready);
            }

            const member = message.guild.members.cache.get(memberID);
            if (!member) {
                return message.channel.send(WLNoFind);
            }

            db.push(`${message.guild.id}.Owners`, memberID);
            db.push(`${message.guild.id}.WLUsers`, memberID);

            const WLadded = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> ${lang.OwnerEmbedMessage1} **${member.user}** ${lang.OwnerEmbedAdded}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLadded);
        }
        if (args[0] === 'remove') {
            if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
            else return message.channel.send(WLnoUser);

            if (!db.get(`${message.guild.id}.Owners`).includes(memberID)) {
                return message.channel.send(WLnoDB);
            }

            db.set(`${message.guild.id}.Owners`, db.get(`${message.guild.id}.Owners`).filter((ID) => ID !== memberID));

            const WLRemoved = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.OwnerEmbedMessage1} **${message.guild.members.cache.get(memberID).user || memberID}** ${lang.OwnerEmbedRemoved}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLRemoved);
        }
        if (args[0] === 'list') {
            const list = await db.get(`${message.guild.id}.Owners`);
            let result = '';
            if (!list[0]) {
                result = `${lang.OwnerEmbedListNever}`;
            } else {
                let id;
                for (id of list) {
                    if (!message.guild.members.cache.has(id)) {
                        await db.set(`${message.guild.id}.Owners`, db.get(`${message.guild.id}.Owners`).filter((ID) => ID !== id));
                    } else {
                        result += `\n ${message.guild.members.cache.get(id)}, `;
                    }
                }
                result = `${result.substring(0, result.length - 2)}`;
            }
            const WLList = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.OwnerEmbedList} ${result}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLList);
        }
    },
};