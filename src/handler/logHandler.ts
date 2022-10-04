import { logger } from '../utils/logger';


export const showInfo = (
    msg: string
): void => {
    logger.info(`${msg}`);
}

export const showWarning = (
    path: string,
    warn: any,
): void => {
    logger.warn(`${path}: ${warn}`);
}

export const showError = (
    path: string,
    err: any
): void => {
    logger.error(`${path}: ${err}`);
}
