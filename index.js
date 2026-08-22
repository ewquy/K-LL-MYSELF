const { Client, CustomStatus, RichPresence } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Render'ın uykuya geçmesini engellemek için küçük web sunucusu
http.createServer((req, res) => res.end('7/24 Aktif')).listen(process.env.PORT || 3000);

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.on('ready', async () => {
    console.log(`${client.user.tag} bulutta aktif!`);

    // Profil Aktivite Durumu (Oynuyor / Dinliyor)
    const activity = new RichPresence(client)
        .setApplicationId('1101928302322303030')
        .setName('ecelin olucam')
        .setType('PLAYING')
        .setDetails('kafana sıkıcam')
        .setState('deliricem');

    // Özel Durum Yazısı
    const customStatus = new CustomStatus(client)
        .setState('/titanlar')
        .setEmoji('😁');

    client.user.setPresence({
        activities: [activity, customStatus],
        status: 'online',
    });

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
