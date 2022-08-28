const db = require('quick.db');
const {
  MessageEmbed,
} = require('discord.js');
const {
  emojiAttention,
  owner,
  blue,
} = require('../../../config.json');
const Discord = require('discord.js')
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'prefix',
  description: 'Choisis un nouveau prefix',
  aliases: ['setprefix', 'sp'],
  usage: 'prefix + <prefix>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *prefix* sur |${message.guild.name}|`)
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

    // Set Prefix
    const changes = args[0];

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.PrefixErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
      }
    }

    if(!message.guild.owner) {
      return message.channel.send(WLAlready)
  }

    if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {

      if (!changes) {
        return message.channel.send({
          embed: {

            color: color,
            description: `${emojis.alert} ${lang.PrefixErrorNoPrefix}`,
            footer: {
              icon_url: `${client.user.displayAvatarURL()}`,
              text: `${client.user.username} `,
            },
          },
        });
      }

      if (changes.length > 5) {
        return message.channel.send({
          embed: {

            color: color,
            description: `${emojis.alert} ${lang.PrefixErrorLength}`,
            footer: {
              icon_url: `${client.user.displayAvatarURL()}`, // petite en bas a gauche
              text: `${client.user.username} `,
            },
          },
        });
      }

      db.set(`${message.guild.id}.prefix`, changes);
      message.channel.send({
        embed: {

          color: color,
          description: `${lang.PrefixNewPrefix} **${changes}**`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`, // petite en bas a gauche
            text: `${client.user.username} `,
          },
        },
      });
    } else {
      return message.channel.send(WLAlready)
    }
  },
};