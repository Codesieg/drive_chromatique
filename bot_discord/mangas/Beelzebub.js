const { Events } = require('discord.js');



module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const channel = client.channels.cache.get('1039890116820336721');
	channel.send({ embeds: [{
        type: 'rich',
        title: `Lien pour accéder aux mangas - Beelzebub [TOME]`,
        description: `**Synopsis :**\n\nTatsumi Oga, dit \"le Fou Furieux\", est la terreur d'un des lycées les plus craignos du Japon ! Un jour, alors qu'il donnait une leçon de politesse à une bande de racailles imprudentes, il repêche un géant moustachu dénommé Alindolon, qui aussitôt se fend en deux pour laisser entrevoir un nouveau-né. Ce bébé, qui se prend immédiatement d'affection pour le jeune voyou, n'est autre que... le fils du Diable ! Tatsumi va alors vite comprendre qu’il a été choisi pour l'éduquer et en faire le destructeur de l’humanité...`,
        color: 0x0a020a,
        timestamp:  new Date().toISOString(),
        image: {
          url: `https://tigeranimecom.files.wordpress.com/2019/10/beelzebub-banner.jpg`,
          height: 0,
          width: 0,
        },
        author: {
          name: `Team Chromatique`,
          icon_url: `https://cdn.discordapp.com/avatars/903001595304894536/757a033404d515afebc8eaeb7e3b711e.png`,
        },
        footer: {
          text: `Dernière Mise à Jour`,
        },
      }]});
	},
};

