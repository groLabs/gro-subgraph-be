// if proof files are not available, only the affected section is excluded in personal stats
import fs from 'fs';
import path from 'path';
import { IAirdropProof } from '../interfaces/personalStats/IAirdropProof';
import { EMPTY_VESTING_AIRDROP_PROOF } from '../parser/personalStatsEmpty';
import { IVestingAirdropProof } from '../interfaces/personalStats/IVestingAirdropProof';
import {
    showInfo,
    showError,
    showWarning,
} from '../handler/logHandler';


// Global proof files shared accross the app
let airdropProofs: IAirdropProof[] = [];
let vestingAirdrops: IVestingAirdropProof;

// Global getters
export const getAirdropProofs = () => airdropProofs;
export const getVestingAirdropProofs = () => vestingAirdrops;

// @dev: excludes the first 6 airdrops
export const readAirdropProofs = (): void => {
    try {
        const files = fs.readdirSync(path.join(__dirname, `/../data/airdrops`))
            .sort((a, b) => a.localeCompare(b));
        for (let i = 7; i < files.length; i++) {
            const data = fs.readFileSync(path.join(__dirname, `/../data/airdrops/${files[i]}`), 'utf8');
            airdropProofs.push(JSON.parse(data));
        }
        showInfo(`Airdrop proof files ready! ${files}`);
    } catch (err) {
        showError('etl/etlAirdrops.ts->readAirdropProofs()', err);
        showWarning(
            'etl/etlAirdrops.ts',
            `Section <ethereum->airdrops> not available in personal stats`,
        );
    }
}

export const readVestingAirdropProofs = (): void => {
    try {
        const file = path.join(__dirname, `/../data/vestingAirdrops/airdrop-vesting-ust.json`);
        const data = fs.readFileSync(file, 'utf8');
        vestingAirdrops = JSON.parse(data);
        showInfo(`UST vestingAirdrop proof file ready! ${file}`);
    } catch (err) {
        vestingAirdrops = EMPTY_VESTING_AIRDROP_PROOF;
        showError(
            'etl/etlAirdrops.ts->readVestingAirdropProofs()', err);
        showWarning(
            'etl/etlAirdrops.ts',
            `Section <ethereum->vesting_airdrop> not available in personal stats`,
        );
    }
}
