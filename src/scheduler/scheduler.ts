import { Env } from '../types';
import schedule from 'node-schedule';
import { subgraphStatusHandler } from '../handler/subgraphStatusHandler';
import { etlHistoricalApy } from '../etl/etlHistoricalApy';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

const apyJobSetup = '*/30 * * * *'; // 30 mins
const statusApiSetup = '0 */6 * * *'; // 6 hours
// const apyJobSetup = '*/15 * * * * *'; // 15 secs [for testing]
// const statusApiSetup = '*/15 * * * * *'; // 15 secs [for testing]


/// @notice Executes a job function according to the provided schedule setup
/// @param scheduleSetup A string representing the schedule setup in cron format
/// @param jobName A string representing the name of the job to be executed
/// @param jobFunction A function that returns a promise to be executed at the scheduled time
const scheduleJob = (scheduleSetup: string, jobName: string, jobFunction: () => Promise<any>) => {
    showInfo(`${jobName} job scheduled`);
    schedule.scheduleJob(scheduleSetup, async () => {
        try {
            showInfo(`${jobName} job started`);
            await jobFunction();
            showInfo(`${jobName} job finished`);
        } catch (err) {
            showError(`scheduler/scheduler.ts->${jobName}()`, err);
        }
    });
}

/// @notice Starts the scheduled jobs if running in the production environment
export const startJobs = (): void => {
    if (process.env.NODE_ENV === Env.PROD) {
        scheduleJob(apyJobSetup, 'Historical APY', etlHistoricalApy);
        scheduleJob(statusApiSetup, 'Status API', subgraphStatusHandler);
    }
}
