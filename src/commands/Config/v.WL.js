const {
  MessageEmbed,
} = require('discord.js');
const Pagination = require('discord.js-pagination');
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
  owner
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'whitelist',
  description: 'Affiche les commandes de whitelist',
  aliases: ['whelp'],
  usage: 'whitelist (donne la liste des commandes)',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *wl* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
      }
    }

    if (!message.guild.owner) {
      return message.channel.send(WLAlready)
    }

    if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {
      const help1 = new MessageEmbed()
        .setColor(color)
        .setTitle(`**${lang.WhitelistEmbedChannelsTitle}**`)
        .addField(`**${lang.WhitelistEmbedChannelsWarn1}**`, `${emojis.alert} ${lang.WhitelistEmbedChannelsWarn2}`)
        .addField(`• \`wlc + add + <#channel>\``, `*${lang.WhitelistEmbedChannelsAdd}*`)
        .addField(`• \`wlc + remove + <#channel>\``, `*${lang.WhitelistEmbedChannelsRemove}*`)
        .addField(`• \`wlc + list\``, `*${lang.WhitelistEmbedChannelsList}*`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      const help2 = new MessageEmbed()
        .setColor(color)
        .setTitle(`**${lang.WhitelistEmbedUsersTitle}**`)
        .addField(`**${lang.WhitelistEmbedUsersWarn1}**`, `${emojis.alert} ${lang.WhitelistEmbedUsersWarn2}`)
        .addField(`• \`wl + add + <@user>\``, `*${lang.WhitelistEmbedUsersAdd}*`)
        .addField(`• \`wl + remove + <@user>\``, `*${lang.WhitelistEmbedUsersRemove}*`)
        .addField(`• \`wl + list\``, `*${lang.WhitelistEmbedUsersList}*`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      const pages = [
        help1,
        help2,
      ];

      const emojiList = ['⬅️', '➡️'];

      const timeout = 500000;

      Pagination(message, pages, emojiList, timeout);
    } else {
      return message.channel.send(WLAlready);
    }


  },
};