const Discord = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {

  name: 'avatar',
  description: "donne l'avatar de la personne mentionné",
  aliases: ['avatar', 'pic'],
  usage: 'pic + <@user>',
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
    
    const member = message.mentions.users.first() || message.author;
    const avatar = member.displayAvatarURL({
      size: 1024,
      dynamic: true,
    });

    const embed = new Discord.MessageEmbed()
      .setTitle(`${member.username} avatar :`)
      .setImage(avatar)
      .setColor(color)
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    message.channel.send(embed);
  },
};