import 'winston-daily-rotate-file';
import { createLogger, transports, format } from 'winston';
const { combine, timestamp, printf, errors } = format;
const logFolder = './';


/// @notice Formats the logger output
const logMsgFormat = printf(({ level, message, timestamp, stack }) => {
    return (stack)
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
});

/// @notice Creates a logger to handle logs, exceptions, and rejections using the Winston library
/// @dev Configures daily rotating file transports for logging with custom formatting, 
///      log retention, and file rotation settings
/// @return A Winston logger instance with the specified configuration
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

logger.add(
    new transports.Console({
        format: logMsgFormat,
    })
);
