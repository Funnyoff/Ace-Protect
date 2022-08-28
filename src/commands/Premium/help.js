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
            .setTitle('❗ Important')
          .setDescription(`Ace Protect est un bot protection français, si tu veux avoir toute les actualité rejoins le [support](https://discord.gg/GB7s52aqMc).\nTu peux inviter le bot en [cliquant ici.](https://discord.com/api/oauth2/authorize?client_id=925889075997736960&permissions=8&scope=bot)\n \n help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
          //.setImage('https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=479&height=479')
         


            const page2 = new Discord.MessageEmbed()
             .setTitle('📢 Information')
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
             .setTitle('🛡️ Sécurité')
             .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
             .addField("`secur`","Pour savoir comment la sécurité est configurer sur le serveur")
             .addField("`Antispam`","Pour activé ou désactivé l'antispam")
             .addField("`Antilink`","Pour activé ou désactivé l'antilink")
             .addField("`Antiwebhook`","Pour activé ou désactivé l'antiwebhook")
             .addField("`Antiban`","Pour activé ou désactivé l'antiban")
             .addField("`Antichannel`","Pour activé ou désactivé l'antichannel")
             .addField("`Antieveryone`","Pour activé ou désactivé l'antieveryone")
             .addField("`antiword`","Pour activé ou désactivé l'antiword")
             .addField("`Antirole`","Pour activé ou désactivé l'antirole")
             .addField("`Antibot`","Pour activé ou désactivé l'antibot")
             .addField("`deletewebhooks`","Pour supprimé tout les webhooks du serveur")
             .addField("`antiw (antiword config)`","Pour configurer antiword")
             .addField("`sanction`","Pour définir une sanction en cas de tentative de raid")
             .setColor('#f00000')
            // .setFooter(`Ace Protect`, `https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=478&height=478`);
        
            const page4 = new Discord.MessageEmbed()
            .setTitle('🛠️ Modération')
            .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
            .addField("`ban`","Pour bannir une personne du serveur")
            .addField("`unban`","Pour débannir une personne du serveur")
            .addField("`kick`","Pour kick une personne du serveur")
            .addField("`mute`","Pour mute une personne sur le serveur")
            .addField("`tempmute`","Pour temporairement mute une personne sur le serveur")
            .addField("`unmute`","Pour unmute une personne sur le serveur")
            .addField("`warn`","Pour warn une personne sur le serveur")
            .addField("`resetwarn`","Pour reset tout les warns d'une personne sur le serveur")
            .addField("`lock`","Pour lock un salon")
            .addField("`unlock`","Pour unlock un salon")
            .addField("`renew`","Pour recréé un salon")
            .addField("`rolecheck`","Pour verifié un role")
            .setColor('#f00000')
           // .setFooter(`Ace Protect`, `https://images-ext-2.discordapp.net/external/C9HFarGDMwgxd8e-fZFVs0pgsT6FlsCnekNqe05IV6k/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/925889075997736960/9fbc21c047ceba00f932fbbafe3cb5d4.webp?width=478&height=478`);
       
           const page5 = new Discord.MessageEmbed()
           .setTitle('🔑 Administration')
           .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
           .setColor('#f00000')
           .addField("`owner`","Pour configuré la liste des owners sur le bot")
           .addField("`whitelist`","Pour configuré la liste des whitelist sur le bot")
           .addField("`setup`","Pour setup le bot par rapport au serveur")
           .addField("`setmuterole`","Pour définir un role mute")
           .addField("`config`","Pour savoir la configuration du bot")
           .addField("`embed`","Pour généré un message sous forme d'embed à envoyé dans un salon")
           .addField("`addemoji`","Pour ajouté un emoji sur le serveur avec le bot")
           .addField("`rolereaction`","Pour ajouté une réaction qui donne un role sur un message")
           .addField("`prefix`","Pour définir un prefix du bot sur le serveur")
           .addField("`color`","Pour définir la couleur par défault du bot")
           .addField("`tempvocal`","Pour créé une catégories de vocaux temporaire")
           .addField("`ticket`","Pour envoyé le message de création de ticket")
           .addField("`soutien`","Pour définir un role à atribué quant un certain statut est mis")
           .addField("`massadd`","Pour ajouté un role à tout les membres du serveur")
           .addField("`massremove`","Pour retiré un role à tout les membres du serveur")


           const page6 = new Discord.MessageEmbed()
           .setTitle('📝 Logs')
           .setDescription(`help + <commande> \n  *(Pour avoir plus d'info sur la commande)*`)
           .setColor('#f00000')
           .addField("`logs`","Pour savoir comment sont configuré les logs sur le serveur")
           .addField("`setlogs`","Pour configuré les logs du bot sur le serveur")
           .addField("`logc`"," Active / désactive les logs de création / suppression des salons")
           .addField("`logsban`","Active / désactive les logs de ban")
           .addField("`logsmsg`","Active / désactive les logs de suppression / modification des messages")
           .addField("`logroles`","Active / désactive les logs des roles")




             const pages = [
            page1,
            page2,
            page3,
            page4,
            page5,
            page6,
        ]
    
        const emoji = ["⏪", "⏩"]
    
    
        pagination(message, pages, emoji)
        } 
    }
}

    //   .addField("``","")