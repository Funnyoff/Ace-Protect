const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'unban',
  description: 'Deban la personne mentionné',
  aliases: ['unban'],
  usage: 'unban + <@id>',
  perms: `\`BAN_MEMBERS\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *unban* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
        color = db.get(`${message.guild.id}.Color`)
    } else {
        color = blue;
    }
          let logchannel;
      if (db.get(`${message.guild.id}.Logs`)) {
        logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
      } else {
        logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
      }

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.BanErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (!message.member.hasPermission('BAN_MEMBERS')) return message.lineReply(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(embedbotPerms)

    const user = await client.users.fetch(args[0]);
    if (!user) return message.reply(`${lang.UnbanNoPerson}`);
    message.guild.members.unban(user);

    const embed = new MessageEmbed()
      .setAuthor(`${user.username}`, user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Unban \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    message.channel.send(embed);

    const unbanembed = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Unban \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
    if (!logchannel) return;
    logchannel.send(unbanembed);
  },
};
