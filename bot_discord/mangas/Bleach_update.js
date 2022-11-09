const { Events } = require('discord.js');

const googleDriveUrl = `https://drive.google.com/drive/folders/11jiSnEUc8MAy8yTFFAzGd9pQIbbbdbF7?usp=sharing`;
const compressedTorrentUrl = `https://www5.yggtorrent.la/torrent/ebook/mangas/883941-compress%C3%A9+bleach+en+couleurs+-+t55-69+cbz+team+chromatique`;
const NormalTorrentUrl = `https://www5.yggtorrent.la/torrent/ebook/mangas/883940-bleach+en+couleurs+-+t55-69+cbz+team+chromatique`;
const liveReading = `https://coloredmanga.com/manga/bleach-chromatique-french/` ;



module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    const channel = client.channels.cache.get('1039890184390594621');
    channel.messages.fetch(`1039894493840814140`).then(message => {
      message.edit(({
        components: [
            {
              type: 1,
              components: [
                {
                  style: 5,
                  label: `Télécharger Compressé/Normal (Google Drive)`,
                  url: googleDriveUrl,
                  disabled: false,
                  type: 2,
                },
                {
                  style: 5,
                  label: `Télécharger Compressé (Torrent)`,
                  url: compressedTorrentUrl,
                  disabled: false,
                  type: 2,
                },
                {
                  style: 5,
                  label: `Télécharger Normal (Torrent)`,
                  url: NormalTorrentUrl,
                  disabled: false,
                  type: 2,
                },
                {
                  style: 5,
                  label: `Lecture en Ligne`,
                  url: liveReading,
                  disabled: false,
                  type: 2,
                },
              ],
            },
          ],
        embeds: [{
            type: 'rich',
            title: `Lien pour accéder aux mangas - Bleach [TOME 55 ]`,
            description: `**Synopsis :**\n\nIchigo Kurosaki, jeune lycéen de 15 ans dans la ville de Karakura, a l'étonnante capacité de pouvoir voir et communiquer avec les âmes errantes, suite à l'accident qui lui enleva sa mère... Vivant désormais avec son père et ses deux soeurs cadettes, Ichigo parvient tant bien que mal à gérer cet aspect de sa vie. Jusqu'au jour où il croisera le chemin d'une shinigami (déesse de la mort), Rukia Kuchiki, poursuivant une de ces âmes errantes ayant choisi le mauvais chemin vers l'éternité...`,
            color: 0x0a020a,
            timestamp: new Date().toISOString(),
            image: {
            url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu-FEKCwyhfyl7FGrNQM8eFQil2b-6nVrWeA&usqp=CAU`,
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
        }]
    }));
    
    
    
    })
        
	},
};

