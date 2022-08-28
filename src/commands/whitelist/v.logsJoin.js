/* eslint-disable no-undef */
const Discord = require('discord.js');
const db = require('quick.db');
const {
  blue,
  logs,
  emojiAttention,
  prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'logsjoin',
  description: 'Désactive / Active les logs de join et leave',
  aliases: ['logjoin', 'logjoins', 'logsjoins'],
  usage: 'logsjoin [on/off]',
  perms: `\`Whitelist\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *logsjoin* sur |${message.guild.name}|`)
    let logchannel;
    if (db.get(`${message.guild.id}.Logs`)) {
      logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
    } else {
      logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
    }

    const WLAlready = new Discord.MessageEmbed()
      .setColor(blue)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
      db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
    }

    if (!db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) {
      return message.channel.send(WLAlready);
    }

    if (args[0] === 'on') {
      db.set(`${message.guild.id}.logsJoin`, true);
      message.channel.send({
        embed: {
          color: blue,
          description: `${lang.BanAction} ${lang.LogsJoinEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });

      if (!logchannel) return
      logchannel.send({
        embed: {
          color: blue,
          description: `${lang.BanAction} ${lang.LogsJoinEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    } else if (args[0] === 'off') {
      db.set(`${message.guild.id}.logsJoin`, false);
      message.channel.send({
        embed: {
          color: blue,
          description: `${lang.BanAction} ${lang.LogsJoinDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });

      if (!logchannel) return
      logchannel.send({
        embed: {
          color: blue,
          description: `${lang.BanAction} ${lang.LogsJoinDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    } else {
      message.channel.send({
        embed: {
          color: blue,
          description: `${lang.WhitelistPreciseOFFoON} ${lang.LogsJoinFinalWord}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    }
  },
};