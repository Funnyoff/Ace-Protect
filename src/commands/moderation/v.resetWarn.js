const db = require('quick.db');
const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')

module.exports = {
  name: 'resetwarns',
  aliases: ['rwarns'],
  usage: 'rwarns <@user>',
  description: "Reset les avertissements d'un membre",
  perms: `\`MANAGE_CHANNELS\``,
  
  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *resetwarn* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
        color = db.get(`${message.guild.id}.Color`)
    } else {
        color = blue;
    }

          let logchannel;
      if (db.get(`${message.guild.id}.Logs`)) {
        logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
      } else {
        logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
      }

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      const embedPerms = new MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
      return message.lineReply(embedPerms);
    }

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(embedbotPerms)

    const user = message.mentions.members.first();

    if (!user) {
      const embedUser = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.ResetWarnErrorNoPerson}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedUser);
    }

    if (message.mentions.users.first().bot) {
      const embedBot = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.ResetWarnErrorBot}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedBot);
    }

    const warnings = db.get(`${message.guild.id}.users.${user.id}.warnings`);

    if (warnings === null || warnings == 0) {
      const embedAvert2 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.ResetWarnErrorUserNoAvert}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedAvert2);
    }

    db.delete(`${message.guild.id}.users.${user.id}.warnings`);

    const embedAvert4 = new MessageEmbed()
      .setColor(color)
      .setDescription(`${lang.ResetWarnFinalMessage1} ${user} ${lang.ResetWarnFinalMessage2} \n \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    await message.channel.send(embedAvert4);

    const embedAvertLog = new MessageEmbed()
      .setColor(color)
      .setDescription(`${lang.ResetWarnFinalMessage1} ${user} ${lang.ResetWarnFinalMessage2} \n \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!logchannel) return;
    logchannel.send(embedAvertLog);
  },
};
