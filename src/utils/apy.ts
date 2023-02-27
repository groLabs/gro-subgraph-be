import { toStr } from './utils';
import {
    PWRD_APY,
    DEFAULT_AVERAGE_STRATEGY_APY
} from '../constants';


// avoid division by 0
const rekt = {
    'pwrd': toStr(0),
    'gvt': toStr(0),
}

// @dev: 
// - preset pwrd apy with G^2, other gains/losses goes to gvt
// - if no tranche APY (e.g.: GoLive + migration with no harvests yet), 
//   set tranche APY to average Convex strategies APY
export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    trancheApy: number,
) => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0) {
        return rekt;
    } else if (trancheApy === 0) {
        trancheApy = DEFAULT_AVERAGE_STRATEGY_APY;
    }
    const gvt = trancheApy * (1 + u) - (PWRD_APY * u)
    return {
        'pwrd': toStr(PWRD_APY),
        'gvt': toStr(gvt),
    }
}
