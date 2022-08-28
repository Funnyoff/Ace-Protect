const {
  logs,
  emojiAttention,
  emojiValidé,
  blue,
  owner
} = require('../../../config.json');
const db = require('quick.db')
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')
module.exports = {
  name: 'setup',
  description: 'crée les catégories, channels et rôles necessaire au bon fonctionnement du bot',
  aliases: ['setup'],
  usage: 'setup',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *setup* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.SetupErrorNoOwner}`)
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

      const permsrequired = [
        'SEND_MESSAGES',
        'MANAGE_ROLES',
        'MANAGE_CHANNELS'
      ]
      const embedbotPerms = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
      if (!message.guild.me.hasPermission(permsrequired)) return message.channel.send(embedbotPerms)

      let channelid;
      let logsch;
      if (db.get(`${message.guild.id}.Logs`)) {
        channelid = db.get(`${message.guild.id}.Logs`)
        logsch = message.guild.channels.cache.get(channelid)
      } else {
        logsch = message.guild.channels.cache.find((channel) => channel.name === logs);
      }

      let roleID;
      let roles;
      if (db.get(`${message.guild.id}.RoleMuted`)) {
        roleID = db.get(`${message.guild.id}.RoleMuted`)
        roles = message.guild.roles.cache.get(roleID)
      } else {
        roles = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
      }

      //const roles = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');

      if (logsch && !roles) {
        var muteRole = await message.guild.roles.create({
          data: {
            name: '🚫・Muted',
            permissions: 0,
          },
        });
        message.guild.channels.cache.forEach((channel) => channel.createOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false,
        }));

        if (db.get(`${message.guild.id}.WLUsers`).includes(message.guild.owner.id)) {
          db.get(`${message.guild.id}.WLUsers`)
        } else {
          db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
        }

        db.set(`${message.guild.id}.RoleMuted`, muteRole.id)
        await message.channel.send(`${emojis.yes} ${lang.SetupRoleMessage1} ${muteRole} ${lang.SetupRoleMessage2}`);
      }

      if (!logsch && roles) {
        var channel_Logs = await message.guild.channels.create(logs, {
          type: 'text',
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }],
        });
        db.push(`${message.guild.id}.WLChannels`, channel_Logs.id);
        db.set(`${message.guild.id}.Logs`, channel_Logs.id)
        message.channel.send(`${emojis.yes} ${lang.SetupChannelMessage} ${channel_Logs} ${lang.SetupRoleMessage2}`);
      }

      if (logsch && roles) {
        message.channel.send(`${lang.SetupAlreadyDo}`);
      }

      if (!logsch && !roles) {
        var channel_Logs = await message.guild.channels.create(logs, {
          type: 'text',
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }],
        });

        var muteRole = await message.guild.roles.create({
          data: {
            name: '🚫・Muted',
            permissions: 0,
          },
        });
        message.guild.channels.cache.forEach((channel) => channel.createOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false,
        }))

        let logsid = message.guild.channels.cache.find(channel => channel.name == logs)
        if (!logsid) return
        db.set(`${message.guild.id}.RoleMuted`, muteRole.id)
        db.set(`${message.guild.id}.Logs`, channel_Logs.id)
        db.push(`${message.guild.id}.WLChannels`, logsid.id);
        if (db.get(`${message.guild.id}.WLUsers`) === undefined) {
          db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
        }
        if (db.get(`${message.guild.id}.WLUsers`).includes(message.guild.owner.id)) {
          db.get(`${message.guild.id}.WLUsers`)
        } else {
          db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
        }
        await message.channel.send(`**${emojis.yes} ${lang.SetupFinalMessage1} ${channel_Logs} ${lang.SetupFinalMessage2} ${muteRole} ${lang.SetupFinalMessage3}`);
      }
    } else {
      message.channel.send(WLAlready)
    }
  }
};