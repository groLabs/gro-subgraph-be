import { Env } from '../types';
import schedule from 'node-schedule';
import { statusHandler } from '../handler/statusHandler';
import { etlHistoricalApy } from '../etl/etlHistoricalApy';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

const apyJobSetup = '*/30 * * * *'; // 30 mins
const statusApiSetup = '0 */6 * * *'; // 6 hours
// const apyJobSetup = '*/15 * * * * *'; // 15 secs [for testing]
// const statusApiSetup = '*/15 * * * * *'; // 15 secs [for testing]


/// @notice Schedules a job to retrieve and store historical APY data
const historicalApyJob = async (): Promise<void> => {
    showInfo('Historical APY job scheduled');
    schedule.scheduleJob(apyJobSetup, async () => {
        try {
            showInfo('Historical APY job started');
            await etlHistoricalApy();
            showInfo('Historical APY job finished');
        } catch (err) {
            showError('scheduler/scheduler.ts->historicalApyJob()', err);
        }
    });
}

/// @notice Schedules a job to check the subgraph status
const statusApiJob = async (): Promise<void> => {
    showInfo('Status API job scheduled');
    schedule.scheduleJob(statusApiSetup, async () => {
        try {
            showInfo('Status API job started');
            await statusHandler();
            showInfo('Status API job finished');
        } catch (err) {
            showError('scheduler/scheduler.ts->statusApiJob()', err);
        }
    });
}

/// @notice Starts the scheduled jobs if running in production environment
export const startJobs = async (): Promise<void> => {
    if (process.env.NODE_ENV === Env.PROD) {
        await historicalApyJob();
        await statusApiJob();
    }
}
