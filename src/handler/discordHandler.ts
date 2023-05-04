import { DiscordAlert } from '../types';
import { showError } from '../handler/logHandler';
import {
    DISCORD_CHANNELS,
    SUBGRAPH_LOGO_URL,
} from '../constants';
import {
    EmbedBuilder,
    WebhookClient,
} from 'discord.js';
import { config } from 'dotenv';
config();


/// @notice Sends a message to a Discord channel based on the provided alert, category, and message
/// @dev The function constructs a Discord webhook client, creates an embed for the message,
/// and sends it to the Discord channel
/// @param alert The alert level of the message, used to determine the Discord channel
/// @param category The category of the message, which is split into a title and detail for the embed
/// @param message The main content of the message (e.g: the API URL)
export const sendDiscordMessage = async (
    alert: DiscordAlert,
    category: string,
    message: string,
) => {
    try {
        const node_env = process.env.NODE_ENV?.toLowerCase() === 'prod' ? 'PROD' : 'TEST';
        const url = DISCORD_CHANNELS[node_env][alert];
        if (typeof url === 'string') {
            const [title, detail = ''] = category.split('\n');
            const webhookClient = new WebhookClient({ url });
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(`\`\`\`${message}\`\`\``)
                .setColor(0x00FFFF);
            if (detail) {
                embed.addFields({ name: 'at', value: detail });
            }
            await webhookClient.send({
                username: 'Subgraph',
                avatarURL: SUBGRAPH_LOGO_URL,
                embeds: [embed],
            })
                .catch(err => showError('handler/discordHandler.ts->sendDiscordMessage() 1/2', err))
        } else {
            showError(
                'handler/discordHandler.ts->sendDiscordMessage()',
                'DISCORD_CHANNELS not found in .env'
            );
        }
    } catch (err) {
        showError('handler/discordHandler.ts->sendDiscordMessage() 2/2', err);
    }
}
