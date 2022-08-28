/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'kick',
  description: 'kick la personne mentionné',
  aliases: ['kick'],
  usage: 'kick + <@user>',
  perms: `\`KICK_MEMBERS\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *kick* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    if (!args[0]) {
      return message.channel.send({
        embed: {

          color: color,
          description: `${lang.KickErrorNoPerson}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    }

    const kicked = message.mentions.members.first() || client.members.resolve(args[0]);
    const reason = args.slice(1).join(' ') || `${lang.BanNoReason}`;
    let logchannel;
    if (db.get(`${message.guild.id}.Logs`)) {
      logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
    } else {
      logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
    }

    if (!message.member.permissions.has('KICK_MEMBERS')) {
      const nopermsembed = new Discord.MessageEmbed()
        .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.KickErrorNoPerms}`)
        .setColor(color)
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
      return message.lineReply(nopermsembed);
    }

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(embedbotPerms)

    if (!kicked) {
      return message.reply({
        embed: {

          color: color,
          description: `${lang.KickErrorNoPerson}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    }
    // MESSAGES

    if (message.author === kicked) {
      const sanctionyourselfembed = new Discord.MessageEmbed()
        .setDescription(`${lang.BanErrorYourself}`)
        .setColor(color)
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
      message.channel.send(sanctionyourselfembed);

      return;
    }

    const embedbotPerms1 = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.BanErrorRoleHighest}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const embednopermss = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.KickErrorCantKick}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (kicked.roles.highest.position > message.guild.me.roles.highest.position) {
      return message.channel.send(embedbotPerms1)
    }

    if (kicked.roles.highest.position >= message.member.roles.highest.position) {
      return message.channel.send(embednopermss)
    }

    try {
      message.guild.member(kicked).kick(reason);
    } catch {

    }

    const successfullyembed = new Discord.MessageEmbed()
      .setAuthor(kicked.user.username, kicked.user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Kick \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    message.channel.send(successfullyembed);

    const embed = new MessageEmbed()
      .setAuthor(kicked.user.username, kicked.user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Kick \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!logchannel) return;
    logchannel.send(embed);
  },
};