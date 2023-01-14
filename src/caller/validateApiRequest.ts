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


export const validateApiRequest = (
    validations: ValidationChain[],
    route: string,
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
        switch (route) {
            case 'gro_stats_mc':
                res.status(400).json(
                    groStatsError(
                        now(),
                        JSON.stringify(errors)
                    ));
                return next();
            case 'gro_personal_position_mc':
                res.status(400).json(
                    personalStatsError(
                        now(),
                        'N/A',
                        JSON.stringify(errors),
                    ));
                return next();
            case 'historical_apy':
                res.status(400).json(
                    historicalApyError(
                        now(),
                        JSON.stringify(errors),
                    ));
                return next();
            default:
                return next();
        }
    }
}
