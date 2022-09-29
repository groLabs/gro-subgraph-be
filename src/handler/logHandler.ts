import { logger } from '../utils/logger';


export const showInfo = (
    msg: string
) => {
    logger.info(`${msg}`);
}

export const showWarning = (
    path: string,
    warn: any,
) => {
    logger.warn(`${path}: ${warn}`);
}

export const showError = (
    path: string,
    err: any
) => {
    logger.error(`${path}: ${err}`);
}
