const { Client, GatewayIntentBits } = require('discord.js');

const { DISCORD_TOKEN, N8N_URL, CANAL_ID } = process.env;

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]});

client.once('ready', () => console.log(`Conectado como ${client.user.tag}`));

client.on('messageCreate', async (m) => {
  if (m.author.bot) return;
  if (CANAL_ID && m.channelId !== CANAL_ID) return;
  try {
    const r = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: m.content,
        author_id: m.author.id,
        author_username: m.author.username,
        author_display_name: m.member?.displayName ?? m.author.username,
        timestamp: m.createdAt.toISOString(),
      }),
    });
    if (!r.ok) console.error('n8n respondió', r.status);
  } catch (e) {
    console.error('Error enviando a n8n:', e.message);
  }
});

client.login(DISCORD_TOKEN);
