import { IAirdrop } from '../interfaces/personalStats/IAirdrop';
import { IAirdropClaim } from '../interfaces/personalStats/IAirdropClaim';
import { getAirdropProofsUser } from '../handler/airdropHandler';


export const getAirdrops = (
    account: string,
    airdropClaims: IAirdropClaim[],
): IAirdrop[] => {
    let airdrops = getAirdropProofsUser(account);
    for (let i = 0; i < airdrops.length; i++) {
        // TODO: replace contract by constant, explain why
        const claim = airdropClaims.find(
            (item: IAirdropClaim) =>
                item.tranche_id === i
                && item.contract_address !== '0x6b1bff72f00cc147b5dc7a5b156fe7a6fd206dda'
        );
        if (claim) {
            airdrops[i].claimed = 'true';
            airdrops[i].amount = claim.amount;
            airdrops[i].hash = claim.id.split('-')[0];
            airdrops[i].proofs = [];
        }
    }
    return airdrops;
}
