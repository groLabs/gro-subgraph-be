import { config } from 'dotenv';
import { now } from '../utils/utils';
import { etlGroStats } from '../etl/etlGroStats';
import { isAddress } from '@ethersproject/address';
import { groStatsError } from '../parser/groStats/groStatsError';
import { botStatusError } from '../parser/botStatus/botStatusError';
import { etlPersonalStats } from '../etl/etlPersonalStats';
import { sendErrorAndResponse } from './sendAlertAndResponse';
import { botStatusHandler } from '../handler/botStatusHandler';
import { validateApiRequest } from '../caller/validateApiRequest';
import { personalStatsError } from '../parser/personalStats/personalStatsError';
import { historicalApyError } from '../parser/historicalApy/historicalApyError';
import { getHistoricalApy } from '../handler/historicalApyHandler';
import { subgraphStatusHandler } from '../handler/subgraphStatusHandler';
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
} from '../parser/subgraphStatus/subgraphStatus';
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

/// @notice Checks for validation errors in an API request
/// @param req The Express request object to check for validation errors
/// @return A boolean value indicating whether the request has any validation errors
const handleValidationError = (req: Request): boolean => {
    const errors = validationResult(req);
    return (!errors.isEmpty()) ? true : false;
};

/// @notice Handles the /gro_stats_mc API endpoint to retrieve GRO stats from subgraphs
/// @dev API example: http://localhost:3015/subgraph/gro_stats_mc?subgraph=prod_hosted
const groStatsPath = 'routes->subgraph.ts->gro_stats_mc';
router.get(
    '/gro_stats_mc',
    validateApiRequest([
        query('subgraph')
            .trim()
            .notEmpty().withMessage(`field <subgraph> can't be empty`)],
        Route.GRO_STATS_MC,
    ),
    wrapAsync(async (req: Request, res: Response) => {
        const alertCategory = `[WARN] E2 - Get gro stats failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has already been sent, so just exit
            if (handleValidationError(req)) return;

            const { subgraph } = req.query;
            if (Object.values(Subgraph).includes(subgraph as Subgraph)) {
                // address & subgraph fields are correct
                const groStats = await etlGroStats(
                    subgraph as Subgraph,
                );
                if (groStats.gro_stats_mc.status === Status.ERROR) {
                    await sendErrorAndResponse(
                        groStatsPath,
                        groStats.gro_stats_mc.error_msg,
                        alertCategory,
                        res,
                        groStats,
                    );
                } else {
                    res.json(groStats);
                }
            } else if (subgraph) {
                // target subgraph is not correct
                const err_msg = `unknown target subgraph <${subgraph}>`;
                await sendErrorAndResponse(
                    groStatsPath,
                    err_msg,
                    alertCategory,
                    res,
                    groStatsError(now(), err_msg),
                );
            }
        } catch (err) {
            await sendErrorAndResponse(
                groStatsPath,
                err as string,
                alertCategory,
                res,
                groStatsError(now(), err as string),
            );
        }
    })
);

/// @notice Handles the /gro_personal_position_mc API endpoint to retrieve personal position for a specific address from subgraphs
/// @dev API example: http://localhost:3015/subgraph/gro_personal_position_mc?address=0x...&subgraph=prod_studio
const groPersonalPositionPath = 'routes/subgraph.ts->gro_personal_position_mc';
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
        const alertCategory = `[WARN] E1 - Get personal stats failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has already been sent, so just exit
            if (handleValidationError(req)) return;

            const { subgraph, address } = req.query;
            if (Object.values(Subgraph).includes(subgraph as Subgraph)) {
                // check if address is EVM-compatible
                if (!isAddress(address as string)) {
                    const msg = `Invalid EVM-compatible address ${address}`;
                    await sendErrorAndResponse(
                        groPersonalPositionPath,
                        msg,
                        alertCategory,
                        res,
                        personalStatsError(now(), address?.toString() || 'N/A', msg),
                    );
                    return;
                }
                // address & subgraph fields are correct
                const personalStats = await etlPersonalStats(
                    subgraph as Subgraph,
                    address as string,
                );
                if (personalStats.gro_personal_position_mc.status === Status.ERROR) {
                    await sendErrorAndResponse(
                        groPersonalPositionPath,
                        personalStats.gro_personal_position_mc.error_msg,
                        alertCategory,
                        res,
                        personalStats,
                    );
                } else {
                    res.json(personalStats);
                }

            } else if (subgraph) {
                // target subgraph is not correct
                const err_msg = `unknown target subgraph <${subgraph}>`;
                await sendErrorAndResponse(
                    groPersonalPositionPath,
                    err_msg,
                    alertCategory,
                    res,
                    personalStatsError(now(), address?.toString() || 'N/A', err_msg),
                );
            }
        } catch (err) {
            await sendErrorAndResponse(
                groPersonalPositionPath,
                err as string,
                alertCategory,
                res,
                personalStatsError(now(), 'N/A', err as string),
            );
        }
    })
);

/// @notice Handles the /historical_apy API endpoint to retrieve historical APY data for a
///         specific network, attribute, frequency, start time, and end time
/// @dev Only `apy_current` is currently stored in the DB; any other apy will return null values
/// @dev API example: http://localhost:3015/subgraph/historical_apy?network=mainnet&attr=apy_current,apy_current,apy_current&freq=twice_daily,daily,weekly&start=1669913771,1669913771,1669913771&end=1672505771,1672505771,1672505771
const historicalApyPath = 'routes/subgraph.ts->historical_apy';
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
        const alertCategory = `[WARN] E4 - Get historical apy failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has already been sent, so just exit
            if (handleValidationError(req)) return;

            const { attr, freq, start, end } = req.query;
            const historicalApy = await getHistoricalApy(attr, freq, start, end);
            if (historicalApy.historical_stats.status === Status.ERROR) {
                await sendErrorAndResponse(
                    historicalApyPath,
                    historicalApy.historical_stats.error_msg || '',
                    alertCategory,
                    res,
                    historicalApy,
                );
            } else {
                res.json(historicalApy);
            }
        } catch (err) {
            await sendErrorAndResponse(
                historicalApyPath,
                err as string,
                alertCategory,
                res,
                historicalApyError(now(), err as string),
            );
        }
    })
);

/// @notice Handles the /subgraph_status API endpoint to retrieve the status of subgraphs
/// @dev API example: http://localhost:3015/subgraph/status?subgraph=prod_hosted
const subgraphStatusPath = 'routes/subgraph.ts->subgraph_status';
router.get(
    '/subgraph_status',
    wrapAsync(async (req: Request, res: Response) => {
        const alertCategory = `[WARN] E6 - Get subgraph status failed \n${req.originalUrl}`;
        try {
            const status = await subgraphStatusHandler();
            res.json(status);
        } catch (err) {
            await sendErrorAndResponse(
                subgraphStatusPath,
                err as string,
                alertCategory,
                res,
                globalStatus(
                    Status.ERROR,
                    now(),
                    statusNetworkError(err as Error | string),
                ),
            );
        }
    })
);

/// @notice Handles the /bot_status API endpoint to retrieve the status of the bot
/// @dev API example: http://localhost:3015/subgraph/bot_status?subgraph=prod_hosted
const botStatusPath = 'routes->subgraph.ts->bot_status';
router.get(
    '/bot_status',
    validateApiRequest([
        query('subgraph')
            .trim()
            .notEmpty().withMessage(`field <subgraph> can't be empty`)],
        Route.BOT_STATUS,
    ),
    wrapAsync(async (req: Request, res: Response) => {
        // E7 alertCategory is sent from an external service if this API call is not reachable or
        // returns unexpected results
        const alertCategory = `[WARN] E2 - Get gro stats failed \n${req.originalUrl}`;
        try {
            // if errors during validation, response has already been sent, so just exit
            if (handleValidationError(req)) return;

            const { subgraph } = req.query;
            if (Object.values(Subgraph).includes(subgraph as Subgraph)) {
                // address & subgraph fields are correct
                const botStatus = await botStatusHandler(
                    subgraph as Subgraph,
                );
                if (botStatus.bot_status.status === Status.ERROR) {
                    await sendErrorAndResponse(
                        botStatusPath,
                        botStatus.bot_status.error_msg,
                        alertCategory,
                        res,
                        botStatus,
                    );
                } else {
                    res.json(botStatus);
                }
            } else if (subgraph) {
                // target subgraph is not correct
                const err_msg = `unknown target subgraph <${subgraph}>`;
                await sendErrorAndResponse(
                    botStatusPath,
                    err_msg,
                    alertCategory,
                    res,
                    botStatusError(err_msg),
                );
            }
        } catch (err) {
            await sendErrorAndResponse(
                botStatusPath,
                err as string,
                alertCategory,
                res,
                botStatusError(err as string),
            );
        }
    })
);

export default router;
