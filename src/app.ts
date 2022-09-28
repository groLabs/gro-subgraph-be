//('dotenv').config();
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
import cors from 'cors';
// import { SettingError, ParameterError, ContractCallError } from '../common/error';
// import { sendMessage, DISCORD_CHANNELS } from '../common/discord/discordService';
import statsRouter from './routes/subgraph';
// import { startDbStatsJobs } from './scheduler/dbStatsScheduler';
// const customLogger = require('./databaseLogger');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// app use setup
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/subgraph', cors(), statsRouter);
// app.use('/database', cors(), statsRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // res.status(500).json({ message: `${error.name} : ${error.message}` });
    // next(error);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
