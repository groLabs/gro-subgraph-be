import { now } from '../utils/utils';
import { etlGroStats } from '../etl/etlGroStats';
import { showError } from '../handler/logHandler';
import { groStatsError } from '../parser/groStatsError';
import { statusHandler } from '../handler/statusHandler';
import { etlPersonalStats } from '../etl/etlPersonalStats';
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


const router = express.Router();

const wrapAsync = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// E.g.: http://localhost:3015/subgraph/gro_stats_mc?subgraph=prod_hosted
router.get(
    '/gro_stats_mc',
    validateApiRequest([
        query('subgraph')
            .trim()
            .notEmpty().withMessage(`field <subgraph> can't be empty`)],
        Route.GRO_STATS_MC,
    ),
    wrapAsync(async (req: Request, res: Response) => {
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
                    0
                );
                res.json(groStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts->gro_stats_mc', err_msg);
                res.json(groStatsError(
                    now(),
                    err_msg
                ));
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_stats_mc', err);
            res.json(groStatsError(
                now(),
                err as string,
            ));
        }
    })
);

// E.g.: http://localhost:3015/subgraph/gro_personal_position_mc?address=0x60ff7DcB4a9c1a89B18Fa2D1Bb9444143BbEA9BD&subgraph=prod_studio
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
                    0,
                    []);
                res.json(personalStats);
            } else if (subgraph) {
                // subgraph value is incorrect
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts->gro_personal_position_mc', err_msg);
                res.json(personalStatsError(
                    now(),
                    address?.toString() || 'N/A',
                    err_msg
                ));
            }
        } catch (err) {
            showError('routes/subgraph.ts->gro_personal_position_mc', err);
            res.json(personalStatsError(
                now(),
                'N/A',
                err as string,
            ));
        }
    })
);

// e.g.: http://localhost:3015/subgraph/historical_apy?network=mainnet&attr=apy_current,apy_current,apy_current&freq=twice_daily,daily,weekly&start=1669913771,1669913771,1669913771&end=1672505771,1672505771,1672505771
// @dev: only `apy_current` is currently stored in the DB; any other apy will return null values
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
        try {
            // if errors during validation, response has been already sent, so just exit
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return;
            const { attr, freq, start, end } = req.query;
            const groStats = await getHistoricalApy(attr, freq, start, end);
            res.json(groStats);
        } catch (err) {
            showError('routes/subgraph.ts->historical_apy', err);
            res.json(historicalApyError(
                now(),
                err as string,
            ));
        }
    })
);

// E.g.: http://localhost:3015/subgraph/status?subgraph=prod_hosted
router.get(
    '/status',
    wrapAsync(async (_: Request, res: Response) => {
        try {
            const status = await statusHandler();
            res.json(status);
        } catch (err) {
            showError('routes/subgraph.ts->status', err);
            res.json(globalStatus(
                Status.ERROR,
                now(),
                statusNetworkError(err as Error | string),
            ));
        }
    })
);

export default router;
