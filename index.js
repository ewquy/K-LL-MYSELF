const { Client, CustomStatus, RichPresence } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Render'ın kapanmaması için web sunucusu
http.createServer((req, res) => res.end('7/24 Aktif')).listen(process.env.PORT || 3000);

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.on('ready', async () => {
    console.log(`${client.user.tag} bulutta aktif!`);

    // --- SPOTIFY DİNLİYOR AYARLARI ---
    const songName = 'kazakistan'';
    const artistName = 'irlanda';
    const albumName = '363';

    const spotifyActivity = new RichPresence(client)
        .setApplicationId('1101928302322303030')
        .setName('Spotify')
        .setType('LISTENING')
        .setDetails(songName)
        .setState(artistName)
        .setAssetsLargeImage('spotify:ab67616d0000b273610e20601f01633519808a54')
        .setAssetsLargeText(albumName)
        .setStartTimestamp(Date.now());

    // --- ÖZEL DURUM YAZISI ---
    const customStatus = new CustomStatus(client)
        .setState('/363');

    // --- HESAP DURUMU (RAHATSIZ ETMEYİN) ---
    client.user.setPresence({
        activities: [spotifyActivity, customStatus],
        status: 'dnd', // dnd = Rahatsız Etmeyin (Kırmızı İkon)
    });

    // --- SESE BAĞLANMA ---
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true,
        });

        console.log(`Başarıyla ${channel.name} ses kanalına girildi!`);
    } catch (error) {
        console.error('Sese bağlanırken hata oluştu:', error);
    }
});

client.login(TOKEN);
