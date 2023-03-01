import fs from 'fs';
import path from 'path';
import { IAirdropProof } from '../interfaces/personalStats/IAirdropProof';
import { IVestingAirdropProof } from '../interfaces/personalStats/IVestingAirdropProof';

let airdropProofs: IAirdropProof[] = [];
let vestingAirdrops: IVestingAirdropProof;

export const getAirdropProofs = () => airdropProofs;
export const getVestingAirdropProofs = () => vestingAirdrops;

// todo: if files are not found, just go ahead without proofs
// todo: capture exceptions when reading
// @dev: excludes the first 6 airdrops
export const readAirdropProofs = (): void => {
    try {
        const files = fs.readdirSync(path.join(__dirname, `/../data/airdrops`));
        files.sort((a, b) => a.localeCompare(b));
        for (let i=7; i<files.length; i++) {
            const data = fs.readFileSync(path.join(__dirname, `/../data/airdrops/${files[i]}`), 'utf8');
            airdropProofs.push(JSON.parse(data));
        }
    } catch (err) {
        console.log(err);
    }
}

// todo: if files are not found, just go ahead without proofs
// todo: capture exceptions when reading
export const readVestingAirdropProofs = (): void => {
    try {
        const file = 'airdrop-vesting-ust.json';
        const data = fs.readFileSync(path.join(__dirname, `/../data/vestingAirdrops/${file}`), 'utf8');
        vestingAirdrops = JSON.parse(data);

    } catch (err) {
        console.log(err);
    }
}
