const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs').promises;
module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {

        if(!oldState) return;
        if(!newState) return;

        const permsrequired = [
            'SEND_MESSAGES',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
        ]
        let language;
        if (db.get(`${newState.guild.id}.language`) === undefined || db.get(`${newState.guild.id}.language`) === null) {
            await db.set(`${newState.guild.id}.language`, "fr")
            language = db.get(`${newState.guild.id}.language`)
        }
        language = db.get(`${newState.guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!oldState.guild.me.hasPermission(permsrequired)) return
        if (!newState.guild.me.hasPermission(permsrequired)) return
        if (newState.channel && newState.channel.id === db.get(`${newState.guild.id}.tempvoc.channel`)) {
            if (oldState.channel && oldState.channel.id === db.get(`${newState.guild.id}.users.${newState.member.id}.tempvoc`)) {
                const channelmove = newState.guild.channels.cache.get(db.get(`${newState.guild.id}.users.${newState.member.id}.tempvoc`))
                return newState.member.voice.setChannel(channelmove)
            }
            const category = db.get(`${newState.guild.id}.categoryTempvoc`)
            const channel = await newState.guild.channels.create(`${lang.Tempvocal} ${newState.member.user.username}`, {
                type: 'voice',
                parent: category,
                permissionOverwrites: [{
                        id: newState.member.id,
                        allow: ['MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'USE_VAD', 'MANAGE_ROLES', 'STREAM', 'CONNECT', 'SPEAK'],
                    },
                    // PERMS EVERYONE DU SALON
                    {
                        id: newState.guild.id,
                        allow: ['CONNECT', 'SPEAK', 'STREAM', 'VIEW_CHANNEL', 'USE_VAD'],
                    }
                ]
            })

            newState.member.voice.setChannel(channel)
            return db.set(`${newState.guild.id}.users.${newState.member.id}.tempvoc`, channel.id)
        }
        if (!oldState.channel) return;
        if (oldState.channel.parentID === db.get(`${newState.guild.id}.categoryTempvoc`) && oldState.channel.id !== db.get(`${newState.guild.id}.tempvoc.channel`)) {
            if (oldState.channel.members.size === 0) {
                oldState.channel.delete()
                return db.delete(`${oldState.guild.id}.users.${oldState.member.id}.tempvoc`)
            }
        }
    })
}