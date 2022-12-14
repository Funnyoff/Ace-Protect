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
  name: 'wl',
  description: 'Ajout, suppression, list des utilisateurs whitelists',
  aliases: ['whitelistu', 'wluser'],
  usage: 'wlu add | remove + <@user>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *Wl user* sur |${message.guild.name}|`)
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
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorNoMention}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUersErrorAlreadyWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLNoFind = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorUserNoExist}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLNoArgs = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} ${lang.OwnerBadArgs} \n${prefixbot}wl **add** + <@user> \n${prefixbot}wl **remove** + <@user> \n${prefixbot}wl + **list**`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLnoDB = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorNoWL}`)
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

    if (!message.guild.owner) {
      return message.channel.send(NoWL)
    }

    if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {
      if (!(args[0])) return message.channel.send(WLNoArgs);
      if (!Array.isArray(db.get(`${message.guild.id}.WLUsers`))) {
        db.set(`${message.guild.id}.WLUsers`, []);
      }

      let memberID;

      if ((args[0]) === 'add') {
        if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
        else return message.channel.send(WLnoUser);

        if (db.get(`${message.guild.id}.WLUsers`).includes(memberID)) {
          return message.channel.send(WLAlready);
        }

        const member = message.guild.members.cache.get(memberID);
        if (!member) {
          return message.channel.send(WLNoFind);
        }

        db.push(`${message.guild.id}.WLUsers`, memberID);

        const WLadded = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`<@${message.author.id}> ${lang.OwnerEmbedMessage1} **${member.user}** ${lang.WLUsersAdded}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLadded);
      }
      if (args[0] === 'remove') {
        if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
        else return message.channel.send(WLnoUser);

        if (!db.get(`${message.guild.id}.WLUsers`).includes(memberID)) {
          return message.channel.send(WLnoDB);
        }

        db.set(`${message.guild.id}.WLUsers`, db.get(`${message.guild.id}.WLUsers`).filter((ID) => ID !== memberID));

        const WLRemoved = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.OwnerEmbedMessage1} **${message.guild.members.cache.get(memberID).user || memberID}** ${lang.WLUsersRemoved}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLRemoved);
      }
      if (args[0] === 'list') {
        const list = await db.get(`${message.guild.id}.WLUsers`);
        let result = '';
        if (!list[0]) {
          result = `${lang.WlUsersNoUsers}`;
        } else {
          let id;
          for (id of list) {
            if (!message.guild.members.cache.has(id)) {
              await db.set(`${message.guild.id}.WLUsers`, db.get(`${message.guild.id}.WLUsers`).filter((ID) => ID !== id));
            } else {
              result += `\n ${message.guild.members.cache.get(id)}, `;
            }
          }
          result = `${result.substring(0, result.length - 2)}`;
        }
        const WLList = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WLUsersUsers} ${result}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLList);
      }
    } else {
      return message.channel.send(NoWL);
    }
  },
};