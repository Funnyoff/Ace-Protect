const db = require('quick.db');
const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const {
  linkMuteTime,
  logs,
   blue,
  emojiAttention,
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('message', async (message) => {

    if (!message) return;
    if (!message.guild) return;
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
       color = "2f3136";
    }

    let language;
    if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
      await db.set(`${message.guild.id}.language`, "fr")
      language = db.get(`${message.guild.id}.language`)
    }
    language = db.get(`${message.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.author) return;
    if (!message.member) return;
    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    if (message.author.flags.has('VERIFIED_BOT')) return

    if (db.get(`${message.guild.id}.WLChannels`) === undefined) return;

    if (db.get(`${message.guild.id}.WLChannels`) === null) return;

    if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
      }
    }

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
      }
    }

    if (db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) return;
    if (db.get(`${message.guild.id}.Owners`).includes(message.author.id)) return;
    if (db.get(`${message.guild.id}.WLChannels`).includes(message.channel.id)) return;

    if (message.author.id == client.user.id) return;

    const channel = message.guild.channels.cache.first() || message.channel || message.channel.id;

    let logchannel;
    if (db.get(`${message.guild.id}.Logs`)) {
      logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
    } else {
      logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
    }

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

    let choice1 = db.get(`${message.guild.id}.antilink`);
    if (choice1 == undefined || choice1 == null) {
      choice1 = true;
    }

    if (choice1 === true) {
      if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.') || message.content.includes('discord.gg/')) {
        if (!message.channel.messages.cache.find((x) => x.id == message.id)) return;
        try {
          message.delete();
        } catch {
          return;
        }

        if (!muteRole) {
          return message.channel.send(`${emojiAttention} ${lang.AntilinkNoMuteRole} **${db.get(`${message.guild.id}.prefix`)}setup** / **${db.get(`${message.guild.id}.prefix`)}setmuterole**`).then((mssg) => {
            try {
              mssg.delete({
                timeout: 10000,
              })
            } catch {

            }
          });
        }

        if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
          try {
            message.member.roles.add(muteRole);
          } catch {

          }
        }
        message.reply(`${lang.AntilinkMuted}`).then((mssg) => {
          try {
            mssg.delete({
              timeout: 10000,
            })
          } catch {

          }
        });

        const logEmbed1 = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.AntilinkMember} <@${message.author.id}> \n ${lang.BanAction} ${lang.AntilinkLogMuted} \n ${lang.BanReason} Anti-Link.`)
          .setTimestamp()
          .setFooter(`${client.user.username} `);

        if (!logchannel) return;
        logchannel.send(logEmbed1);

        setTimeout(() => {
          if (!message.member) return;
          if (message.member.roles.cache.has(muteRole)) {
            try {
              message.member.roles.remove(muteRole).then(() => {
                const logEmbed4 = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Anti-Link.`)
                  .setTimestamp()
                  .setFooter(`${client.user.username} `);

                if (!logchannel) return;
                logchannel.send(logEmbed4);
              });
            } catch {}

          }
        }, linkMuteTime);
      }
    } else {

    }
  });

  /// //////////////////////////////////////////////////////////////
  /// /////////////////////// ANTI LINK EDIT //////////////////////
  /// ////////////////////////////////////////////////////////////

  client.on('messageUpdate', async (oldMsg, newMsg) => {

    if (!oldMsg) return;
    if (!newMsg) return;
    const message = newMsg;
    if (!message.guild) return;

    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
       color = "2f3136";
    }

    let language;
    if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
      await db.set(`${message.guild.id}.language`, "fr")
      language = db.get(`${message.guild.id}.language`)
    }
    language = db.get(`${message.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;

    if (db.get(`${message.guild.id}.WLChannels`) === undefined) return;

    if (db.get(`${message.guild.id}.WLChannels`) === null) return;

    if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
      }
    }

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
      if (message.guild.owner) {
        db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
      }
    }

    if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) return;
    if (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) return;

    if (db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) return;
    if (db.get(`${message.guild.id}.Owners`).includes(message.author.id)) return;
    if (db.get(`${message.guild.id}.WLChannels`).includes(message.channel.id)) return;

    if (message.author.id == client.user.id) return;

    let logchannel;
    if (db.get(`${message.guild.id}.Logs`)) {
      logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
    } else {
      logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
    }

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

    if(!muteRole) return;

    let choice1 = db.get(`${message.guild.id}.antilink`);
    if (choice1 == undefined || choice1 == null) {
      choice1 = true;
    }

    let hasBeenApplied = false;

    if (choice1 === true) {
      if (hasBeenApplied) return;
      if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.') || message.content.includes('discord.gg/')) {
        if (!message.channel.messages.cache.find((x) => x.id == message.id)) return;
        try {
          message.delete();
        } catch {
          return;
        }

        if (!muteRole) {
          return message.channel.send(`${emojiAttention} ${lang.AntilinkNoMuteRole} **${db.get(`${message.guild.id}.prefix`)}setup** / **${db.get(`${message.guild.id}.prefix`)}setmuterole**`).then((mssg) => {
            try {
              mssg.delete({
                timeout: 10000,
              })
            } catch {

            }
          });
        }

        if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
          try {
            message.member.roles.add(muteRole);
          } catch {

          }
        }
        message.reply(`${lang.AntilinkMuted}`).then((mssg) => {
          try {
            mssg.delete({
              timeout: 10000,
            })
          } catch {

          }
        });

        const logEmbed2 = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} Anti-Link (Edit).`)
          .setTimestamp()
          .setFooter(`${client.user.username} `);

        if (!logchannel) return;
        logchannel.send(logEmbed2);

        hasBeenApplied = true;
        setTimeout(() => {
          if (!message.member) return;
          if (message.member.roles.cache.find((x) => x.id == muteRole)) {
            try {
              message.member.roles.remove(muteRole).then(() => {
                const logEmbed3 = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Anti-Link (Edit).`)
                  .setTimestamp()
                  .setFooter(`${client.user.username} `);

                if (!logchannel) return;
                logchannel.send(logEmbed3);
              });
            } catch {

            }
          }
        }, linkMuteTime);
      }
    } else {

    }
  });
};