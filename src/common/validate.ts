import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

//TODO: change to ES6
const validate = function validate(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json(errors);
        return next();
    };
};

const handle = (promise: Promise<any>) => {
    promise
        .then((data) => [data, undefined])
        .catch((error) => Promise.resolve([undefined, error]));
};

export {
    validate,
    handle,
};
