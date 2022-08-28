const ms = require('ms');
const {
  MessageEmbed,
} = require('discord.js');

const {
  logs,
  emojiAttention,
  blue,
} = require('../../../config.json');
const Discord = require('discord.js')
const db = require('quick.db')
const emojis = require('../../../emojis.json')

module.exports = {
  name: 'tempmute',
  description: 'tempmute la personne',
  aliases: ['tempmute'],
  usage: 'tempmute + <@user> + <time> + <reason>',
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *tempmute* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const mention = message.guild.member(message.mentions.users.first());

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

    const reason = args.slice(2).join(' ') || 'Aucune raison fournie.';
    const muteTime = (args[1] || '600s');

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(embedbotPerms)

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
    } else if (mention.roles.cache.has(muteRole)) {
      return message.reply({
        embed: {

          color: color,
          description: `<@${mention.id}> ${lang.MuteUserAlreadyMute}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} `,
          },
        },
      });
    } else {
      try {
        await mention.roles.add(muteRole);
      } catch {

      }

      setTimeout(() => {
        try {
          mention.roles.remove(muteRole);
        } catch {

        }
      }, ms(muteTime));

      const Owner = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.MuteUserOwner}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      if (mention.id === message.guild.ownerID) return message.channel.send(Owner);

      const bot = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.TempmuteErrorBotCant}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      if (!mention.manageable) return message.channel.send(bot);

      const embed = new MessageEmbed()
        .setAuthor(mention.user.username, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} tempmute \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.TempmuteFinalMessageTime} ${ms(ms(muteTime))} \n ${lang.BanReason} ${reason}`)
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

      const tempmuteembed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} tempmute\n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.TempmuteFinalMessageTime} ${ms(ms(muteTime))} \n ${lang.BanReason} ${reason} `)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      logchannel.send(tempmuteembed);
    }
  },
};