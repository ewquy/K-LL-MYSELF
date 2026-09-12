const { Client, CustomStatus, RichPresence } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

async function startBot() {
    if (client.isReady()) return 'Zaten aktif';
    
    await client.login(TOKEN);
    
    const activity = new RichPresence(client)
        .setApplicationId('1101928302322303030')
        .setName('discord.gg/363')
        .setType('LISTENING')
        .setDetails('bloodparty - b4r')
        .setState('discord.gg/kazakistan')
        .setStartTimestamp(Date.now());

    const customStatus = new CustomStatus(client).setState('/363');

    client.user.setPresence({
        activities: [activity, customStatus],
        status: 'dnd',
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
        return 'Seste aktif';
    } catch (e) {
        return 'Hata: ' + e.message;
    }
}

module.exports = async (req, res) => {
    const status = await startBot();
    res.status(200).send(status);
};
