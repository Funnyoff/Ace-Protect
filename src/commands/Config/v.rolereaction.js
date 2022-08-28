const Discord = require('discord.js');
const db = require('quick.db');
const {
    blue,
    logs,
    emojiAttention,
    owner,
    emojiON,
    emojiOFF,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'rolereaction',
    description: 'Cliquer sur un emoji afin d\'avoir un rôle',
    aliases: ['rolereact', 'rolereaction'],
    usage: 'rolereaction',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *rolereaction* sur |${message.guild.name}|`)
        let msg;
        let msgid;
        let reaction;
        let role;
        let cancel = false;

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLNoFind = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.RoleReactionErrorNoChannel}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const Nopresencestatutsoutien = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} ${lang.RoleReactionErrorNoRole}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const rolenotfound = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorRoleNotFound}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const rolemanaged = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorRoleManaged}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const roleprblm = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorRoleHighest}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.RoleReactionErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
            }
        }

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || db.get(`${message.guild.id}.Owners`).includes(message.author.id) || message.author.id === owner) {

            const filter = m => m.author.id == message.author.id
            message.channel.send(`${lang.RoleReactionQuestionChannel}`)
            await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                })
                .then(async (collected) => {
                    channelID = collected.first().content.replace(/[<>#]/g, '');

                    const channel = message.guild.channels.cache.get(channelID);
                    if (!channel) {
                        try {
                            message.channel.bulkDelete(2)
                        } catch {

                        }

                        message.channel.send(WLNoFind).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                    db.set(`${message.guild.id}.RoleMenuChannel`, channel.id)
                }).catch();

            if (cancel) return

            message.channel.send(`${lang.RoleReactionQuestionMessage}`)
            await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                })
                .then(async (collected) => {
                    msgid = collected.first().content
                    try {
                        msg = await message.guild.channels.cache.get(db.get(`${message.guild.id}.RoleMenuChannel`)).messages.fetch(msgid)
                    } catch (error) {
                        try {
                            message.channel.bulkDelete(4)
                        } catch {

                        }

                        message.channel.send(`${lang.RoleReactionErrorNoMessage}`).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                }).catch();

            if (cancel) return;

            message.channel.send(`${lang.RoleReactionQuestionReaction}`)
            await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                })
                .then(async (collected) => {
                    reaction = collected.first().content
                    let customemoji = Discord.Util.parseEmoji(reaction);
                    let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
                    var reactionRegex = [
                        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
                    ];
                    if (!emojicheck) {
                        if (!reaction.match(reactionRegex)) {
                            try {
                                message.channel.bulkDelete(6)
                            } catch {

                            }

                            message.channel.send(`${lang.RoleReactionErrorReaction}`).then((mssg) => {
                                try {
                                    mssg.delete({
                                        timeout: 5000,
                                    })
                                } catch {

                                }
                            });
                            cancel = true;
                            return false;
                        } else {
                            return
                        }
                    } else {
                        return
                    }

                }).catch();
            if (cancel) return;

            message.channel.send(`${lang.RoleReactionQuestionRole}`)
            await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                })
                .then(async (collected) => {

                    const roleRegex = /(<@&(\d{17,19})>)|(^\d{17,19}$)/g
                    if (!collected.first().content || !collected.first().content.match(roleRegex)) {
                        try {
                            collected.channel.bulkDelete(8)
                        } catch {

                        }

                        collected.channel.send(Nopresencestatutsoutien).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                    role = await message.guild.roles.fetch(collected.first().content.replace(/[<@&>]/g, ''))
                    if (role.managed) {
                        try {
                            message.channel.bulkDelete(8)
                        } catch {

                        }

                        message.channel.send(rolemanaged).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                    if (!role) {
                        try {
                            message.channel.bulkDelete(8)
                        } catch {

                        }

                        message.channel.send(rolenotfound).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                    if (role.position > message.guild.me.roles.highest.position) {
                        try {
                            message.channel.bulkDelete(8)
                        } catch {

                        }

                        message.channel.send(roleprblm).then((mssg) => {
                            try {
                                mssg.delete({
                                    timeout: 5000,
                                })
                            } catch {

                            }
                        });
                        cancel = true;
                        return false;
                    }
                    try {
                        message.channel.bulkDelete(8)
                    } catch {

                    }

                    await db.push(`${message.guild.id}.RoleMenu.${msgid}.roleReact`, {
                        role: collected.first().content.replace(/[<>!&@]/g, ''),
                        reaction: reaction
                    })
                    await db.delete(`${message.guild.id}.RoleMenuChannel`)
                    msg.react(reaction)
                    message.channel.send(`${lang.RoleReactionFinalMessage1} \`${msgid}\`, ${lang.RoleReactionFinalMessage2} ${reaction} ${lang.RoleReactionFinalMessage3} ${role}`).then((mssg) => {
                        try {
                            mssg.delete({
                                timeout: 5000,
                            })
                        } catch {

                        }
                    });
                    return true;
                })
            if (cancel) return;

        } else {
            message.channel.send(WLAlready)
        }
    }
}