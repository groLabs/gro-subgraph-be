import { DAYS_GVT_APY } from './constants';
import { getBlockNumbers } from './caller/blockCaller';
import { etlPersonalStats } from './etl/etlPersonalStats';
import { etlHistoricalApy } from './etl/etlHistoricalApy';
import { sendDiscordMessage } from './handler/discordHandler';
import { getAirdropProofsUser } from './handler/airdropHandler';
import { subgraphStatusHandler } from './handler/subgraphStatusHandler';
import {
    Subgraph,
    DiscordAlert,
} from './types';
import {
    readAirdropProofs,
    readVestingAirdropProofs,
} from './etl/etlAirdrops';

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
                case 'discord':
                    await sendDiscordMessage(
                        DiscordAlert.BOT_ALERT,
                        '[X] Test alert',
                        'no error description'
                    );
                    break;
                case 'status':
                    const status = await subgraphStatusHandler();
                    console.log(status);
                    break;
                case 'block':
                    const data = await getBlockNumbers(DAYS_GVT_APY);
                    console.log(data);
                    break;
                default:
                    console.log(`Unknown parameter/s: ${params}`);
                    break;
            }
        } else {
            console.log('missing params');
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
