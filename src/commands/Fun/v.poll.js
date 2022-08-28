const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const ms = require('ms')
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'poll',
  description: 'crée un poll',
  aliases: ['poll'],
  usage: 'poll + <message>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {

    let color;
    if (db.get(`${message.guild.id}.Color`)) {
        color = db.get(`${message.guild.id}.Color`)
    } else {
        color = blue;
    }

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)
    
    if (!args[0]) return message.channel.send(`${lang.PollErrorQuestion}`);

    const msg = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`$ ${msg}`)
      .setAuthor(`${lang.PollCreateBy} ${message.author.username}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    message.delete();

    message.channel.send(embed).then(async (messageReaction) => {
      messageReaction.react(`${emojis.yes}`);
      await sleep(250)
      messageReaction.react(`${emojis.no}`);
      function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    });
  },
};