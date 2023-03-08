import { toStr } from './utils';
import { showError } from '../handler/logHandler';
import { EMPTY_VESTING_AIRDROP } from '../parser/personalStatsEmpty';
import { getVestingAirdropProofsUser } from '../handler/airdropHandler';
import { IVestingBonus } from '../interfaces/personalStats/IVestingBonus';
import { IVestingAirdrop } from '../interfaces/personalStats/IVestingAirdrop';
import {
    NA,
    MAX_VEST_TIME,
    UST_VESTING_AIRDROP as UST_AIR,
} from '../constants';


export const getVestingBonus = (
    totalGro: number,
    netReward: number,
    currentTime: number,
    startTime: number,
    totalLockedAmount: number,
    totalBonus: number,
    globalStartTime: number,
    initUnlockedPercent: number,
): IVestingBonus => {
        let unlockedGro = 0;
        const _endTime = startTime + MAX_VEST_TIME;
        if (_endTime > currentTime) {
            unlockedGro = (totalGro * initUnlockedPercent) / 10000;
            unlockedGro = unlockedGro  + ((totalGro - unlockedGro) * (currentTime - startTime)) / (_endTime - startTime);
        } else {
            unlockedGro = totalGro;
        }
        const globalEndTime = globalStartTime + MAX_VEST_TIME;
        const totalGroove =
            (totalLockedAmount * (1 - initUnlockedPercent)) * (globalEndTime - currentTime) / MAX_VEST_TIME;
        const vestingBalance = totalGro - unlockedGro;
        const vestAll = vestingBalance * totalBonus / totalGroove;
        const result = {
            'locked_gro': toStr(vestingBalance),
            'net_reward': toStr(netReward),
            'rewards': {
                'claim_now': toStr(vestAll * 0.3),
                'vest_all': toStr(vestAll),
            }
        }
    return result;
}

export const getVestingAirdrop = (
    account: string,
    userData: any,
    currentTimestamp: number,
): IVestingAirdrop => {
    try {
        let claimableAmount = 0;
        const vestingAirdrop = getVestingAirdropProofsUser(account);
        if (vestingAirdrop.name === NA) {
            return EMPTY_VESTING_AIRDROP;
        } else {
            const claimedAmount = parseFloat(userData.claimed_amount);
            const totalClaim = parseFloat(userData.total_claim_amount); // If no LogInitialClain, it will be 0
            // Calc claimable amount
            if (userData.claim_initialized) {
                if (currentTimestamp < UST_AIR.END_TIME) {
                    claimableAmount =
                        ((totalClaim * (currentTimestamp - UST_AIR.START_TIME)) /
                            UST_AIR.VESTING_TIME) - claimedAmount;
                } else {
                    claimableAmount = totalClaim - claimedAmount;
                }
            } else {
                if (currentTimestamp < UST_AIR.END_TIME) {
                    claimableAmount =
                        (totalClaim * (currentTimestamp - UST_AIR.START_TIME)) /
                        (UST_AIR.VESTING_TIME);
                } else {
                    claimableAmount = totalClaim;
                }
            }
            // Add claims-based data
            vestingAirdrop.claim_initialized = userData.claim_initialized;
            vestingAirdrop.claimed_amount = userData.claimed_amount;
            vestingAirdrop.claimable_amount = claimableAmount.toString();
            return vestingAirdrop;
        }
    } catch (err) {
        showError('utils/vesting.ts->getVestingAirdrop()', err);
        return EMPTY_VESTING_AIRDROP;
    }
}
