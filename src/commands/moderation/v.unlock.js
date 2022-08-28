const Discord = require('discord.js');
const db = require('quick.db');
const {
  blue,
  logs,
  emojiAttention
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'unlock',
  description: 'débloque le channel',
  aliases: ['unlock', 'ul'],
  usage: 'unlock',
  perms: `\`MANAGE_CHANNELS\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *unlock* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const NoPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.LockErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.lineReply(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(embedbotPerms)
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

    try {
      
    } catch {
      
    }

    try {
      message.channel.updateOverwrite(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() == '@everyone'), {
        SEND_MESSAGES: true,
        ADD_REACTIONS: true,
      });

      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${lang.UnlockChannel}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      message.channel.send(embed);

      const embed1 = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${lang.UnlockChannel}`)
        .setDescription(`${lang.BanAction} Unlock \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      let logchannel;
      if (db.get(`${message.guild.id}.Logs`)) {
        logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
      } else {
        logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
      }
      if (!logchannel) return;
      logchannel.send(embed1);
    } catch (e) {
      message.channel.send(e);
    }
  },
};