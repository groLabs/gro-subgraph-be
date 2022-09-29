import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, printf, errors } = format;


const logFolder = './';

const logMsgFormat = printf(({ level, message, timestamp, stack }) => {
    return (stack)
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(errors({ stack: true }), timestamp(), logMsgFormat),
    transports: [
        new transports.DailyRotateFile({
            filename: 'subgraph-error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logFolder}/logs`,
            auditFile: 'subgraph-error-audit.json',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
        }),
        new transports.DailyRotateFile({
            filename: 'subgraph-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logFolder}/logs`,
            auditFile: 'subgraph-audit.json',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
        }),
    ],
    exceptionHandlers: [
        new transports.DailyRotateFile({
            filename: 'subgraph-exception-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logFolder}/logs`,
            auditFile: 'subgraph-exception-audit.json',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
        }),
    ],
    rejectionHandlers: [
        new transports.DailyRotateFile({
            filename: 'subgraph-rejection-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logFolder}/logs`,
            auditFile: 'subgraph-rejection-audit.json',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
        }),
    ],
    exitOnError: false,
});


if (process.env.NODE_ENV !== 'prod') {
    logger.add(
        new transports.Console({
            format: logMsgFormat,
        })
    );
}

