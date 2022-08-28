const {
  MessageEmbed,
  MessageFlags,
} = require('discord.js');
const moment = require('moment');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo', 'ui'],
  description: "Envoie les informations sur l'utilisateur mentionné (ou vous)",
  usage: 'userinfo + <@user>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *userfinfo* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    let user;

    if (!args[0]) {
      user = message.member;
    } else {
      user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch((err) => message.channel.send(`${lang.UserinfoNoUser}`));

      if (!user) return message.channel.send(`${lang.UserinfoBadID}`);
    }

    if (!user) {
      return message.channel.send(`${lang.UserinfoNoUser}`);
    }

    // STATUT
   // const dnd = client.emojis.cache.find((emoji) => emoji.id === '892099207626903573'); // fait
   // const online = client.emojis.cache.find((emoji) => emoji.id === '892099162852691988'); // fait
   // const offline = client.emojis.cache.find((emoji) => emoji.id === '892099238102716436'); // fait
    //const inactif = client.emojis.cache.find((emoji) => emoji.id === '892099191638216745'); // fait

    const status = {
      online: `${emojis.online} ${lang.UserinfoStatutOnline}`,
      idle: `${emojis.idle} ${lang.UserinfoStatutIdle}`,
      dnd: `${emojis.dnd} ${lang.UserinfoStatutDND}`,
      offline: `${emojis.offline} ${lang.UserinfoStatutOffline}`,
    };

    // BOT
    const BOT = {
      false: `${emojis.no} ${lang.UserinfoNo}`,
      true: `${emojis.yes} ${lang.UserinfoYes}`,
    };

    // NOW BADGES
    let badges = await user.user.flags;
    badges = await badges.toArray();

    /* let arrayBadges = [];
        arrayBadges.forEach(badge => arrayBadges.push(BadgesAll[badge])) */

    const newbadges = [];
    badges.forEach((m) => {
      newbadges.push(m.replace('_', ' '));
    });

    //const staff = client.emojis.cache.find((emoji) => emoji.id === '797862214869712926'); // fait
    //const partner = client.emojis.cache.find((emoji) => emoji.id === '797858925667287050'); // fait
    //const eventHype = client.emojis.cache.find((emoji) => emoji.id === '797879670493282355'); // fait
    //const hunterlvl1 = client.emojis.cache.find((emoji) => emoji.id === '797879646040358922'); // fait
    //const bravery = client.emojis.cache.find((emoji) => emoji.id === '797879003021180988'); // fait
    //const brilliance = client.emojis.cache.find((emoji) => emoji.id === '797879029624864788'); // fait
    //const balance = client.emojis.cache.find((emoji) => emoji.id === '797879016312143873'); // fait
    //const supporter = client.emojis.cache.find((emoji) => emoji.id === '797858849792327702'); // fait
    //const hunterlvl2 = client.emojis.cache.find((emoji) => emoji.id === '797879659475238928'); // fait
    //const botverif = client.emojis.cache.find((emoji) => emoji.id === '797863426210005032'); // fait
    //const dev = client.emojis.cache.find((emoji) => emoji.id === '797862200499765358'); // fait



    const BadgesAll = {
      DISCORD_EMPLOYEE: `${emojis.staff}`,
      PARTNERED_SERVER_OWNER: `${emojis.partner2}`,
      HYPESQUAD_EVENTS: `${emojis.hypesquad}`,
      BUGHUNTER_LEVEL_1: `${emojis.bughunter}`,
      HOUSE_BRAVERY: `${emojis.bravery}`,
      HOUSE_BRILLIANCE: `${emojis.brilliance}`,
      HOUSE_BALANCE: `${emojis.brilliance}`,
      EARLY_SUPPORTER: `${emojis.early}`,
      BUGHUNTER_LEVEL_2: `${emojis.bughunter2}`,
      VERIFIED_BOT: `${emojis.dev}`,
      EARLY_VERIFIED_BOT_DEVELOPER: `${emojis.dev}`,
    };

    const arrayBadges = [];
    badges.forEach((badge) => arrayBadges.push(BadgesAll[badge]));

    const embed = new MessageEmbed()
      .setThumbnail(user.user.displayAvatarURL({
        dynamic: true,
      }));

    // EMBED COLOR BASED ON member
    embed.setColor(color);

    // OTHER STUFF
    embed.setAuthor(user.user.tag, user.user.displayAvatarURL({
      dynamic: true,
    }));

    const User = message.mentions.users.first() || message.member.user;
    const member = message.guild.members.cache.get(User.id);

    // CHECK IF USER HAVE NICKNAME
    if (user.nickname !== null) embed.addField(`📖 » ${lang.UserinfoNom}`, user.nickname);
    embed.addField(`${emojis.user} » Pseudo`, `${user.user.username}`, true)
      .addField(`${emojis.hashtag} » Hashtag `, `#${user.user.discriminator}`, true)
      .addField(`${emojis.id} » ID`, `\`${user.user.id}\``, false)
      .addField(`${emojis.badges} » Badges`, `${arrayBadges.length === 0 ? `${lang.UserinfoNoBadge}` : arrayBadges.join(' ')}`, true)
      .addField(`${emojis.bot} » Bot `, ` ${BOT[user.user.bot]}`, true)
      .addField(`${emojis.settings} » Status `, `${status[user.user.presence.status]}`, false)
      .addField(`🗓️ » ${lang.UserinfoJoinTime}`, moment(member.joinedAt).format('DD/MM/YYYY HH:mm:ss'), true)
      .addField(`📥 » ${lang.UserinfoAccountCreated}`, moment(User.createdAt).format('DD/MM/YYYY HH:mm:ss'), true)
      .setTimestamp()
      .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
    return message.channel.send(embed).catch((err) => message.channel.send(`Error : ${err}`));
  },
};
