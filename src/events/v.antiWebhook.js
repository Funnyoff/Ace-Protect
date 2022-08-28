const db = require('quick.db');
const Discord = require('discord.js');
const {
   blue,
  logs,
  emojiValidé,
  emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('webhookUpdate', async (channel) => {

    if (!channel) return;
    if (!channel.guild) return;

    let color;
    if (db.get(`${channel.guild.id}.Color`)) {
      color = db.get(`${channel.guild.id}.Color`)
    } else {
       color = "2f3136";
    }

    let language;
    if (db.get(`${channel.guild.id}.language`) === undefined || db.get(`${channel.guild.id}.language`) === null) {
      await db.set(`${channel.guild.id}.language`, "fr")
      language = db.get(`${channel.guild.id}.language`)
    }
    language = db.get(`${channel.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return
    let choice2 = db.get(`${channel.guild.id}.antiwebhook`);

    if (choice2 == undefined || choice2 == null) {
      choice2 = true;
    }

    if (choice2 === true) {
      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'WEBHOOK_CREATE',
      });

      if (!fetchedLogs) return;

      const WebhookLog = fetchedLogs.entries.first();

      if (!WebhookLog) return;

      const {
        executor,
        target,
      } = WebhookLog;

      if (executor == client.user.id) return;
      const member = channel.guild.members.cache.get(executor.id)
      if (member) {
        if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;
      }
      if (executor.flags.has('VERIFIED_BOT')) return

      if (db.get(`${channel.guild.id}.WLUsers`) === undefined || db.get(`${channel.guild.id}.WLUsers`) === null) {
        if (channel.guild.owner) {
          db.push(`${channel.guild.id}.WLUsers`, channel.guild.owner.id);
        }
      }

      if (db.get(`${channel.guild.id}.Owners`) === undefined || db.get(`${channel.guild.id}.Owners`) === null) {
        if (channel.guild.owner) {
          db.push(`${channel.guild.id}.Owners`, channel.guild.owner.id);
        }
      }

      if (db.get(`${channel.guild.id}.Owners`) === undefined || db.get(`${channel.guild.id}.Owners`) === null) return;
      if (db.get(`${channel.guild.id}.WLUsers`) === undefined || db.get(`${channel.guild.id}.WLUsers`) === null) return;

      if (db.get(`${channel.guild.id}.WLUsers`).includes(executor.id)) return;
      if (db.get(`${channel.guild.id}.Owners`).includes(executor.id)) return;

      if (WebhookLog) {
        let logchannel;
        if (db.get(`${channel.guild.id}.Logs`)) {
          logchannel = channel.guild.channels.cache.get(db.get(`${channel.guild.id}.Logs`))
        } else {
          logchannel = channel.guild.channels.cache.find((ch) => ch.name === logs)
        }

        let channelnuke = channel.guild.channels.cache.get(channel.id)
        if(!channelnuke) return;
        let posisi = channelnuke.position

        try {
          channelnuke.delete()
        } catch {

        }
        channelnuke.clone().then((channel2) => {
          try {
            channel2.setPosition(posisi)
          } catch {

          }
          const renew2 = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiValidé} ${lang.NukeRecreated}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `);
          channel2.send(renew2)
        })

        if (db.get(`${channel.guild.id}.sanction`) === undefined || db.get(`${channel.guild.id}.sanction`) === null) {
          db.set(`${channel.guild.id}.sanction`, `ban`)
        }

        if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
        if (db.get(`${channel.guild.id}.sanction`) === 'ban') {
          try {
            channel.guild.members.ban(executor, {
              reason: 'Anti-Webhook',
            });
          } catch (error) {
            return;
          }
        }

        if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
        if (db.get(`${channel.guild.id}.sanction`) === 'kick') {
          try {
            channel.guild.member(executor).kick('Anti-Webhook')
          } catch (error) {
            return;
          }
        }

        if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
        if (db.get(`${channel.guild.id}.sanction`) === 'derank') {
          try {
            member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
          } catch (error) {
            return;
          }
        }

        const embed = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.Antiwebhook} <@${executor.id}>. \n ${lang.Antiwebhook1} ${db.get(`${channel.guild.id}.sanction`)} ${lang.Antiwebhook2}`)
          .setTimestamp()
          .setFooter(`${client.user.username} `);
        if (!logchannel) return
        try {
          logchannel.send(embed);
        } catch (error) {
          return;
        }
      }
    }
  });
};