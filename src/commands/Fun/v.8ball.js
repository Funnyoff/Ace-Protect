const Discord = require('discord.js');

const Img = new Discord.MessageAttachment('assets/img/boule.jpg');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
  name: '8ball',
  aliases: ['8ball'],
  description: 'Répond à vos questions !',
  usage: '8ball + <question>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {

    let color;
    if (db.get(`${message.guild.id}.Color`)) {
        color = db.get(`${message.guild.id}.Color`)
    } else {
        color = blue;
    }

    const question = message.content.slice(9);
    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

    if (!question) {
      return message.channel.send(`${lang.ballErrorNoQuestion}`);
    }

    const responses = [
      `${lang.ballReponse1}`,
      `${lang.ballReponse2}`,
      `${lang.ballReponse3}`,
      `${lang.ballReponse4}`,
      `${lang.ballReponse5}`,
      `${lang.ballReponse6}`,
      `${lang.ballReponse7}`,
      `${lang.ballReponse8}`,
      `${lang.ballReponse9}`,
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    const Embed = new Discord.MessageEmbed()
      .setTitle(`8Ball !`)
      .setDescription(`**__${lang.ballFinalResponse1} :__**\n ${question} \n**__${lang.ballFinalResponse2} :__**\n ${response} `)
      .setColor(color)
      .attachFiles(Img)
      .setThumbnail('attachment://boule.jpg')
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    message.channel.send(Embed);
  },
};