const db = require('quick.db');
const MessageEmbed = require('discord.js');
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
  owner,
  prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'wlc',
  description: 'Ajout, suppression, list des salons whitelists',
  aliases: ['whitelistc', 'wlchannels'],
  usage: 'wlc + add | remove + <@user>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang) {

    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    /// //////////////////////////////////////////////////////////////
    /// /////////////////////// EMBED ///////////////////////////////
    /// ////////////////////////////////////////////////////////////
    let prefixbot = db.get(`${message.guild.id}.prefix`)
    if (prefixbot == null) {
      prefixbot = prefix
    }
    const WLnoDB = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorNoWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLnoChannel = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorNoChannel}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorAlready}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLNoFind = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorChannelNoExist}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const WLNoArgs = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} ${lang.OwnerBadArgs} \n${prefixbot}wlc **add** + <#channel> \n${prefixbot}wlc **remove** + <#channel> \n${prefixbot}wlc **list**`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    const NoWL = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WLUsersErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
      }
    }

    if (!message.guild.owner) {
      return message.channel.send(NoWL)
    }

    if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {
      if (!(args[0])) return message.channel.send(WLNoArgs);

      if (!Array.isArray(db.get(`${message.guild.id}.WLChannels`))) {
        db.set(`${message.guild.id}.WLChannels`, []);
      }

      let channelID;
      if ((args[0]) === 'add') {
        if (args[1]) channelID = args[1].replace(/[<>#]/g, '');
        else return message.channel.send(WLnoChannel);

        if (db.get(`${message.guild.id}.WLChannels`).includes(channelID)) {
          return message.channel.send(WLAlready);
        }

        const channel = message.guild.channels.cache.get(channelID);
        if (!channel) {
          return message.channel.send(WLNoFind);
        }

        db.push(`${message.guild.id}.WLChannels`, channelID);

        const WLadded = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`<@${message.author.id}> ${lang.WlChannelsWordChannel} **${channel}** ${lang.WLUsersAdded}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLadded);
      }
      if (args[0] === 'remove') {
        if (args[1]) channelID = args[1].replace(/[<>#]/g, '');
        else return message.channel.send(WLnoChannel);

        if (!db.get(`${message.guild.id}.WLChannels`).includes(channelID)) {
          return message.channel.send(WLnoDB);
        }

        db.set(`${message.guild.id}.WLChannels`, db.get(`${message.guild.id}.WLChannels`).filter((ID) => ID !== channelID));
        const channel = message.guild.channels.cache.get(channelID);

        const WLRemoved = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WlChannelsWordChannel} **${channel || channelID}** ${lang.WLUsersRemoved}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLRemoved);
      }
      if (args[0] === 'list') {
        const list = await db.get(`${message.guild.id}.WLChannels`);
        let result = '';
        if (!list[0]) {
          result = `${lang.WLChannelsNoCHannels}`;
        } else {
          for (id of list) {
            if (!message.guild.channels.cache.has(id)) {
              await db.set(`${message.guild.id}.WLChannels`, db.get(`${message.guild.id}.WLChannels`).filter((ID) => ID !== id));
            } else {
              result += `\n ${message.guild.channels.cache.get(id)}, `;
            }
          }
          result = `${result.substring(0, result.length - 2)}`;
        }
        const WLList = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WLChannelsFinalMessage} ${result}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLList);
      }
    } else {
      return message.channel.send(NoWL);
    }

  },
};