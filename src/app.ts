import path from 'path';
import cors from 'cors';
import statsRouter from './routes/subgraph';
import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import { httpErrorReponse as parseHttpErrorReponse } from './parser/url/httpErrorReponse';


export const app = express();

// app use setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/subgraph', cors(), statsRouter);

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
