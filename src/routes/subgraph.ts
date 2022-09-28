import express, { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { validate } from '../common/validate';
// import { ParameterError } from '../../common/error';
import {
    showInfo,
    showError,
} from '../handler/logHandler';
import { etlPersonalStatsSubgraph } from '../etl/etlSubgraph';


const router = express.Router();

const wrapAsync = function wrapAsync(fn: any) {
    return function wrap(req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(next);
    };
};

// E.g.: http://localhost:3010/database/gro_personal_position_mc?network=mainnet&address=0x2ce1a66f22a2dc6e410d9021d57aeb8d13d6bfef
router.get(
    '/gro_personal_position_mc',
    validate([
        query('network')
            .trim()
            .notEmpty()
            .withMessage(`network can't be empty`),
        query('address')
            .notEmpty()
            .withMessage(`address can't be empty`)
            .isLength({ min: 42, max: 42 })
            .withMessage('address must be 42 characters long')
            .matches(/^0x[A-Za-z0-9]{40}/)
            .withMessage('should be a valid address and start with "0x"'),
    ]),
    wrapAsync(async (req: Request, res: Response) => {
        try {
            let { network, address } = req.query;
            network = network || '';
            const personalStats = await etlPersonalStatsSubgraph(
                address as string,
                0,
                []);
            res.json(personalStats);
        } catch (err) {
            showError('routes->database.ts on /gro_personal_position_mc', err);
            res.json({
                "gro_personal_position_mc": {
                    status: 'error',
                    data: err,
                }
            });
        }
    })
);

export default router;


