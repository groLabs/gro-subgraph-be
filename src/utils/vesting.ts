import { toStr } from './utils';
import {
    MAX_VEST_TIME,
    UST_VESTING_AIRDROP as UST_AIR,
} from '../constants';
import { IVestingBonus } from '../interfaces/personalStats/IVestingBonus';
import { IVestingAirdrop } from '../interfaces/personalStats/IVestingAirdrop';
import { getVestingAirdropProofsUser } from '../handler/airdropHandler';


export const getVestingBonus = (
    totalGro: number,
    netReward: number,
    userTotalGro: number,
    currentTimeStamp: number,
    latestStartTime: number,
    totalLockedAmount: number,
    totalBonus: number,
    globalStartTime: number,
    initUnlockedPercent: number,
): IVestingBonus => {
    // console.log('totalGro', totalGro, 'userTotalGro', userTotalGro, 'currentTimeStamp', currentTimeStamp, 'latestStartTime', latestStartTime);
    const lockedGro = totalGro - totalGro * (currentTimeStamp - latestStartTime) / MAX_VEST_TIME;
    const globalEndTime = globalStartTime + MAX_VEST_TIME;
    const totalGroove = (totalLockedAmount * (1 - initUnlockedPercent)) * (globalEndTime - currentTimeStamp) / MAX_VEST_TIME;
    const vestAll = lockedGro * totalBonus / totalGroove;
    const result = {
        'locked_gro': toStr(lockedGro),
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
    let claimableAmount = 0;
    const vestingAirdrop = getVestingAirdropProofsUser(account);
    const claimedAmount = parseFloat(userData.claimed_amount);
    const totalClaim = parseFloat(userData.total_claim_amount); // If no LogInitialClain, it will be 0
    // Calc claimable amount
    console.log('totalClaim',totalClaim,'currentTimestamp',currentTimestamp,'claimedAmount',claimedAmount);
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
    // Add user data based on claims
    vestingAirdrop.claim_initialized = userData.claim_initialized;
    vestingAirdrop.claimed_amount = userData.claimed_amount;
    vestingAirdrop.claimable_amount = claimableAmount.toString();
    return vestingAirdrop;
}
