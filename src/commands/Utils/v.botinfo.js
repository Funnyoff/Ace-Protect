/* eslint-disable no-undef */
const Discord = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');
const moment = require('moment');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
const db = require('quick.db');

module.exports = {
  name: 'botinfo',
  aliases: ['botinfo', 'bi'],
  description: "Permet d'avoir les informations sur le bot discord",
  usage: 'botinfo',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *botinfo* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    const {
      version,
    } = require('discord.js');

    cpuStat.usagePercent((err, percent) => {
      if (err) {
        return;
      }
      moment.locale(lang.EmojiAddedNom === 'Nom' ? "fr": "en")
      const embed = new Discord.MessageEmbed()
        .setTitle(`**» Bot Information ✦**  **(${client.user.username})**`)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(color)
        .addField(`🤖 » ${lang.botinfoCreator} `, 'Beta#1111', true)
        .addField(`📆 » ${lang.botinfoDate} `, `${moment(client.user.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, true)
        .addField(`⏲ » ${lang.botinfoOnline} `, `${Math.round(client.uptime / (1000 * 60 * 60 * 24)) % 30} Jours, ${Math.round(client.uptime/ (1000 * 60 * 60))} h, ${Math.round(client.uptime / (1000 * 60)) % 60} min, et ${Math.round(client.uptime / 1000) % 60} sec`, true)
        .addField(`🌐 » ${lang.botinfoServers} `, `${client.guilds.cache.size}`, true)
        .addField(`💭 » ${lang.botinfoDiscordJS} `, `v${version}`, true)
        .addField(`💭 » Node `, `${process.version}`, true)
        .addField(`💾 » ${lang.botinfoRAM} `, `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``, true)
        .addField(`💻 » CPU `, `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
        .addField(`🔋 » ${lang.botinfoCPU} `, `\`${percent.toFixed(2)}%\``, true)
        .addField(`📊 » ${lang.botinfoArchitecture} `, `\`${os.arch()}\``, true)
        .addField(`📈 » ${lang.botinfoPlateforme} `, `\`\`${os.platform()}\`\``, true)
        .addField(`📋 » Language `, '**`JavaScript`**')
        .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

      message.channel.send(embed);
    });
  },
};