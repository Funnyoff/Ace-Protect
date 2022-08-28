const db = require('quick.db');
const {
   blue,
  emojiAttention,
  prefix
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('message', async (message) => {

    if(!message) return;
    if(!message.guild) return;
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return

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
    if(!message.guild.me.hasPermission("SEND_MESSAGES")) return
    if (message.mentions.members && message.mentions.members.first()) {
      if (message.mentions.members.first().id === client.user.id) {
        let prefixbot = db.get(`${message.guild.id}.prefix`)
        if (prefixbot === null || prefixbot === undefined) {
          prefixbot = prefix
        }
        message.lineReply(`${lang.tag} ${message.author} ${lang.tag2} \`${prefixbot}\``)
      }
    }
  });
};