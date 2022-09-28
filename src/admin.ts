import { etlPersonalStatsSubgraph } from './etl/etlSubgraph';

(async () => {
    try {
        const params: string[] = process.argv.slice(2);

        if (params.length > 0) {
            switch (params[0]) {
                case 'getPersonalStats':
                    // Example eth:     0x60ff7dcb4a9c1a89b18fa2d1bb9444143bbea9bd
                    // Example avax:    0x2ce1a66f22a2dc6e410d9021d57aeb8d13d6bfef
                    if (params.length === 2) {
                        await etlPersonalStatsSubgraph(
                            params[1],
                            0,
                            []
                        );
                    } else {
                        console.log(`Wrong parameters for getPersonalStats - e.g. getPersonalStats <account>`);
                    }
                    break;
                default:
                    console.log(`Unknown parameter/s: ${params}`);
                    break;
            }
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
