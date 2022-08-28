/* eslint-disable no-undef */
const Discord = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');
const moment = require('moment');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
const db = require('quick.db');

module.exports = {
  name: 'sniper',
  aliases: ['sniper', 'sniper'],
  description: "Permet d'avoir le- dernier message envoyé",
  usage: 'sniper',
  perms: `\`SEND_MESSAGES\``,

 async (bot, message, args) {
    const msg = bot.snipes.get(message.channel.id)
    const embed = new Discord.MessageEmbed()
    .setAuthor(msg.author, msg.member.user.displayAvatarURL())
    .setDescription(msg.content)
    .setFooter('Get Sniped lol')
    .setTimestamp();
    message.channel.send(embed);

}
}
