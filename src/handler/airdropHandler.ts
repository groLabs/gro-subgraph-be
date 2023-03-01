import moment from 'moment';
import { bnToDecimal } from '../utils/utils';
import { BigNumber as BN } from 'bignumber.js';
import { showError } from '../handler/logHandler';
import { IAirdrop } from '../interfaces/personalStats/IAirdrop';
import { IVestingAirdrop } from '../interfaces/personalStats/IVestingAirdrop';
import {
    getAirdropProofs,
    getVestingAirdropProofs,
} from '../etl/etlAirdrops';


// TODO: try/catch
// TODO: if no file, then xx
// TODO: check if ggetAirdropProofs returns data; otherwise, return empty airdrops
export const getAirdropProofsUser = (userAddress: string): IAirdrop[] => {
    try {
        let result: IAirdrop[] = [];
        const airdrops = getAirdropProofs();
        for (let i = 0; i < airdrops.length; i++) {
            // search user in proofs in case-insensitively 
            const proofs = airdrops[i].proofs;
            const user = proofs[Object.keys(proofs).find(key => key.toLowerCase() === userAddress)!];
            const expired = moment.unix(parseInt(airdrops[i].expiry_ts)).isAfter(moment().unix())
                ? true
                : false;
            const amount = user
                ? bnToDecimal(BN(user.amount), 18, 2).toString()
                : '0';
            const airdrop: IAirdrop = {
                'amount': amount,
                'amount_to_claim': user ? user.amount : '0',
                'claimable': expired ? 'false' : 'true', // todo: or if already claimed
                'claimed': 'false',
                'display_name': airdrops[i].display_name,
                'expired': expired ? 'true' : 'false',
                'expiry_ts': airdrops[i].expiry_ts,
                'hash': '',
                'launch_ts': airdrops[i].timestamp,
                'merkle_root_index': airdrops[i].merkleIndex,
                'name': airdrops[i].name,
                'participated': user ? 'true' : 'false', // TBC: Assumes 'participated' means being in the airdrop list even if didn't claim
                'proofs': user ? user.proof : [], // todo: empty if already claimed
                'token': airdrops[i].token,
            }
            result.push(airdrop);
        }
        return result;
    } catch (err) {
        showError(
            '/handler/airdropHandler.ts',
            `getAirdropProofsUser(): ${err} for user ${userAddress} -> Airdrops section excluded.`,
        );
        return [];
    }
}

// TODO: same checks as getAirdrops
export const getVestingAirdropProofsUser = (userAddress: string): IVestingAirdrop => {
    const proofs = getVestingAirdropProofs();
    for (let i = 0; i < proofs.airdrops.length; i++) {
        const user = proofs.airdrops[i];
        if (user.address === userAddress) {
            return {
                'name': proofs.name,
                'amount': user.amount,
                'claim_initialized': '',
                'claimed_amount': '',
                'claimable_amount': '',
                'proofs': user.proofs,
                'token': proofs.token,
            }
        }
    }
    return {
        'name': proofs.name,
        'amount': '0',
        'claim_initialized': 'false',
        'claimed_amount': '0',
        'claimable_amount': '0',
        'proofs': [],
        'token': proofs.token,
    }
}