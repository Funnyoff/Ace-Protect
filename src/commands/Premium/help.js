/* eslint-disable no-undef */
const {
    MessageEmbed,
} = require('discord.js');
const {
    blue,
    emojiAttention,
    prefix
} = require('../../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
const {MessageButton, MessageActionRow} = require("discord-buttons")
const ReactionRoleManager = require("discord-reaction-role");
const pagination = require('discord.js-pagination');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'help',
    description: 'Envoie la liste des commandes',
    aliases: ['h'],
    usage: 'help',
    perms: `\`SEND_MESSAGES\``,

    async execute(message, args, client, lang) {
        console.log(`${message.author.tag}, utilise la commande *help* sur |${message.guild.name}|`)
       // async run (client, message, args) {
        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        let prefixbot;
        if (db.get(`${message.guild.id}.prefix`)) {
            prefixbot = db.get(`${message.guild.id}.prefix`)
        } else {
            prefixbot = prefix
        }

        if (args[0]) {
            const command = client.commands.get(args[0])
            if (command === undefined) return

            const embedhelpcommande = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(
                    `**${lang.HelpCommandName}** ${lang.commands[command.name.toLowerCase()].name}\n` +
                    `**Alias :** ${lang.commands[command.name.toLowerCase()].aliases.join(' | ')} \n` +
                    `**${lang.HelpCommandDescription}** ${lang.commands[command.name.toLowerCase()].description}\n` +
                    `**${lang.HelpCommandUtilisation}** ${prefixbot}${lang.commands[command.name.toLowerCase()].usage} \n` +
                    `**${lang.HelpCommandPerms}** ${lang.commands[command.name.toLowerCase()].perms}`
                )
                .setTimestamp()
                .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);
            message.channel.send(embedhelpcommande);

        } else {
            let prefix = await db.get(`prefix_${message.guild.id}`);

            const page1 = new Discord.MessageEmbed()
            .setColor('#f00000')
            .setTitle('??? Important')
          .setDescription(`Ace Protect est un bot protection fran??ais, si tu veux avoir toute les actualit?? rejoins le [support](https://discord.gg/GB7s52aqMc).\nTu peux inviter le bot en [cliquant ici.](https://discord.com/api/oauth2/authorize?client_id=925889075997736960&permissions=8&scope=bot)\n \n help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
          //.setImage('https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=479&height=479')
         


            const page2 = new Discord.MessageEmbed()
             .setTitle('???? Information')
             .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
             .addField("`help`","Pour avoir la list des commandes")
             .addField("`pic`","Pour avoir la photo de profil d'un utilisateur")
             .addField("`ping`","Pour avoir le ping du bot")
             .addField("`userinfo`","Pour avoir des informations sur un utilisateur")
             .addField("`serverinfo`","Pour avoir des informations sur le serveur")
             .addField("`botinfo`","Pour avoir des informations sur le bot")
             .addField("`warnings`","Pour savoir les warns d'un utilisateur")
             .addField("`invite`","Pour avoir une invitation du bot")
             .addField("`vc`","Pour avoir les statistiques vocal")
             .setColor('#f00000')
             //.setFooter(`Ace Protect`, `https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=478&height=478`);
    
            const page3 = new Discord.MessageEmbed()
             .setTitle('??????? S??curit??')
             .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
             .addField("`secur`","Pour savoir comment la s??curit?? est configurer sur le serveur")
             .addField("`Antispam`","Pour activ?? ou d??sactiv?? l'antispam")
             .addField("`Antilink`","Pour activ?? ou d??sactiv?? l'antilink")
             .addField("`Antiwebhook`","Pour activ?? ou d??sactiv?? l'antiwebhook")
             .addField("`Antiban`","Pour activ?? ou d??sactiv?? l'antiban")
             .addField("`Antichannel`","Pour activ?? ou d??sactiv?? l'antichannel")
             .addField("`Antieveryone`","Pour activ?? ou d??sactiv?? l'antieveryone")
             .addField("`antiword`","Pour activ?? ou d??sactiv?? l'antiword")
             .addField("`Antirole`","Pour activ?? ou d??sactiv?? l'antirole")
             .addField("`Antibot`","Pour activ?? ou d??sactiv?? l'antibot")
             .addField("`deletewebhooks`","Pour supprim?? tout les webhooks du serveur")
             .addField("`antiw (antiword config)`","Pour configurer antiword")
             .addField("`sanction`","Pour d??finir une sanction en cas de tentative de raid")
             .setColor('#f00000')
            // .setFooter(`Ace Protect`, `https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=478&height=478`);
        
            const page4 = new Discord.MessageEmbed()
            .setTitle('??????? Mod??ration')
            .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
            .addField("`ban`","Pour bannir une personne du serveur")
            .addField("`unban`","Pour d??bannir une personne du serveur")
            .addField("`kick`","Pour kick une personne du serveur")
            .addField("`mute`","Pour mute une personne sur le serveur")
            .addField("`tempmute`","Pour temporairement mute une personne sur le serveur")
            .addField("`unmute`","Pour unmute une personne sur le serveur")
            .addField("`warn`","Pour warn une personne sur le serveur")
            .addField("`resetwarn`","Pour reset tout les warns d'une personne sur le serveur")
            .addField("`lock`","Pour lock un salon")
            .addField("`unlock`","Pour unlock un salon")
            .addField("`renew`","Pour recr???? un salon")
            .addField("`rolecheck`","Pour verifi?? un role")
            .setColor('#f00000')
           // .setFooter(`Ace Protect`, `https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=478&height=478`);
       
           const page5 = new Discord.MessageEmbed()
           .setTitle('???? Administration')
           .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
           .setColor('#f00000')
           .addField("`owner`","Pour configur?? la liste des owners sur le bot")
           .addField("`whitelist`","Pour configur?? la liste des whitelist sur le bot")
           .addField("`setup`","Pour setup le bot par rapport au serveur")
           .addField("`setmuterole`","Pour d??finir un role mute")
           .addField("`config`","Pour savoir la configuration du bot")
           .addField("`embed`","Pour g??n??r?? un message sous forme d'embed ?? envoy?? dans un salon")
           .addField("`addemoji`","Pour ajout?? un emoji sur le serveur avec le bot")
           .addField("`rolereaction`","Pour ajout?? une r??action qui donne un role sur un message")
           .addField("`prefix`","Pour d??finir un prefix du bot sur le serveur")
           .addField("`color`","Pour d??finir la couleur par d??fault du bot")
           .addField("`tempvocal`","Pour cr???? une cat??gories de vocaux temporaire")
           .addField("`ticket`","Pour envoy?? le message de cr??ation de ticket")
           .addField("`soutien`","Pour d??finir un role ?? atribu?? quant un certain statut est mis")
           .addField("`massadd`","Pour ajout?? un role ?? tout les membres du serveur")
           .addField("`massremove`","Pour retir?? un role ?? tout les membres du serveur")


           const page6 = new Discord.MessageEmbed()
           .setTitle('???? Logs')
           .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
           .setColor('#f00000')
           .addField("`logs`","Pour savoir comment sont configur?? les logs sur le serveur")
           .addField("`setlogs`","Pour configur?? les logs du bot sur le serveur")
           .addField("`logc`"," Active / d??sactive les logs de cr??ation / suppression des salons")
           .addField("`logsban`","Active / d??sactive les logs de ban")
           .addField("`logsmsg`","Active / d??sactive les logs de suppression / modification des messages")
           .addField("`logroles`","Active / d??sactive les logs des roles")




             const pages = [
            page1,
            page2,
            page3,
            page4,
            page5,
            page6,
        ]
    
        const emoji = ["???", "???"]
    
    
        pagination(message, pages, emoji)
        } 
    }
}

    //   .addField("``","")