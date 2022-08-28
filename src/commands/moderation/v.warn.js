const {
  MessageEmbed,
} = require('discord.js');
const db = require('quick.db');
const ms = require('ms');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const Discord = require('discord.js')
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'warn',
  usage: 'warn <@user> <reason>',
  description: 'Warn la personne mentionné',
  aliases: ['warn'],
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *warn* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    if (!message.member || message.channel.type == 'dm') return;

    let logchannel;
    if (db.get(`${message.guild.id}.Logs`)) {
      logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
    } else {
      logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
    }

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      const embedPerms = new MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.lineReply(embedPerms);
    }

    const user = message.mentions.members.first();

    if (!user) {
      const embedUser = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorNoPerson}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedUser);
    }

    if (message.mentions.users.first().bot) {
      const embedBot = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorBot}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedBot);
    }

    if (message.author.id === user.id) {
      const embedWarn = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorYourself}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedWarn);
    }

    if (user.id === message.guild.owner.id) {
      const embedOwner = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorUserOwner}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedOwner);
    }

    const reason = args.slice(1).join(' ') || `${lang.BanNoReason}`;

    if (!reason) {
      const embedRaison = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorNoReason1} \n **${db.get(`${message.guild.id}.prefix`)}warn <@user> <reason>**`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedRaison);
    }

    const warnings = db.get(`${message.guild.id}.users.${user.id}.warnings`);

    let muteRole;
    if (db.get(`${message.guild.id}.RoleMuted`)) {
      let role1 = db.get(`${message.guild.id}.RoleMuted`)
      let rolez = message.guild.roles.cache.find((role) => role.id === role1)
      if(!rolez) db.delete(`${message.guild.id}.RoleMuted`)
      muteRole = rolez.id
      
    } else {
      let role = message.guild.roles.cache.find((role) => role.name === '🚫・Muted')
      if (!role) return;
      muteRole = role.id
    }

    const muteTime = ('3600s');

    if (warnings === 4) {
      const embedWarn4 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user}, ${lang.WarnUserLimit}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      message.channel.send(embedWarn4);

      if (!muteRole) return;
      try {
        user.roles.add(muteRole);
      } catch {

      }

      setTimeout(() => {
        try {
          user.roles.remove(muteRole);
        } catch {

        }
      }, ms(muteTime));

      db.delete(`${message.guild.id}.users.${user.id}.warnings`);
    } else if (warnings === null) {
      const warnings2 = db.get(`${message.guild.id}.users.${user.id}.warnings`);

      const embedAvert2 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      const embedAdvertLog = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason} \n ${lang.WarnEmbedNumber1} ${warnings2 + 1} ${lang.WarnEmbedNumber2}`)
        .setThumbnail(message.mentions.users.first().avatarURL())
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      db.set(`${message.guild.id}.users.${user.id}.warnings`, 1);
      await message.channel.send(embedAvert2);

      if (!logchannel) return;
      logchannel.send(embedAdvertLog);

    } else if (warnings !== null) {
      const warnings2 = db.get(`${message.guild.id}.users.${user.id}.warnings`);

      const embedAvert4 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      const embedAdvertLog1 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason} \n ${lang.WarnEmbedNumber1} ${warnings2 + 1} ${lang.WarnEmbedNumber2}`)
        .setThumbnail(message.mentions.users.first().avatarURL())
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      if (!logchannel) return;
      logchannel.send(embedAdvertLog1);

      db.add(`${message.guild.id}.users.${user.id}.warnings`, 1);
      await message.channel.send(embedAvert4);
    }
  },
};