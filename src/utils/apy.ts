import { toStr } from './utils';
import { PWRD_APY } from '../constants';


// avoid division by 0
const rekt = {
    'pwrd': toStr(0),
    'gvt': toStr(0),
}

// @dev: preset pwrd apy with G^2, other gain/loss goes to gvt   
export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    trancheApy: number,
) => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0)
        return rekt; 
    const gvt = trancheApy * (1 + u) - (PWRD_APY * u)
    return {
        'pwrd': toStr(PWRD_APY),
        'gvt': toStr(gvt),
    }
}
