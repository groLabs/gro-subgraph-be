// const botEnv = process.env.BOT_ENV.toLowerCase();
// const logger = require(`../../${botEnv}/${botEnv}Logger`);

// const showInfo = (
//     msg: string
// ) => {
//     logger.info(`**DB: ${msg}`);
// }

// const showWarning = (
//     path: string,
//     warn: any,
// ) => {
//     logger.warn(`**DB: Warning in ${path}: ${warn}`);
// }

// const showError = (
//     path: string,
//     err: any
// ) => {
//     logger.error(`**DB: Error in ${path}: ${err}`);
// }

// export {
//     showInfo,
//     showError,
//     showWarning,
// }

export const showInfo = (msg: string) => {
    console.log(msg);
}

export const showError = (
    path: string,
    err: any
) => {
    console.log(`**DB: Error in ${path}: ${err}`);
}