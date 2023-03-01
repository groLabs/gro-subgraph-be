import { showError } from '../handler/logHandler';
import { IAirdrop } from '../interfaces/personalStats/IAirdrop';
import { getAirdropProofsUser } from '../handler/airdropHandler';
import { IAirdropClaim } from '../interfaces/personalStats/IAirdropClaim';


export const getAirdrops = (
    account: string,
    airdropClaims: IAirdropClaim[],
): IAirdrop[] => {
    try {
        let airdrops = getAirdropProofsUser(account);
        for (let i = 0; i < airdrops.length; i++) {
            // Exclude first version of Airdrop contracts
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
    } catch (err) {
        showError(
            '/utils/airdrop.ts',
            `getAirdrops(): ${err}`,
        );
        return [];
    }
}
