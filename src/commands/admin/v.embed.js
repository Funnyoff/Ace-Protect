/* eslint-disable no-undef */
const {
    MessageEmbed,
} = require('discord.js');
const {
    blue,
    emojiAttention,
    emojiWait
} = require('../../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'embed',
    aliases: ['embed', 'embedbuilder'],
    description: 'création d\'embed intéractif',
    usage: 'embed',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *embed* sur |${message.guild.name}|`)
        const permsrequired = [
            'SEND_MESSAGES',
            'MANAGE_MESSAGES',
        ]

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const NoPerms = new MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.permsAdmin}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(NoPerms);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission(permsrequired)) return message.channel.send(embedbotPerms)

        const filter = m => m.author.id == message.author.id

        const filtertitle = (m) => {
            if (m.author.id !== message.author.id) return false;
            if (m.content.length >= 256) {
                try {
                    m.channel.bulkDelete(2)
                } catch {

                }
                m.channel.send(`${lang.EmbedTitleTooLength}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 5000,
                        })
                    } catch {

                    }
                });
                return false;
            }
            return true;
        }

        const filterdescription = (m) => {
            if (m.author.id !== message.author.id) return false;
            if (m.content.length >= 2047) {
                try {
                    m.channel.bulkDelete(2)
                } catch {

                }
                m.channel.send(`${lang.EmbedDescriptionTooLength}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 5000,
                        })
                    } catch {

                    }
                });
                return false;
            }
            return true;
        }

        const filterfooter = (m) => {
            if (m.author.id !== message.author.id) return false;
            if (m.content.length >= 2048) {
                try {
                    m.channel.bulkDelete(2)
                } catch {

                }
                m.channel.send(`${lang.EmbedFooterTooLength}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 5000,
                        })
                    } catch {

                    }
                });
                return false;
            }
            return true;
        }

        const filterauthorname = (m) => {
            if (m.author.id !== message.author.id) return false;
            if (m.content.length >= 256) {
                try {
                    m.channel.bulkDelete(2)
                } catch {

                }
                m.channel.send(`${lang.EmbedAuthorTooLength}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 5000,
                        })
                    } catch {

                    }
                });
                return false;
            }
            return true;
        }

        const collector = message.channel.createMessageCollector(filter, {
            max: 1,
            time: 15000
        });

        let debut = 0;
        let envoyer;

        const embedwait = new MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.loading} ${lang.EmbedWaitEmoji}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const embedB = new MessageEmbed()
            .setColor(color)
            .setTitle('** Embed builder**')
            .addField('**👤**', `• *${lang.EmbedEditAuthor}*`, true)
            .addField('**✏️**', `• *${lang.EmbedEditTitle}*`, true)
            .addField('**📜**', `• *${lang.EmbedEditDescription}*`, true)
            .addField('**🎨**', `• *${lang.EmbedEditColor}*`, true)
            .addField('**🗺️**', `• *${lang.EmbedEditThumbnail}*`, true)
            .addField('**🖼️**', `• *${lang.EmbedEditImage}*`, true)
            .addField('**📌**', `• *${lang.EmbedEditField}*`, true)
            .addField('**👟**', `• *${lang.EmbedEditFooter}*`, true)
            .addField('**⏱️**', `• *${lang.EmbedEditTimestamp}*`, true)
            .addField('**📥**', `• *${lang.EmbedEditCopy}*`, true)
            .addField('**👁️**', `• *${lang.EmbedEditApercu}*`, true)
            .addField('**❌**', `• *${lang.EmbedEditCancel}*`, true)
            .addField('**✉️**', `• *${lang.EmbedEditSend}*`, true)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const msg = await message.channel.send(embedwait)
        await msg.react('👤');
        await sleep(250)
        await msg.react('✏️');
        await sleep(250)
        await msg.react('📜');
        await sleep(250)
        await msg.react('🎨');
        await sleep(250)
        await msg.react('🗺️');
        await sleep(250)
        await msg.react('🖼️');
        await sleep(250)
        await msg.react('📌');
        await sleep(250)
        await msg.react('👟');
        await sleep(250)
        await msg.react('⏱️');
        await sleep(250)
        await msg.react('📥');
        await sleep(250)
        await msg.react('👁️');
        await sleep(250)
        await msg.react('❌');
        await sleep(250)
        await msg.react('✉️');

        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        try {
            await msg.edit(embedB)
        } catch {

        }

        let editEmbed = {
            author: {

            },
            image: {

            },
            footer: {

            },
            thumbnail: {

            },
            description: '­'
        }
        const edit = await message.channel.send({
            embed: editEmbed
        })

        const filter1 = (reaction, user) => {
            return ['👤', '✏️', '📜', '🎨', '🗺️', '🖼️', '📌', '👟', '⏱️', '📥', '👁️', '❌', '✉️'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector1 = msg.createReactionCollector(filter1, {
            time: 960000
        });

        collector1.on('collect', async (reaction, user) => {

            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.id == msg.id) {

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// AUTEUR ////////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === "📥") {
                    await reaction.users.remove(user.id)
                    let question = await message.channel.send(`${lang.EmbedQuestionCopy}`)
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (collected) => {
                        let channelID = collected.first().content.replace(/[<#>]/g, '')
                        const channel = message.guild.channels.cache.get(channelID)
                        if (!channel) {
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            message.channel.send(`${lang.EmbedErrorChannelCopy}`).then((mssg) => {
                                try {
                                    mssg.delete({
                                        timeout: 5000,
                                    })
                                } catch {

                                }
                            });
                            return false;
                        }

                        let question1 = await message.channel.send(`${lang.EmbedQuestionCopyMessage}`)

                        message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 120000,
                                errors: ['time']
                            })
                            .then(async (collected) => {
                                let copyembed;
                                try {
                                    copyembed = await channel.messages.fetch(collected.first().content)
                                } catch {
                                    try {
                                        message.channel.bulkDelete(4)
                                    } catch {

                                    }
                                    message.channel.send(`${lang.EmbedErrorCopyMessage}`).then((mssg) => {
                                        try {
                                            mssg.delete({
                                                timeout: 5000,
                                            })
                                        } catch {

                                        }
                                    });
                                    return false;
                                }
                                if (!copyembed) {
                                    try {
                                        message.channel.bulkDelete(4)
                                    } catch {

                                    }
                                    message.channel.send(`${lang.EmbedErrorCopyMessage}`).then((mssg) => {
                                        try {
                                            mssg.delete({
                                                timeout: 5000,
                                            })
                                        } catch {

                                        }
                                    });
                                    return false;
                                }
                                if (copyembed.partial) {
                                    try {
                                        await copyembed.fetch()
                                    } catch {
                                        return
                                    }
                                }

                                editEmbed = copyembed.embeds[0].toJSON();
                                try {
                                    edit.edit({
                                        embed: copyembed.embeds[0].toJSON()
                                    })
                                } catch {

                                }
                                try {
                                    message.channel.bulkDelete(4)
                                } catch {

                                }
                            })

                    }).catch(async (err) => {
                        message.channel.send(`${lang.EmbedErrorCopy}`).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        })
                    })
                }

                if (reaction.emoji.name === '👤') {
                    await reaction.users.remove(user.id)
                    let question = await message.channel.send(`${lang.EmbedAuthorQuestion1}`)

                    message.channel.awaitMessages(filterauthorname, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(async (collected) => {
                            editEmbed.author.name = collected.first().content
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }

                            question = await message.channel.send(`${lang.EmbedAuthorQuestion2}`)

                            message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 120000,
                                    errors: ['time']
                                })
                                .then(async (collected) => {
                                    if (!/(http|https|www):\/\/[^"]+?\.(com|fr|gouv|gift|org)/.test(collected.first().content)) {
                                        try {
                                            collected.first().channel.bulkDelete(4)
                                        } catch {

                                        }
                                        message.channel.send(`${lang.EmbedAuthorErrorLink}`).then((mssg) => {
                                            try {
                                                mssg.delete({
                                                    timeout: 5000,
                                                })
                                            } catch {

                                            }
                                        })
                                        return false;
                                    }
                                    editEmbed.author.url = collected.first().content
                                    try {
                                        edit.edit({
                                            embed: editEmbed
                                        })
                                    } catch {

                                    }

                                    question = await message.channel.send(`${lang.EmbedAuthorQuestion3}`)

                                    message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 120000,
                                            errors: ['time']
                                        })
                                        .then(async (collected) => {
                                            if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webp)/.test(collected.first().content)) {
                                                try {
                                                    collected.first().channel.bulkDelete(6)
                                                } catch {

                                                }
                                                message.channel.send(`${lang.EmbedAuthorErrorImage}`).then((mssg) => {
                                                    try {
                                                        mssg.delete({
                                                            timeout: 5000,
                                                        })
                                                    } catch {

                                                    }
                                                })
                                                return false;
                                            }
                                            try {
                                                message.channel.bulkDelete(6)
                                            } catch {

                                            }
                                            editEmbed.author.icon_url = collected.first().content
                                            try {
                                                edit.edit({
                                                    embed: editEmbed
                                                })
                                            } catch {

                                            }
                                        })
                                        .catch();
                                })
                                .catch();

                        }).catch()
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// TITRE /////////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '✏️') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedTitleQuestion}`)

                    message.channel.awaitMessages(filtertitle, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            editEmbed.title = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }
                        })
                        .catch();
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// DESCRIPTION ///////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '📜') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedDescriptionQuestion}`)

                    message.channel.awaitMessages(filterdescription, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            editEmbed.description = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }
                        })
                        .catch();

                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// COULEUR ///////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '🎨') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedColorQuestion}`)

                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            editEmbed.color = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }
                        })
                        .catch();

                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// THUMBNAIL /////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '🗺️') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedThumbnailQuestion}`)

                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webp)/.test(collected.first().content)) {
                                try {
                                    collected.first().channel.bulkDelete(2)
                                } catch {

                                }
                                message.channel.send(`${lang.EmbedThumbnailErrorImage}`).then((mssg) => {
                                    try {
                                        mssg.delete({
                                            timeout: 5000,
                                        })
                                    } catch {

                                    }
                                });
                                return false;
                            }
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            editEmbed.thumbnail.url = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }
                        })
                        .catch();

                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// IMAGE /////////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '🖼️') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedImageQuestion}`)

                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webp)/.test(collected.first().content)) {
                                try {
                                    collected.first().channel.bulkDelete(2)
                                } catch {

                                }
                                message.channel.send(`${lang.EmbedImageErrorImage}`).then((mssg) => {
                                    try {
                                        mssg.delete({
                                            timeout: 5000,
                                        })
                                    } catch {

                                    }
                                });
                                return false;
                            }
                            try {
                                message.channel.bulkDelete(2)
                            } catch {

                            }
                            editEmbed.image.url = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }
                        })
                        .catch();
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// FIELD /////////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '📌') {
                    await reaction.users.remove(user.id)
                    if (debut === 0) editEmbed.fields = [];
                    let field = await message.channel.send(`${lang.EmbedFieldQuestion}`)

                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(async (collected) => {
                            const name = collected.first().content;

                            field = await message.channel.send(`${lang.EmbedFieldQuestionContenu}`)
                            message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 120000,
                                    errors: ['time']
                                })
                                .then(async (collected) => {
                                    const value = collected.first().content

                                    field = await message.channel.send(`${lang.EmbedFieldQuestionTrueOrFalse}`)

                                    message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 120000,
                                            errors: ['time']
                                        })
                                        .then(async (collected) => {
                                            try {
                                                message.channel.bulkDelete(6)
                                            } catch {

                                            }
                                            editEmbed.fields.push({
                                                name: name,
                                                value: value,
                                                inline: collected.first().content.split(" ").some(mots => ["oui", "yes", "o", "y"].includes(mots)) ? true : false
                                            })
                                            try {
                                                edit.edit({
                                                    embed: editEmbed
                                                })
                                            } catch {

                                            }
                                            debut++
                                        })

                                })
                                .catch();
                        })
                        .catch();

                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// FOOTER ///////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '👟') {
                    await reaction.users.remove(user.id)
                    let footer = await message.channel.send(`${lang.EmbedFooterQuestionText}`)

                    message.channel.awaitMessages(filterfooter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(async (collected) => {
                            editEmbed.footer.text = collected.first().content;
                            try {
                                edit.edit({
                                    embed: editEmbed
                                })
                            } catch {

                            }

                            footer = await message.channel.send(`${lang.EmbedFooterQuestionImage}`)

                            message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 120000,
                                    errors: ['time']
                                })
                                .then(async (collected) => {
                                    if (!/(http|https|www):\/\/[^"]+?\.(jpg|png|gif|webpp)/.test(collected.first().content)) {
                                        try {
                                            collected.first().channel.bulkDelete(4)
                                        } catch {

                                        }
                                        message.channel.send(`${lang.EmbedFooterErrorImage}`).then((mssg) => {
                                            try {
                                                mssg.delete({
                                                    timeout: 5000,
                                                })
                                            } catch {

                                            }
                                        });
                                        return false;
                                    }
                                    try {
                                        message.channel.bulkDelete(4)
                                    } catch {}
                                    editEmbed.footer.icon_url = collected.first().content
                                    try {
                                        edit.edit({
                                            embed: editEmbed
                                        })
                                    } catch {

                                    }
                                })
                                .catch();
                        })
                        .catch();
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// TIMESTAMP /////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '⏱️') {
                    await reaction.users.remove(user.id)
                    editEmbed.timestamp = new Date()
                    try {
                        edit.edit({
                            embed: editEmbed
                        })
                    } catch {

                    }
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// PREVIEW ///////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '👁️') {
                    await reaction.users.remove(user.id)
                    message.channel.send({
                        embed: editEmbed
                    })
                }


                ///////////////////////////////////////////////////////////////////
                ////////////////////////// ANNULER ///////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '❌') {
                    await reaction.users.remove(user.id)
                    envoyer = 'annuler'
                    try {
                        edit.delete()
                    } catch {

                    }
                    try {
                        msg.delete().then(
                            message.channel.send(`${lang.EmbedCancel}`).then((mssg) => {
                                try {
                                    mssg.delete({
                                        timeout: 5000,
                                    })
                                } catch {

                                }
                            }))
                    } catch {

                    }

                    return false;
                }

                ///////////////////////////////////////////////////////////////////
                ////////////////////////// ENVOIE ////////////////////////////////
                /////////////////////////////////////////////////////////////////

                if (reaction.emoji.name === '✉️') {
                    await reaction.users.remove(user.id)
                    message.channel.send(`${lang.EmbedSend}`)

                    message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                            errors: ['time']
                        })
                        .then(collected => {
                            let channelID = collected.first().content.replace(/[<>#]/g, '');
                            const channel = message.guild.channels.cache.get(channelID);
                            if (!channel) return message.channel.send(`${lang.EmbedSendError} : ${channelID}`)
                            channel.send({
                                embed: editEmbed
                            })
                            envoyer = 'envoyer';
                            try {
                                message.channel.bulkDelete(2).then(
                                    collector1.stop()
                                )
                            } catch {}

                        })
                        .catch();

                }

            }
        })
        collector1.on('end', collected => {
            if (envoyer === 'annuler') {
                return
            }
            if (envoyer === 'envoyer') {
                return message.channel.send(`${lang.EmbedSended}`)
            } else {
                return message.channel.send(`${lang.EmbedSendedErrorTime}`)
            }

        })
    },
};