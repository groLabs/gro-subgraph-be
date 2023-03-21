import { Route } from '../types';
import { now } from '../utils/utils';
import { groStatsError } from '../parser/groStatsError';
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
    }
};

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
