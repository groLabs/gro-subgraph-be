import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { Status } from './types';
import rateLimit from 'express-rate-limit';
import statsRouter from './routes/subgraph';
import { showError } from './handler/logHandler';
import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import { httpErrorReponse as parseHttpErrorReponse } from './parser/url/httpErrorReponse';


export const app = express();

// prevent non-distributed DoS attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to N requests per windowMs
    handler: (req, res) => {
        const errMsg = `Too many requests from this IP, please try again later at ${req.originalUrl}.`
        res.status(429).json({
            'subgraph_bot': {
                'status': Status.ERROR,
                'error_code': 429,
                'error_msg': errMsg,
            }
        });
        showError('/app.ts->rateLimit()', `${errMsg} IP: ${req.ip}`);
    }
});

// app use setup
app.use(helmet({
    contentSecurityPolicy: false, // Disables Content-Security-Policy header as it's not needed for JSON data
    dnsPrefetchControl: true, // Restricts browsers to pre-fetch DNS requests for performance
    frameguard: true, // Prevents clickjacking attacks
    hidePoweredBy: true, // Hides the X-Powered-By header to avoid revealing server tech
    hsts: true, // Forces client to only use HTTPS
    ieNoOpen: true, // Prevent file downloads opening immediately for IE8+ users
    noSniff: true, // Stops browsers from trying to guess ('sniff') the MIME type
    permittedCrossDomainPolicies: true, // Restricts Adobe Flash and Acrobat from loading data off the site
    referrerPolicy: { policy: 'no-referrer' }, // Prevents referrer header being sent
    xssFilter: true, // Mitigates cross-site scripting attacks
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/subgraph', apiLimiter, cors(), statsRouter);

// catch non-matching routes and forward to error handler
app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError(404, 'Resource not found'));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, _: NextFunction) => {
    const errorCode = err.status || 500;
    const errorMessage = err.message || 'Unknown error';
    const output = parseHttpErrorReponse(
        errorCode,
        errorMessage,
        req.url,
    )
    res.status(errorCode);
    res.send(output);
});
