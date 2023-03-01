import { MAX_VEST_TIME } from '../constants';
import { IVestingBonus } from '../interfaces/personalStats/IVestingBonus';
import { IVestingAirdrop } from '../interfaces/personalStats/IVestingAirdrop';
import { getVestingAirdropProofsUser } from '../handler/airdropHandler';
import { toStr } from './utils';


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
    claim_initialized: string,
    claimed_amount: string,
    total_claim_amount: string,
): IVestingAirdrop => {
    const proof = getVestingAirdropProofsUser(account);
    const result = {
        'name': proof.name,
        'token': proof.token,
        'amount': total_claim_amount,
        'claim_initialized': claim_initialized,
        'claimed_amount': claimed_amount,
        'claimable_amount': 'x',
        'proofs': proof.proofs,
    }
    return result;
}
