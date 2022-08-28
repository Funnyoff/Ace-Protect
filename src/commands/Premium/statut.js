const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');
const Discord = require('discord.js');
const {
    emojiAttention,
    blue,
    owner,
    emojiValidé,
    emojiWait,
} = require('../../../config.json');
const emojis = require('../../../emojis.json')

module.exports = {
    name: 'statut',
    aliases: ['statut'],
    description: 'Choisis le message en statut et l\'activité du bot',
    usage: 'statut + <statut>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *statut* sur |${message.guild.name}|`)
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        } 

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
        }

        if (message.author.id === owner) {
            const filterreact = m => m.author.id == message.author.id

            const embedwait = new MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.loading} ${lang.EmbedWaitEmoji}`)
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

            const embed = new Discord.MessageEmbed()
                .addField('**1️⃣**', `• ${lang.StatutReact1} \`${db.get(`${client.user.id}.statut`)}\``, false)
                .addField('**2️⃣**', `• ${lang.StatutReact2} \`${db.get(`${client.user.id}.activityType`)}\``, false)
                .addField('**❌**', `• ${lang.StatutReact3}`, false)
                .setTimestamp()
                .setColor(color)
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            const msg = await message.channel.send(embedwait)
            await msg.react('1️⃣');
            await sleep(250)
            await msg.react('2️⃣');
            await sleep(250)
            await msg.react('❌');

            function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            await msg.edit(embed)

            const filter = (reaction, user) => {
                return ['1️⃣', '2️⃣', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            const collector1 = msg.createReactionCollector(filter, {
                time: 960000
            });

            collector1.on('collect', async (reaction, user) => {

                if (user.bot) return;
                if (!reaction.message.guild) return;
                if (reaction.message.id == msg.id) {

                    if (reaction.emoji.name === '1️⃣') {
                        await reaction.users.remove(user.id)
                        message.channel.send(`${lang.StatutQuestionMessage}`)

                        message.channel.awaitMessages(filterreact, {
                                max: 1,
                                time: 120000,
                                errors: ['time']
                            })
                            .then(collected => {
                                if (db.get(`${client.user.id}.statutTime`) === true) {
                                    message.channel.bulkDelete(2)
                                    message.channel.send(`${lang.SetUsernameFiveHour}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    return false;
                                }
                                if (collected.first().content.length > 20) {
                                    message.channel.bulkDelete(2)
                                    message.channel.send(`${lang.StatutMessageLength}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    return false;
                                }
                                db.set(`${client.user.id}.statut`, collected.first().content)
                                db.set(`${client.user.id}.statutTime`, true)

                                message.channel.bulkDelete(2)
                                message.channel.send(`${lang.StatutMessageFinal1} \`${collected.first().content}\`, ${lang.StatutMessageFinal2}`).then((mssg) => mssg.delete({
                                    timeout: 5000,
                                }));
                                client.user.setPresence({
                                    activity: {
                                        name: db.get(`${client.user.id}.statut`),
                                        type: db.get(`${client.user.id}.activityType`),
                                        url: 'https://www.twitch.tv/mtsdev'
                                    },
                                })
                                setTimeout(() => {
                                    db.set(`${client.user.id}.statutTime`, false)
                                }, 18000000);
                            })
                            .catch();
                    }

                    if (reaction.emoji.name === '2️⃣') {
                        await reaction.users.remove(user.id)

                        const embedwaitv2 = new MessageEmbed()
                            .setColor(color)
                            .setDescription(`${emojis.loading} ${lang.EmbedWaitEmoji}`)
                            .setTimestamp()
                            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

                        const embedv2 = new Discord.MessageEmbed()
                            .addField(`**${emojis.casque}**`, `• ${lang.StatutEmbed1}`, false)
                            .addField('**📺**', `• ${lang.StatutEmbed2}`, false)
                            .addField('**🎮**', `• ${lang.StatutEmbed3}`, false)
                            .addField(`**${emojis.stream}**`, `• ${lang.StatutEmbed4}`, false)
                            .setTimestamp()
                            .setColor(color)
                            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
                        const msgg = await message.channel.send(embedwaitv2)
                        await msgg.react(`${emojis.casque}`);
                        await sleep(250)
                        await msgg.react('📺');
                        await sleep(250)
                        await msgg.react('🎮');
                        await sleep(250)
                        await msgg.react(`${emojis.stream}`);

                        function sleep(ms) {
                            return new Promise((resolve) => {
                                setTimeout(resolve, ms);
                            });
                        }
                        await msgg.edit(embedv2)

                        const filter2 = (reaction, user) => {
                            return (['892155151249465354', '892155629450432582'].includes(reaction.emoji.id) || ['📺', '🎮'].includes(reaction.emoji.name)) && user.id === message.author.id;
                        };

                        const collector = msgg.createReactionCollector(filter2, {
                            time: 960000
                        });

                        collector.on('collect', async (reaction, user) => {

                            if (user.bot) return;
                            if (!reaction.message.guild) return;
                            if (reaction.message.id == msgg.id) {

                                if (reaction.emoji.id === '892155151249465354') { // Listening
                                    await reaction.users.remove(user.id)
                                    if (db.get(`${client.user.id}.activityTypeTime`) === true) {
                                        message.channel.send(`${lang.SetUsernameFiveHour}`).then((mssg) => mssg.delete({
                                            timeout: 5000,
                                        }));
                                        return false;
                                    }
                                    db.set(`${client.user.id}.activityType`, `LISTENING`)
                                    db.set(`${client.user.id}.activityTypeTime`, true)
                                    msgg.delete()
                                    message.channel.send(`${lang.StatutEmbedFinalMessage1} \`${db.get(`${client.user.id}.activityType`)}\`, ${lang.StatutEmbedFinalMessage2}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    client.user.setPresence({
                                        activity: {
                                            name: db.get(`${client.user.id}.statut`),
                                            type: db.get(`${client.user.id}.activityType`),
                                            url: 'https://www.twitch.tv/wez'
                                        },
                                    })
                                    setTimeout(() => {
                                        db.set(`${client.user.id}.activityTypeTime`, false)
                                    }, 18000000);

                                }
                                if (reaction.emoji.name === '📺') { // Watching
                                    await reaction.users.remove(user.id)
                                    if (db.get(`${client.user.id}.activityTypeTime`) === true) {
                                        message.channel.send(`${lang.SetUsernameFiveHour}`).then((mssg) => mssg.delete({
                                            timeout: 5000,
                                        }));
                                        return false;
                                    }
                                    db.set(`${client.user.id}.activityType`, `WATCHING`)
                                    db.set(`${client.user.id}.activityTypeTime`, true)
                                    msgg.delete()
                                    message.channel.send(`${lang.StatutEmbedFinalMessage1} \`${db.get(`${client.user.id}.activityType`)}\`, ${lang.StatutEmbedFinalMessage2}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    client.user.setPresence({
                                        activity: {
                                            name: db.get(`${client.user.id}.statut`),
                                            type: db.get(`${client.user.id}.activityType`),
                                            url: 'https://www.twitch.tv/wez'
                                        },
                                    })
                                    setTimeout(() => {
                                        db.set(`${client.user.id}.activityTypeTime`, false)
                                    }, 18000000);
                                }

                                if (reaction.emoji.name === '🎮') { // PLAYING
                                    await reaction.users.remove(user.id)
                                    if (db.get(`${client.user.id}.activityTypeTime`) === true) {
                                        message.channel.send(`${lang.SetUsernameFiveHour}`).then((mssg) => mssg.delete({
                                            timeout: 5000,
                                        }));
                                        return false;
                                    }
                                    db.set(`${client.user.id}.activityType`, `PLAYING`)
                                    db.set(`${client.user.id}.activityTypeTime`, true)
                                    msgg.delete()
                                    message.channel.send(`${lang.StatutEmbedFinalMessage1} \`${db.get(`${client.user.id}.activityType`)}\`, ${lang.StatutEmbedFinalMessage2}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    client.user.setPresence({
                                        activity: {
                                            name: db.get(`${client.user.id}.statut`),
                                            type: db.get(`${client.user.id}.activityType`),
                                            url: 'https://www.twitch.tv/wez'
                                        },
                                    })
                                    setTimeout(() => {
                                        db.set(`${client.user.id}.activityTypeTime`, false)
                                    }, 18000000);
                                }

                                if (reaction.emoji.id === '892155629450432582') { // Streaming
                                    await reaction.users.remove(user.id)
                                    if (db.get(`${client.user.id}.activityTypeTime`) === true) {
                                        message.channel.send(`${lang.SetUsernameFiveHour}`).then((mssg) => mssg.delete({
                                            timeout: 5000,
                                        }));
                                        return false;
                                    }
                                    db.set(`${client.user.id}.activityType`, `STREAMING`)
                                    db.set(`${client.user.id}.activityTypeTime`, true)
                                    msgg.delete()
                                    message.channel.send(`${lang.StatutEmbedFinalMessage1} \`${db.get(`${client.user.id}.activityType`)}\`, ${lang.StatutEmbedFinalMessage2}`).then((mssg) => mssg.delete({
                                        timeout: 5000,
                                    }));
                                    client.user.setPresence({
                                        activity: {
                                            name: db.get(`${client.user.id}.statut`),
                                            type: db.get(`${client.user.id}.activityType`),
                                            url: 'https://www.twitch.tv/wez'
                                        },
                                    })
                                    setTimeout(() => {
                                        db.set(`${client.user.id}.activityTypeTime`, false)
                                    }, 18000000);

                                }
                            }

                        })
                    }

                    if (reaction.emoji.name === '❌') {
                        await reaction.users.remove(user.id)
                        return msg.delete().then(
                            message.channel.send(`${lang.StatutCancel}`).then((mssg) => mssg.delete({
                                timeout: 5000,
                            })))
                    }
                }
            })
        } else {
            return message.lineReply(WLAlready);
        }

    }
}