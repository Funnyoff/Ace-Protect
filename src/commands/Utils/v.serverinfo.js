const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const Discord = require('discord.js');
const emojis = require('../../../emojis.json')
const db = require('quick.db');

module.exports = {
  name: 'serverinfo',
  description: 'informations sur le serveur discord',
  aliases: ['serverinfo', 'si'],
  usage: 'serverinfo',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang) {
    console.log(`${message.author.tag}, utilise la commande *serverinfo* sur |${message.guild.name}|`)
    let color;
    if (db.get(`${message.guild.id}.Color`)) {
      color = db.get(`${message.guild.id}.Color`)
    } else {
      color = blue;
    }

    let region;
    switch (message.guild.region) {
      case 'europe':
        region = '🇪🇺 Europe';
        break;
      case 'us-east':
        region = '🇺🇸 us-east';
        break;
      case 'us-west':
        region = '🇺🇸 us-west';
        break;
      case 'us-south':
        region = '🇺🇸 us-south';
        break;
      case 'us-central':
        region = '🇺🇸 us-central';
        break;
      case 'eu-central':
        region = '🇪🇺 Europe';
        break;
      case 'singapore':
        region = ':flag_sg: Singapore';
        break;
      case 'sydney':
        region = ':flag_au: Sydney';
        break;
      case 'us-west':
        region = ':flag_us: U.S. West';
        break;
      case 'southafrica':
        region = ':flag_za:  South Africa';
        break;
      case 'eu-west':
        region = ':flag_eu: Western Europe';
        break;
      case 'russia':
        region = ':flag_ru: Russia';
        break;
      case 'hongkong':
        region = ':flag_hk: Hong Kong';
        break;
    }

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({
        dynamic: true,
      }))
      .setColor(color)
      .setTitle(`${message.guild.name} ${lang.ServerinfoEmbedTitle}`)
      .addFields({
        name: `${emojis.couronne} » Owner: `,
        value: `<@${message.guild.owner.user.id}>`,
        inline: true,
      }, {
        name: `${emojis.etoilechelou} » ${lang.ServerinfoMembers}: `,
        value: `${lang.ServerinfoThereIs} **${message.guild.memberCount}** ${lang.ServerinfoMembers}!`,
        inline: true,
      }, {
        name: `${emojis.bot} » Bots: `,
        value: `${lang.ServerinfoThereIs} **${message.guild.members.cache.filter((m) => m.user.bot).size}** bots!`,
        inline: true,
      }, {
        name: `:date: » ${lang.ServerinfoDate}: `,
        value: message.guild.createdAt.toLocaleDateString('en-us'),
        inline: true,
      }, {
        name: `:bookmark_tabs: » ${lang.ServerinfoNBRoles}: `,
        value: `${lang.ServerinfoThereIs} **${message.guild.roles.cache.size}** ${lang.ServerinfoRole}.`,
        inline: true,
      }, {
        name: `${emojis.monde} » Region: `,
        value: region,
        inline: true,
      }, {
        name: `${emojis.partner} » ${lang.ServerinfoPartner1}: `,
        value: message.guild.verified ? `${lang.ServerinfoPartner} ${emojis.partner} !` : `${lang.ServerinfoNoPartner}`,
        inline: true,
      }, {
        name: `${emojis.boost} » Boosters: `,
        value: message.guild.premiumSubscriptionCount >= 1 ? `${lang.ServerinfoThereIs} **${message.guild.premiumSubscriptionCount}** Boosts ${lang.ServerinfoBoost}.` : `${lang.ServerinfoNoBoost}`,
        inline: true,
      }, {
        name: `${emojis.emoji} » Emojis: `,
        value: message.guild.emojis.cache.size >= 1 ? `${lang.ServerinfoThereIs} **${message.guild.emojis.cache.size}** emojis!` : `${lang.ServerinfoNoEmoji}`,
        inline: true,
      })
     // .addField(`${emojis.image} » Banner`, `${message.guild.banner ? `[Banner](${message.guild.bannerURL({size: 1024})})` : "Aucune"}`)
      if(message.guild.splash) embed.setImage(url = message.guild.splashURL({size: 1024}))
      .setFooter(message.guild.name, message.guild.iconURL({
        dynamic: true,
      }))
      .setTimestamp();
    await message.channel.send(embed);
  },
};
//${message.guild.banner ? `[lien](${message.guild.bannerURL({size: 1024})})` : "Aucune"}