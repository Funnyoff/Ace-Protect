/* eslint-disable no-undef */
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const Discord = require('discord.js')
const db = require('quick.db');
const emojis = require('../../../emojis.json');
module.exports = {
  name: 'ping',
  aliases: ['ms', 'ping'],
  description: 'Envoie la latence du bot',
  usage: 'ping',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *ping* sur |${message.guild.name}|`)
    let color;
    if(db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    message.channel.send({
      embed: {

        color: color,
        title: `${emojis.loading} ${lang.PingTitle}`,
        description: `${lang.PingEmbed} **${message.client.ws.ping}** ms.`,
        footer: {
          icon_url: `${client.user.displayAvatarURL()}`, // petite en bas a gauche
          text: `${client.user.username} `,
        },
      },
    });
  },
};
