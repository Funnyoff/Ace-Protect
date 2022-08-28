const Discord = require("discord.js");
const {
    blue,
    emojiValidé,
    emojiAttention,
    emojiVocal,
    emojiMuted,
    emojiDeaf
} = require('../../../config.json')
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'vocal',
    aliases: ['voc', 'vc'],
    description: 'Affiche le nombre de personne en vocal sur le discord',
    usage: 'vocal',
    perms: `\`SEND_MESSAGES\``,
    
    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *vocal* sur |${message.guild.name}|`)
    var connectedCount = 0;
            var streamingCount = 0;
            var mutedCount = 0;
            var mutedMic = 0;
            var cameraCount =0;
            const channels = message.guild.channels.cache.filter(c => c.type === 'voice');
            channels.forEach(c => {
                connectedCount += c.members.size;
                c.members.forEach(m => {
                    if(m.voice.streaming) streamingCount++;
                    if(m.voice.selfDeaf || m.voice.serverDeaf) mutedCount++;            
                    if(m.voice.selfMute || m.voice.serverMute) mutedMic++;
                    if(m.voice.selfVideo) cameraCount++;
                })
            })
       
        const helpEmbed = new Discord.MessageEmbed()
      .setColor('#f00000')
      .setTitle(`${message.guild.name}`)
     .addField('Statistiques vocal',`👥 Membres: **${message.guild.memberCount}**  \n🔊 Vocal: **${connectedCount}** \n🖥️ Stream: **${streamingCount}** \n🔇 Muet: **${mutedMic}** \n🎧 Sourdine: **${mutedCount}**\n🎥 Caméra: **${cameraCount}** `)
    message.channel.send(helpEmbed)
}
}