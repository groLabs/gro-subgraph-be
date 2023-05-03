import {
    Route,
    Status,
} from '../types';
import { now } from '../utils/utils';
import { groStatsError } from '../parser/groStatsError';
import { botStatusError } from '../parser/botStatusError';
import { personalStatsError } from '../parser/personalStatsError';
import { historicalApyError } from '../parser/historicalApyError';
import {
    ValidationChain,
    validationResult,
} from 'express-validator';
import {
    Request,
    Response,
    NextFunction,
} from 'express';


/// @notice Sends an error response based on the provided route and errors
/// @param res the Response object
/// @param route the Route enum value
/// @param errors a string containing the error messages
const sendErrorResponse = (
    res: Response,
    route: Route,
    errors: string
) => {
    switch (route) {
        case Route.GRO_STATS_MC:
            res.status(400).json(groStatsError(now(), errors));
            break;
        case Route.GRO_PERSONAL_POSITION_MC:
            res.status(400).json(personalStatsError(now(), 'N/A', errors));
            break;
        case Route.HISTORICAL_APY:
            res.status(400).json(historicalApyError(now(), errors));
            break;
        case Route.BOT_STATUS:
            res.status(400).json(botStatusError(errors));
            break;
        default:
            res.status(400).json({
                'status': Status.ERROR,
                'error_msg': 'unknown route to send error response',
            });
    }
};

/// @notice Validates an API request based on the provided validation chain and route
/// @param validations an array of ValidationChain objects for request validation
/// @param route the Route enum value
/// @return an asynchronous middleware function for Express.js
export const validateApiRequest = (
    validations: ValidationChain[],
    route: Route,
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        sendErrorResponse(res, route, JSON.stringify(errors));
        return next();
    }
}
