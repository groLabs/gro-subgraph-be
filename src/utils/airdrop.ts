import { showError } from '../handler/logHandler';
import { IAirdrop } from '../interfaces/personalStats/IAirdrop';
import { getAirdropProofsUser } from '../handler/airdropHandler';
import { IAirdropClaim } from '../interfaces/personalStats/IAirdropClaim';


/// @notice Retrieves airdrop data for a given account and processes airdrop claims
/// @dev Filters out the first Airdrop contract version and updates the airdrop data based on existing claims
/// @param account The account for which to retrieve airdrop data
/// @param airdropClaims An array of IAirdropClaim objects representing the account's airdrop claims
/// @return An array of IAirdrop objects with updated claim data
export const getAirdrops = (
    account: string,
    airdropClaims: IAirdropClaim[],
): IAirdrop[] => {
    try {
        let airdrops = getAirdropProofsUser(account);
        for (let i = 0; i < airdrops.length; i++) {
            // Exclude first Airdrop contract version
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
        showError('utils/airdrop.ts->getAirdrops()', err);
        return [];
    }
}
