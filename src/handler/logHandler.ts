import { DiscordAlert } from '../types';
import { logger } from '../utils/logger';
import { sendDiscordMessage } from '../handler/discordHandler';
import { config } from 'dotenv';
config();


/// @notice Logs an informational message using the logger
/// @param msg The informational message to log
export const showInfo = (
    msg: string
): void => {
    logger.info(`${msg}`);
}

/// @notice Logs a warning message using the logger
/// @param path The file path where the warning occurred
/// @param warn The warning message to log
export const showWarning = (
    path: string,
    warn: any,
): void => {
    logger.warn(`${path}: ${warn}`);
}

/// @notice Logs an error message using the logger
/// @param path The file path where the error occurred
/// @param err The error message to log
export const showError = (
    path: string,
    err: any
): void => {
    const msg = `${path}: ${err}`;
    logger.error(msg);
    if (process.env.DISCORD === 'true')
        sendDiscordMessage(DiscordAlert.BOT_LOG, msg);
}
