import { toStr } from './utils';


// avoid division/s by 0
const rekt = {
    'pwrd': toStr(0),
    'gvt': toStr(0),
}

export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    systemApy: number,
) => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0)
        return rekt;
    // TODO: PWRD will be a fixed apy. Now is 2%. 
    let pwrd = 0.02;
    // Keep pwrd 2% apy, other gain/loss will go to gvt    
    let gvt = systemApy * (1 + u) - (pwrd * u)
    return {
        'pwrd': toStr(pwrd),
        'gvt': toStr(gvt),
    }
}