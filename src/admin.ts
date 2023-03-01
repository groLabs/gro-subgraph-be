import { Subgraph } from './types';
import { etlPersonalStats } from './etl/etlPersonalStats';
import { etlHistoricalApy } from './etl/etlHistoricalApy';
import {
    readAirdropProofs,
    readVestingAirdropProofs,
} from './etl/etlAirdrops';
import { getAirdropProofsUser } from './handler/airdropHandler'
// enable dotenv
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
let env = dotenv.config();
dotenvExpand.expand(env);


(async () => {
    try {
        const params: string[] = process.argv.slice(2);
        if (params.length > 0) {
            switch (params[0]) {
                case 'getPersonalStats':
                    if (params.length === 3) {
                        if ((<any>Object).values(Subgraph).includes(params[1])) {
                            await etlPersonalStats(
                                params[1] as Subgraph,
                                params[2],
                                0,
                                []
                            );
                        } else {
                            console.log(`Field <subgraph> must have a valid value (eg.: prod_hosted, test_studio...)`);
                        }
                    } else {
                        console.log(`Wrong parameters for getPersonalStats - e.g. getPersonalStats <subgraph> <account>`);
                    }
                    break;
                case 'airdrop':
                    readAirdropProofs();
                    const result2 = getAirdropProofsUser('0x654Ffa2Eaf122317A25c38169c375e735D6308D4');
                    console.log(result2);
                    break;
                case 'vestingAirdrop':
                    let result = readVestingAirdropProofs();
                    console.dir(result, { depth: null });
                    break;
                default:
                    console.log(`Unknown parameter/s: ${params}`);
                    break;
            }
        } else {
            // try something directly
            await etlHistoricalApy();
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
