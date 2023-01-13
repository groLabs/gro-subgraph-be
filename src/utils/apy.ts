import { toStr } from './utils';


// avoid division/s by 0
const rekt = {
    'pwrd': toStr(0),
    'gvt': toStr(0),
}

// @dev: Pwrd APY set to fixed 2% with G^2
export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    trancheApy: number,
) => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0)
        return rekt;
    let pwrd = 0.02;
    // Keep pwrd 2% apy, other gain/loss will go to gvt    
    let gvt = trancheApy * (1 + u) - (pwrd * u)
    return {
        'pwrd': toStr(pwrd),
        'gvt': toStr(gvt),
    }
}