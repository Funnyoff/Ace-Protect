/* eslint-disable no-undef */
const db = require('quick.db');
const Discord = require('discord.js');
const {
    blue,
    emojiAttention,
    owner,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'antiw',
    description: 'Ajout, suppression, list des mots interdits',
    aliases: ["blacklistword", "anti-insulte", "antiinsulte", "anti-word"],
    usage: 'antiword add | remove + <mot>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *antiword* sur |${message.guild.name}|`)
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
            .setDescription(`<@${message.author.id}> ${lang.AntiWordBadWord}.`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.AntiWordAlready}.`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        const WLNoArgs = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} ${lang.OwnerBadArgs} \n${prefixbot}antiw **add** + <${lang.AntiWordWord}> \n${prefixbot}antiw **remove** + <${lang.AntiWordWord}> \n${prefixbot}antiw + **list**`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLnoDB = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.AntiWordNoBlacklisted}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const NoWL = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WLUsersErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
            }
        }

        if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {
            if (!(args[0])) return message.channel.send(WLNoArgs);
            if (!Array.isArray(db.get(`${message.guild.id}.AntiWord`))) {
                db.set(`${message.guild.id}.AntiWord`, []);
            }

            let memberID;

            if ((args[0]) === 'add') {
                if (args[1]) memberID = args[1]
                else return message.channel.send(WLnoUser);

                if (db.get(`${message.guild.id}.AntiWord`).includes(memberID)) {
                    return message.channel.send(WLAlready);
                }

                db.push(`${message.guild.id}.AntiWord`, memberID);

                const WLadded = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordTheWord} \`${memberID}\` ${lang.AntiWordAdded}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLadded);
            }
            if (args[0] === 'remove') {
                if (args[1]) memberID = args[1]
                else return message.channel.send(WLnoUser);

                if (!db.get(`${message.guild.id}.AntiWord`).includes(memberID)) {
                    return message.channel.send(WLnoDB);
                }

                db.set(`${message.guild.id}.AntiWord`, db.get(`${message.guild.id}.AntiWord`).filter((ID) => ID !== memberID));

                const WLRemoved = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordTheWord} **${memberID}** ${lang.AntiWordRemoved}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLRemoved);
            }
            if (args[0] === 'list') {
                const list = await db.get(`${message.guild.id}.AntiWord`);
                let result = '';
                if (!list[0]) {
                    result = `${lang.AntiWordNothing}`;
                } else {
                    let id;
                    for (id of list) {
                            result += `\`${id}\`, `;
                    }
                    result = `${result.substring(0, result.length - 2)}`;
                }
                const WLList = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordFinal} \n ${result}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLList);
            }
        } else {
            return message.channel.send(NoWL);
        }
    },
};