const db = require('quick.db');
const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const Discord = require('discord.js')

module.exports = {
  name: 'warnings',
  description: "Affiche le nombre de warns de la personne mentionné",
  aliases: ['warnings'],
  usage: 'warnings + <@user>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *warnings* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }
    const user = message.mentions.members.first() || message.author;

    let warnings = db.get(`${message.guild.id}.users.${user.id}.warnings`);

    if (warnings === null) warnings = 0;

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(`${user} ${lang.WarningsEmbed1} **${warnings}** ${lang.WarningsEmbed2}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    message.channel.send(embed);
  },
};
