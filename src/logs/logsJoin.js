const db = require('quick.db');
const Discord = require('discord.js');
const moment = require('moment');
const {
   blue,
  logs,
  networkVert,
  emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {

    if (!member) return;
    if (!member.guild) return;

    let color;
    if (db.get(`${member.guild.id}.Color`)) {
      color = db.get(`${member.guild.id}.Color`)
    } else {
       color = "2f3136";
    }

    let language;
    if (db.get(`${member.guild.id}.language`) === undefined || db.get(`${member.guild.id}.language`) === null) {
      await db.set(`${member.guild.id}.language`, "fr")
      language = db.get(`${member.guild.id}.language`)
    }
    language = db.get(`${member.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!member.guild.me.hasPermission('ADMINISTRATOR')) return
    let choice3 = db.get(`${member.guild.id}.logsJoin`);

    if (choice3 == undefined || choice3 == null) {
      choice3 = true;
    }

    if (choice3 === true) {
      let logchannel;
      if (db.get(`${member.guild.id}.Logs`)) {
        logchannel = member.guild.channels.cache.get(db.get(`${member.guild.id}.Logs`))
      } else {
        logchannel = member.guild.channels.cache.find((ch) => ch.name === logs)
      }
      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${networkVert} **${member.user.tag}** (ID: ${member.id}) ${lang.logJoin} ` + moment(member.user.createdAt).format('DD/MM/YYYY HH:mm:ss'))
        .setTimestamp()
        .setFooter(`${client.user.username} `);
      if (!logchannel) return;
      try {
        logchannel.send(embed);
      } catch {}
    }
  });
};