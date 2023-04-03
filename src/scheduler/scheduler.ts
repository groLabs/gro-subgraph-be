import { Env } from '../types';
import schedule from 'node-schedule';
import { etlHistoricalApy } from '../etl/etlHistoricalApy';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

const apyJobSetup = '*/30 * * * *'; // mins
// const apyJobSetup = '*/15 * * * * *'; // secs [for testing]


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

/// @notice Starts the scheduled jobs if running in the production environment
export const startJobs = async (): Promise<void> => {
    if (process.env.NODE_ENV === Env.PROD) {
        historicalApyJob();
    }
}
