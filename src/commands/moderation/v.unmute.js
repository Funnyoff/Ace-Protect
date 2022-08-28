const {
  MessageEmbed,
} = require('discord.js');
const {
  logs,
  emojiAttention,
  blue,
} = require('../../../config.json');
const Discord = require('discord.js')
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'unmute',
  description: 'unmute la personne',
  aliases: ['unmute'],
  usage: 'unmute + <@user>',
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *unmute* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(embedbotPerms)

    const mention = message.mentions.members.first();

    let muteRole;
    if (db.get(`${message.guild.id}.RoleMuted`)) {
      let role1 = db.get(`${message.guild.id}.RoleMuted`)
      let rolez = message.guild.roles.cache.find((role) => role.id === role1)
      if (!rolez) db.delete(`${message.guild.id}.RoleMuted`)
      muteRole = rolez.id

    } else {
      let role = message.guild.roles.cache.find((role) => role.name === '🚫・Muted')
      if (!role) return;
      muteRole = role.id
    }

    if (!mention) {
      message.reply({
        embed: {

          color: color,
          description: `<@${message.author.id}> ${lang.UnmuteErrorNoMention}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    } else if (!mention.roles.cache.has(muteRole)) {
      return message.reply({
        embed: {

          color: color,
          description: `<@${mention.id}> ${lang.UnmuteErrorNoMuted}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    } else {
      try {
        mention.roles.remove(muteRole);
      } catch {

      }

      const embed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Unmute \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());

      message.channel.send(embed);

      let logchannel;
      if (db.get(`${message.guild.id}.Logs`)) {
        logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
      } else {
        logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
      }
      if (!logchannel) return;

      const unmuteembed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Unmute \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      logchannel.send(unmuteembed);
    }
  },
};