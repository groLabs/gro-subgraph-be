import { config } from 'dotenv';
import { now } from '../utils/utils';
import { DiscordAlert } from '../types';
import { etlGroStats } from '../etl/etlGroStats';
import { showError } from '../handler/logHandler';
import { groStatsError } from '../parser/groStatsError';
import { statusHandler } from '../handler/statusHandler';
import { etlPersonalStats } from '../etl/etlPersonalStats';
import { sendDiscordMessage } from '../handler/discordHandler';
import { validateApiRequest } from '../caller/validateApiRequest';
import { personalStatsError } from '../parser/personalStatsError';
import { historicalApyError } from '../parser/historicalApyError';
import { getHistoricalApy } from '../handler/historicalApyHandler';
import {
    query,
    validationResult
} from 'express-validator';
import {
    Route,
    Status,
    Subgraph,
} from '../types';
import {
    globalStatus,
    statusNetworkError,
} from '../parser/status';
import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';
config();


const router = express.Router();

/// @notice Wraps an asynchronous request handler with error handling
/// @param fn The asynchronous request handler function to wrap
/// @return The wrapped asynchronous request handler function with error handling
const wrapAsync = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/// @notice Handles the /gro_stats_mc API endpoint to retrieve GRO stats from subgraphs
/// @dev API example: http://localhost:3015/subgraph/gro_stats_mc?subgraph=prod_hosted
router.get(
    '/gro_stats_mc',
    validateApiRequest([
        query('subgraph')
            .trim()
            .notEmpty().withMessage(`field <subgraph> can't be empty`)],
        Route.GRO_STATS_MC,
    ),
    wrapAsync(async (req: Request, res: Response) => {
        const alert = `[WARN] E2 - Get gro stats failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { subgraph } = req.query;
            if (Object.values(Subgraph).includes(subgraph as Subgraph)) {
                // address & subgraph fields are correct
                const groStats = await etlGroStats(
                    subgraph as Subgraph,
                );
                if (groStats.gro_stats_mc.status === Status.ERROR) {
                    await sendDiscordMessage(
                        DiscordAlert.BOT_ALERT,
                        alert,
                        groStats.gro_stats_mc.error_msg,
                    );
                }
                res.json(groStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts->gro_stats_mc', err_msg);
                await sendDiscordMessage(
                    DiscordAlert.BOT_ALERT,
                    alert,
                    err_msg,
                );
                res.json(groStatsError(
                    now(),
                    err_msg
                ));
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_stats_mc', err);
            await sendDiscordMessage(
                DiscordAlert.BOT_ALERT,
                alert,
                `routes/subgraph.ts->gro_stats_mc: ${err}`,
            );
            res.json(groStatsError(
                now(),
                err as string,
            ));
        }
    })
);

/// @notice Handles the /gro_personal_position_mc API endpoint to retrieve personal position for a specific address from subgraphs
/// @dev API example: http://localhost:3015/subgraph/gro_personal_position_mc?address=0x...&subgraph=prod_studio
router.get(
    '/gro_personal_position_mc',
    validateApiRequest([
        query('subgraph')
            .trim()
            .notEmpty().withMessage(`field <subgraph> can't be empty`),
        query('address')
            .notEmpty().withMessage(`address can't be empty`)
            .isLength({ min: 42, max: 42 }).withMessage('address must be 42 characters long')
            .matches(/^0x[A-Za-z0-9]{40}/).withMessage('should be a valid address and start with "0x"')],
        Route.GRO_PERSONAL_POSITION_MC
    ),
    wrapAsync(async (req: Request, res: Response) => {
        const alert = `[WARN] E1 - Get personal stats failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { subgraph, address } = req.query;
            if (Object.values(Subgraph).includes(subgraph as Subgraph)) {
                // address & subgraph fields are correct
                const personalStats = await etlPersonalStats(
                    subgraph as Subgraph,
                    address as string,
                );
                if (personalStats.gro_personal_position_mc.status === Status.ERROR) {
                    await sendDiscordMessage(
                        DiscordAlert.BOT_ALERT,
                        alert,
                        personalStats.gro_personal_position_mc.error_msg,
                    );
                }
                res.json(personalStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts->gro_personal_position_mc', err_msg);
                await sendDiscordMessage(
                    DiscordAlert.BOT_ALERT,
                    alert,
                    err_msg,
                );
                res.json(personalStatsError(
                    now(),
                    address?.toString() || 'N/A',
                    err_msg
                ));
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_personal_position_mc', err);
            await sendDiscordMessage(
                DiscordAlert.BOT_ALERT,
                alert,
                `routes/subgraph.ts->gro_personal_position_mc: ${err}`,
            );
            res.json(personalStatsError(
                now(),
                'N/A',
                err as string,
            ));
        }
    })
);

/// @notice Handles the /historical_apy API endpoint to retrieve historical APY data for a
///         specific network, attribute, frequency, start time, and end time
/// @dev Only `apy_current` is currently stored in the DB; any other apy will return null values
/// @dev API example: http://localhost:3015/subgraph/historical_apy?network=mainnet&attr=apy_current,apy_current,apy_current&freq=twice_daily,daily,weekly&start=1669913771,1669913771,1669913771&end=1672505771,1672505771,1672505771
router.get(
    '/historical_apy',
    validateApiRequest([
        query('network')
            .trim()
            .notEmpty().withMessage(`network can't be empty`)
            .equals('mainnet').withMessage(`network must be 'mainnet'`),
        query('attr')
            .notEmpty().withMessage(`attr can't be empty`),
        query('freq')
            .notEmpty().withMessage(`freq can't be empty`),
        query('start')
            .notEmpty().withMessage(`start can't be empty`),
        query('end')
            .notEmpty().withMessage(`end can't be empty`)],
        Route.HISTORICAL_APY
    ),
    wrapAsync(async (req: Request, res: Response) => {
        const alert = `[WARN] E4 - Get historical apy failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { attr, freq, start, end } = req.query;
            const groStats = await getHistoricalApy(attr, freq, start, end);
            if (groStats.historical_stats.status === Status.ERROR) {
                await sendDiscordMessage(
                    DiscordAlert.BOT_ALERT,
                    alert,
                    groStats.historical_stats.error_msg || '',
                );
            }
            res.json(groStats);
        } catch (err) {
            showError('routes/subgraph.ts->historical_apy', err);
            await sendDiscordMessage(
                DiscordAlert.BOT_ALERT,
                alert,
                `routes/subgraph.ts->historical_apy: ${err}`,
            );
            res.json(historicalApyError(
                now(),
                err as string,
            ));
        }
    })
);

/// @notice Handles the /status API endpoint to retrieve the status of subgraphs
/// @dev API example: http://localhost:3015/subgraph/status?subgraph=prod_hosted
router.get(
    '/status',
    wrapAsync(async (req: Request, res: Response) => {
        const alert = `[WARN] E6 - Get subgraph status failed \n${req.originalUrl}`;
        try {
            const status = await statusHandler();
            res.json(status);
        } catch (err) {
            showError('routes/subgraph.ts->status', err);
            await sendDiscordMessage(
                DiscordAlert.BOT_ALERT,
                alert,
                `routes/subgraph.ts->status: ${err}`,
            );
            res.json(globalStatus(
                Status.ERROR,
                now(),
                statusNetworkError(err as Error | string),
            ));
        }
    })
);

export default router;
