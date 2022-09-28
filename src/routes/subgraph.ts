import express, { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { validate } from '../common/validate';
import {
    showInfo,
    showError,
} from '../handler/logHandler';
import { etlPersonalStatsSubgraph } from '../etl/etlSubgraph';
import { Subgraph } from '../types';


const router = express.Router();

const wrapAsync = function wrapAsync(fn: any) {
    return function wrap(req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(next);
    };
};

// E.g.: http://localhost:3010/database/gro_personal_position_mc?subgraph=eth_prod_hosted&address=0x2ce1a66f22a2dc6e410d9021d57aeb8d13d6bfef
router.get(
    '/gro_personal_position_mc',
    validate([
        query('subgraph')
            .trim()
            .notEmpty()
            .withMessage(`field <subgraph> can't be empty`),
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
            const { subgraph, address } = req.query;
            if ((<any>Object).values(Subgraph).includes(subgraph)) {
                const personalStats = await etlPersonalStatsSubgraph(
                    subgraph as Subgraph,
                    address as string,
                    0,
                    []);
                res.json(personalStats);
            } else if (subgraph) {
                const err_msg = `unknown target subgraph <${subgraph}>`;
                showError('routes->subgraph.ts on /gro_personal_position_mc', err_msg);
                res.json({
                    "gro_personal_position_mc": {
                        status: 'error',
                        data: err_msg,
                    }
                });
            }
        } catch (err) {
            showError('routes->subgraph.ts on /gro_personal_position_mc', err);
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


