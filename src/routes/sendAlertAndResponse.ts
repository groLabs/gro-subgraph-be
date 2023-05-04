import { Response } from 'express';
import { DiscordAlert } from '../types';
import { showError } from '../handler/logHandler';
import { sendDiscordMessage } from '../handler/discordHandler';


 /// @notice Logs the error, sends an alert via Discord, and sends a JSON response to the client
 /// @param path The path where the error occurred in format 'folder/file.ts->function()'
 /// @param errMessage The error message to log and send via Discord
 /// @param alertMsg The generic alert message (eg: E1, E5..) to prepend to the Discord alert
 /// @param res The Express Response object to send the JSON response
 /// @param output The output data to include in the JSON response
export const sendErrorAndResponse = async (
    path: string,
    errMessage: string,
    alertMsg: string,
    res: Response,
    output: any
): Promise<void> => {
    showError(
        path,
        errMessage
    );
    await sendDiscordMessage(
        DiscordAlert.BOT_ALERT,
        alertMsg,
        errMessage
    );
    res.json(output);
}
