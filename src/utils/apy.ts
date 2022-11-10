import { toStr } from './utils';


export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    systemApy: number,
) => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0)
        return rekt;
    let gvt = 0;
    let pwrd = 0;

    if (u > 1) {
        pwrd = 0;
        gvt = (systemApy * tvlGvt) / (tvlGvt + tvlPwrd);
    } else if (u > 0.8) {
        pwrd = systemApy * (1 - (0.6 + (u - 0.8) * 2));
        gvt = (systemApy * tvlGvt + (tvlPwrd * systemApy * (0.6 + (u - 0.8) * 2))) / tvlGvt;
    } else {
        pwrd = systemApy * (1 - (0.3 + (u * 3 / 8)));
        gvt = (systemApy * tvlGvt + (tvlPwrd * systemApy * (0.3 + (u * 3 / 8)))) / tvlGvt;
    }

    return {
        'pwrd': toStr(pwrd),
        'gvt': toStr(gvt),
    }
}

// avoid division/s by 0
const rekt = {
    'pwrd': toStr(0),
    'gvt': toStr(0),
}
