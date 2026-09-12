const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Sunucunun kapanmaması için küçük web sunucusu
http.createServer((req, res) => res.end('7/24 AFK Aktif')).listen(process.env.PORT || 3000);

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.on('ready', async () => {
    console.log(`${client.user.tag} olarak seste AFK moduna geçildi!`);

    // Profildeki oynuyor/dinliyor durumunu temizler ve doğrudan varsayılan moda alır
    client.user.setPresence({
        activities: [],
        status: 'dnd', // dnd = Rahatsız Etmeyin (kırmızı ikon). İstersen 'online' yapabilirsin.
    });

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true, // Sağırlaştırılmış (kulaklık kapalı)
            selfMute: true, // Susturulmuş (mikrofon kapalı)
        });

        console.log(`Başarıyla ${channel.name} ses kanalına girildi!`);
    } catch (error) {
        console.error('Sese bağlanırken hata oluştu:', error);
    }
});

client.login(TOKEN);
