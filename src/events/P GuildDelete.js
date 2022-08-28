const Discord = require('discord.js');
const fs = require('fs').promises;
const {
     blue,
    emojiValidé,
    emojiAttention,
    owner
} = require('../../config.json');
const db = require('quick.db');
const emojis = require('../../emojis.json')
module.exports = (client) => {
    client.on('guildDelete', async (guild) => {

        if(!guild) return;
        if(guild.name === undefined) return;
        let color;
        if (db.get(`${guild.id}.Color`)) {
            color = db.get(`${guild.id}.Color`)
        } else {
             color = "2f3136";
        }

        let language;
        if (db.get(`${guild.id}.language`) === undefined || db.get(`${guild.id}.language`) === null) {
            await db.set(`${guild.id}.language`, "fr")
            language = db.get(`${guild.id}.language`)
        }
        language = db.get(`${guild.id}.language`)
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        const id = (await client.users.fetch(owner))
        id.send(`${client.user.username} a quitté **${guild.name}**, qui avait **${guild.memberCount}** membres.`)


    });
};