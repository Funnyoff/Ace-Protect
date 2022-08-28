/* eslint-disable no-undef */
const {
    token,
    prefix,
} = require('./config.json');
const {
    Client,
    Collection,
    MessageEmbed,
} = require("discord.js");
const fs = require('fs').promises;
const db = require('quick.db');;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
require("discord-reply")
const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.commands = new Collection();

const path = require('path');
async function registry(cheminDossier = path.join(__dirname, './src/events')) {
    const files = await fs.readdir(cheminDossier)
    if (cheminDossier.includes('events')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('commands')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const command = require(path.join(cheminDossier, files[i]));
                client.commands.set(command.name, command);
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('logs')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    }
}
registry(path.join(__dirname, './src/events'));
registry(path.join(__dirname, './src/logs'));
registry(path.join(__dirname, './src/commands'));

client.on('ready', async () => {
    // client.guilds.cache.forEach(guild => {
    //     if (guild.memberCount > 15) {
    //         return console.log(`${guild.name} | ${guild.id} | ${guild.memberCount}`);
    //     } else {
    //         guild.leave()
    //     }
    // })
    console.log(`${client.user.username} à été allumé avec succès.`)
    console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)
    db.set(`${client.user.id}.statutTime`, false)
    db.set(`${client.user.id}.avatar`, false)
    db.set(`${client.user.id}.username`, false)
    db.set(`${client.user.id}.activityTypeTime`, false)

    if (db.get(`${client.user.id}.statut`) === undefined || db.get(`${client.user.id}.statut`) === null) {
        db.set(`${client.user.id}.statut`, `Ping moi`)
    }//${client.guilds.cache.size} serveurs
    if (db.get(`${client.user.id}.activityType`) === undefined || db.get(`${client.user.id}.activityType`) === null) {
        db.set(`${client.user.id}.activityType`, `PLAYING`)
    }

    client.user.setActivity(db.get(`${client.user.id}.statut`), {
        type: db.get(`${client.user.id}.activityType`),
        url: "https://www.twitch.tv/sohan221145"
    })
});

// client.on('ready', async () => {
//     console.log(`${client.user.username} à été allumé avec succès.`)
//     console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)

//     let statuses = [
//         "MTS [1.0]",
//         `${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`,
//     ]

//     setInterval(() => {
//         let status = statuses[Math.floor(Math.random() * statuses.length)];
//         client.user.setActivity(status, {
//             type: "PLAYING",
//             url: "https://www.twitch.tv/Jazooo0"
//         })
//     }, 20000)

// });

client.on('presenceUpdate', async (oldPresence, newPresence) => {

    if (!oldPresence) return;
    if (!newPresence.guild.me.hasPermission("MANAGE_ROLES")) return
    let presenceStatusSoutien = db.get(`${newPresence.guild.id}.statutchange`);
    let roleSoutien = db.get(`${newPresence.guild.id}.RoleSoutien`)
    if (db.get(`${newPresence.guild.id}.RoleSoutien`) == undefined) return;
    if (db.get(`${newPresence.guild.id}.statutchange`) == undefined) return;
    if (db.get(`${newPresence.guild.id}.RoleSoutien`) == null) return;
    if (db.get(`${newPresence.guild.id}.statutchange`) == null) return;
    let roleS = newPresence.guild.roles.cache.get(roleSoutien);
    if (!roleS) return;
    if (roleS.position > newPresence.guild.me.roles.highest.position) return
    const m = newPresence;
    if (m.user.bot) return;
    const Ifsoutien = (presence) => {
        if (presence.activities.length > 0) {
            if (presence.activities.some(activity => activity.type === 'CUSTOM_STATUS')) {
                if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state) {
                    if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state.toLowerCase().includes(presenceStatusSoutien.toLowerCase())) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    if (!Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
        if (!m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.add(roleS)
        }
    }
    if (Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
        if (!m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.add(roleS)
        }
    }
    if (Ifsoutien(oldPresence) && !Ifsoutien(newPresence)) {
        if (m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.remove(roleS)
        }
    }
});

///////////////////////////////////////////////////////////////////
////////////////////////// IMPORT COMMANDES //////////////////////
/////////////////////////////////////////////////////////////////

client.on('message', async (message) => {

    if(message.content.startsWith(`${prefix}serveurs`)){
        console.log(`${message.author.tag}, utilise la commande *serveurs* sur |${message.guild.name}|`)
        const embeds = new MessageEmbed()
        .setColor('#b40f17')
        .setDescription(`Le bot est dans **${client.guilds.cache.size} serveurs** avec **${message.client.users.cache.size - 1} users**`)
        .setFooter(
          `Demandé par ${message.author.tag}`,
          message.author.displayAvatarURL(),
        )
        .setTimestamp()
        message.channel.send(embeds);
      }

    if(message.content.startsWith(`${prefix}vote`)){
        console.log(`${message.author.tag}, utilise la commande *vote* sur |${message.guild.name}|`)
        if(message.author.bot) return;
        let votetxt = message.content.split(" ").slice(1).join(" ");
        message.delete();
        if(!votetxt) return message.channel.send("Veuillez spécifier un vote")
        let embed = new MessageEmbed()
        .setTitle("`Vote`")
        .addField(votetxt, "⠀")
        .setColor("RANDOM")
        .setFooter(
          `vote by ${message.author.tag}`,
          message.author.displayAvatarURL(),
        )
        .setTimestamp();
        message.channel.send(embed).then(message=>{
          message.react('👍');
          message.react('👎');
      });
      }
    if(message.content.startsWith(`+reboot`)){
        console.log(`${message.author.tag}, utilise la commande *reboot* sur |${message.guild.name}|`)
        if(message.author.id !== '886649065352364103') return message.reply("Vous n'êtes pas autorisé à utiliser cette commande");
        message.channel.send("🕙 | Reboot en cours ...").then(async message => {
            message.edit("🕙 | Reboot en cours ...")
            client.destroy();
            await client.login(token);
            await message.edit("🕙 | Reboot en cours ...")
            message.edit("☑️ | Reboot bien effectué")
        })
     }
     if(message.content.startsWith(`+leave`)){
        console.log(`${message.author.tag}, utilise la commande *leave* sur |${message.guild.name}|`)
        if(!message.author.id == "886649065352364103")return undefined;
        var id = message.content.split(" ")[1];
        if(!id)return message.channel.send(` Veuillez saisir l'identifiant du serveur avec la commande`)
        var guild = client.guilds.cache.get(id);
        if(!guild)return message.channel.send("je ne trouve pas ce serveur")
      guild.leave();
          message.channel.send(`Terminé j'ai quitté le serveur ${guild}`)
      }
     
   
      
    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild || message.author.bot) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(db.get(`${message.guild.id}.prefix`) || prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return;


    let language;
    if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
        await db.set(`${message.guild.id}.language`, "fr")
        language = db.get(`${message.guild.id}.language`)
    }
    language = db.get(`${message.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
    try {
        cmd.execute(message, args, client, lang);
    } catch (error) {
        console.log(error);
        return message.lineReply("Il semble y avoir un eu une erreur lors de l'éxécution de cette commande ")
    }


});


client.on("guildCreate", guild => {
    
    const channel = client.channels.cache.get("976523575844540426") //channel où le message sera envoyer
    console.log(channel)
    let addembed = new MessageEmbed()
        .setTitle(`BOT vient d'être ajouté sur le serveur : ${guild.name}`)
        .setThumbnail(guild.iconURL())
    //    .addField(`👑 Propriétaire:`, `<@${guild.ownerId}>`)
      //   .addField(`Owner ID:`, `${guild.ownerId}`)
        .addField(`📇 Nom du serveur :`, `${guild.name}`)
        .addField(` Id du serveur:`, `${guild.id}`)
        .addField(` Nombre de membres:`, `${guild.memberCount}`)
        .setColor("11d646")
        .setTimestamp()
        .setFooter(`Merci grâce à toi nous sommes à ${client.guilds.cache.size} serveurs`)
    channel.send(addembed) 
})

client.on("guildDelete", guild => {
    const channel = client.channels.cache.get("976523575844540426") //channel où le message s'envoie
    console.log(channel)
   let removeembed = new MessageEmbed()
        .setTitle(`BOT vient d\'être retiré du serveur serveur ${guild.name}`)
     .setThumbnail(guild.iconURL())
      //  .addField(`👑 Propriétaire:`, `<@${guild.ownerId}>`)
       //  .addField(`Owner ID:`, `${guild.ownerId}`)
      .addField(`📇 Nom du serveur :`, `${guild.name}`)
       .addField(` Id du serveur:`, `${guild.id}`)
       .addField(` Nombre de membres:`, `${guild.memberCount}`)
   .setColor(`fc3d12`)
     .setFooter(`Désormais : ${client.guilds.cache.size} serveurs`)
channel.send(removeembed)    
})



////client.on('ready', () => {

  //  const channel = client.channels.cache.get('929405528315138178')
  
  //  const embed = new MessageEmbed()
  //   .setColor("#2F3136")
   // .setTitle("Le bot viens de rédémarré")
  //  .setFooter("Loading...")
  
  //  channel.send(embed)
  
 // });

//ANTI CRASH
  process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
    });
    process.on("multipleResolves", (type, promise, reason) => {
    console.log(type, promise, reason);
});

client.login(token)