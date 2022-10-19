import { MAX_VEST_TIME } from '../constants';
import { IVestingBonus } from '../interfaces/personalStats/IVestingBonus';
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
    console.log('totalGro', totalGro, 'userTotalGro', userTotalGro, 'currentTimeStamp', currentTimeStamp, 'latestStartTime', latestStartTime);
    const lockedGro = totalGro - totalGro * (currentTimeStamp - latestStartTime) / MAX_VEST_TIME;
    const globalEndTime = globalStartTime + MAX_VEST_TIME;
    const totalGroove = (totalLockedAmount * (1 - initUnlockedPercent)) * (globalEndTime - currentTimeStamp) / MAX_VEST_TIME;
    const vestAll = lockedGro * totalBonus / totalGroove;
    const result = {
        "locked_gro": toStr(lockedGro),
        "net_reward": toStr(netReward),
        "rewards": {
            "claim_now": toStr(vestAll * 0.3),
            "vest_all": toStr(vestAll),
        }
    }
    return result;
}
