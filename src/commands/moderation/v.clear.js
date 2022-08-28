/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'clear',
  aliases: ['purge', 'clear'],
  description: 'clear les messages dans le channel',
  usage: 'clear + number (n < 100)',
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *clear* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    try {
      message.delete();
    } catch {

    }

    const messageArray = message.content.split(' ');
    const argsn = messageArray.slice(1);

    const noPermissionsEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
    if (!message.member.permissions.has('MANAGE_MESSSAGES')) return message.lineReply(noPermissionsEmbed);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(embedbotPerms)

    let deleteAmout;

    if (isNaN(argsn[0]) || parseInt(argsn[0]) <= 0) {
      const numberEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} ${lang.ClearErrorNumber}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      return message.reply(numberEmbed);
    }

    if (parseInt(argsn[0]) > 100) {
      const clearEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} ${lang.ClearErrorMoreCent}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      return message.reply(clearEmbed);
    }
    deleteAmout = parseInt(argsn[0]);

    try {
      message.channel.bulkDelete(deleteAmout, true);
    } catch {

    }
    const deleteEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`***${deleteAmout}*** ${lang.ClearFinalMessage}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
    message.reply(deleteEmbed).then((msg) => {
      try {
        msg.delete({
          timeout: 5000,
        });
      } catch {

      }
    });
  },
};