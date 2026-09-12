const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// Web sunucusu (UptimeRobot / Kesintisiz Bağlantı İçin)
http.createServer((req, res) => res.end('7/24 Seste')).listen(process.env.PORT || 3000);

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

async function connectToVoice() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true,
        });

        // Bağlantı koparsa otomatik tekrar bağlanma kontrolü
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                connection.destroy();
                connectToVoice();
            }
        });

        console.log(`[BAŞARILI] ${channel.name} kanalına girildi.`);
    } catch (error) {
        console.error('[HATA] Sese girerken sorun oluştu:', error);
    }
}

client.on('ready', () => {
    console.log(`${client.user.tag} olarak oturum açıldı!`);
    connectToVoice();
});

client.login(TOKEN);
