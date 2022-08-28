/* eslint-disable no-undef */
const Discord = require('discord.js');
const db = require('quick.db');
const {
  blue,
  logs,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'invite',
  description: 'lien d\'invitation du bot',
  aliases: ['add', 'inv', 'invite'],
  usage: 'invite',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *invite* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const invite = new Discord.MessageEmbed()
    .setTitle(` ${lang.InviteTitle}`)
    .setURL('https://discord.com/oauth2/authorize?client_id=925889075997736960&scope=bot&permissions=8')
    .setColor(color)
    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`)
message.channel.send(invite)

  },
};
