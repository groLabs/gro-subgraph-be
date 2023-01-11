import schedule from 'node-schedule';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

// const apyJobSetup = '*/5 * * * *'; // 5 mins
const apyJobSetup = '*/10 * * * * *'; // 30 sec


const historicalApyJob = async () => {
    showInfo('Historical APY job scheduled');
    schedule.scheduleJob(apyJobSetup, async () => {
        try {
            showInfo('Historical APY job started');
            console.log('heyoooo');
            showInfo('Historical APY job finished');
        } catch (err) {
            showError('scheduler/scheduler.ts->apyJob()', err);
        }
    });
}

export const startJobs = async () => {
    historicalApyJob();
}
