import schedule from 'node-schedule';
import { etlHistoricalApy } from '../etl/etlHistoricalApy';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

const apyJobSetup = '*/30 * * * *'; // mins
// const apyJobSetup = '*/15 * * * * *'; // secs [for testing]


const historicalApyJob = async () => {
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

export const startJobs = async () => {
    //historicalApyJob();
}
