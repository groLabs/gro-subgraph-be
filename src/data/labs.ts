/* Snapshot as of 09.02.2023 in order to get static data while strategies are stopped:
    - APYs
    - Sharpe ratio
    - Sortino ratio
    - Romad ratio
    - Past 5 closed positions
*/
import { EMPTY_AVAX_VAULT } from '../parser/groStatsEmpty';
import { IVault } from '../interfaces/groStats/avalanche/IVault';


export const getLabsData = (vaultName: string): IVault => {
    for (let i = 0; i < labs.length; i++) {
        if (vaultName === labs[i].name)
            return labs[i];
    }
    return EMPTY_AVAX_VAULT;
}

export const labs: IVault[] = [
    {
        "name": "groDAI.e_vault",
        "display_name": "Gro Labs DAI.e AVAX Vault",
        "stablecoin": "DAI.e",
        "amount": "16.1043987",
        "share": "0.012661",
        "all_time_apy": "0.248209",
        "last3d_apy": "0.248627",
        "reserves": {
            "name": "groDAI.e_vault",
            "display_name": "Gro Labs DAI.e AVAX Vault",
            "amount": "16.1043987",
            "share": "0.012661",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_DAI.e_strat",
                "display_name": "DAI.e AH",
                "address": "0x4c7ea5b8032c5ea82ddf617dac7972c70e0c0478",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "51.017631",
                "sortino_ratio": "63.832790",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1646143046",
                        "open_amount": "77862.5500713",
                        "close_ts": "1646147124",
                        "close_amount": "77850.7465039",
                        "apy": "-0.879235"
                    },
                    {
                        "open_ts": "1646147185",
                        "open_amount": "77853.6973957",
                        "close_ts": "1646227104",
                        "close_amount": "77862.0031402",
                        "apy": "0.031604"
                    },
                    {
                        "open_ts": "1646227165",
                        "open_amount": "70004.5392925",
                        "close_ts": "1646307003",
                        "close_amount": "70070.7728996",
                        "apy": "0.315641"
                    },
                    {
                        "open_ts": "1646307024",
                        "open_amount": "62164.5971926",
                        "close_ts": "1646319023",
                        "close_amount": "62152.3972326",
                        "apy": "-0.386538"
                    },
                    {
                        "open_ts": "1646319085",
                        "open_amount": "62204.9293643",
                        "close_ts": "1646332351",
                        "close_amount": "62223.0117991",
                        "apy": "0.466437"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDC.e_vault",
        "display_name": "Gro Labs USDC.e AVAX Vault",
        "stablecoin": "USDC.e",
        "amount": "103.1483840",
        "share": "0.010267",
        "all_time_apy": "0.221052",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDC.e_vault",
            "display_name": "Gro Labs USDC.e AVAX Vault",
            "amount": "103.1483840",
            "share": "0.010267",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDC.e_strat",
                "display_name": "USDC.e AH",
                "address": "0x247af6e106549033d3a65354fc3a72ff3794fa99",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "23.476301",
                "sortino_ratio": "25.460422",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1646152584",
                        "open_amount": "580193.5853270",
                        "close_ts": "1646192907",
                        "close_amount": "580308.7627680",
                        "apy": "0.104792"
                    },
                    {
                        "open_ts": "1646192962",
                        "open_amount": "580279.9684080",
                        "close_ts": "1646205083",
                        "close_amount": "580126.7705500",
                        "apy": "-0.522851"
                    },
                    {
                        "open_ts": "1646205144",
                        "open_amount": "572349.7665960",
                        "close_ts": "1646273603",
                        "close_amount": "572484.4720340",
                        "apy": "0.293860"
                    },
                    {
                        "open_ts": "1646273663",
                        "open_amount": "142714.6471560",
                        "close_ts": "1646319805",
                        "close_amount": "142752.1796630",
                        "apy": "0.121173"
                    },
                    {
                        "open_ts": "1646319865",
                        "open_amount": "142742.7965360",
                        "close_ts": "1646332351",
                        "close_amount": "142793.4375550",
                        "apy": "0.604896"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDT.e_vault",
        "display_name": "Gro Labs USDT.e AVAX Vault",
        "stablecoin": "USDT.e",
        "amount": "2874.9951790",
        "share": "0.011727",
        "all_time_apy": "0.241058",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDT.e_vault",
            "display_name": "Gro Labs USDT.e AVAX Vault",
            "amount": "2874.9951790",
            "share": "0.011727",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDT.e_strat",
                "display_name": "USDT.e AH",
                "address": "0x94a7c3419504cea9fba06ee739717b236ada0638",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "29.816789",
                "sortino_ratio": "33.153213",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1646153364",
                        "open_amount": "543187.8393850",
                        "close_ts": "1646192844",
                        "close_amount": "543322.5875360",
                        "apy": "0.134271"
                    },
                    {
                        "open_ts": "1646192906",
                        "open_amount": "543288.9004980",
                        "close_ts": "1646205144",
                        "close_amount": "543183.8606040",
                        "apy": "-0.379859"
                    },
                    {
                        "open_ts": "1646205206",
                        "open_amount": "535371.0412990",
                        "close_ts": "1646274803",
                        "close_amount": "535559.1121860",
                        "apy": "0.428060"
                    },
                    {
                        "open_ts": "1646274863",
                        "open_amount": "134543.4756850",
                        "close_ts": "1646320047",
                        "close_amount": "134573.1787700",
                        "apy": "0.104111"
                    },
                    {
                        "open_ts": "1646320104",
                        "open_amount": "134565.7529990",
                        "close_ts": "1646332345",
                        "close_amount": "134613.6372080",
                        "apy": "0.618651"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groDAI.e_vault_v1_5",
        "display_name": "Gro Labs DAI.e AVAX Vault v1.5",
        "stablecoin": "DAI.e",
        "amount": "2256.1954227",
        "share": "0.001120",
        "all_time_apy": "0.132761",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groDAI.e_vault_v1_5",
            "display_name": "Gro Labs DAI.e AVAX Vault v1.5",
            "amount": "2256.1954227",
            "share": "0.001120",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_DAI.e_strat_v1_5",
                "display_name": "DAI.e AH v1.5",
                "address": "0xe0d6eff0f64da98b2c0e47102d59709b24cfc76f",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "8.764900",
                "sortino_ratio": "17.646666",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1643019028",
                        "open_amount": "2256.2021778",
                        "close_ts": "1643028085",
                        "close_amount": "2256.2021778",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643028143",
                        "open_amount": "2256.9190839",
                        "close_ts": "1643035227",
                        "close_amount": "2256.9190839",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643035286",
                        "open_amount": "2256.7052711",
                        "close_ts": "1643037024",
                        "close_amount": "2256.7052711",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643037085",
                        "open_amount": "2256.2054365",
                        "close_ts": "1643038405",
                        "close_amount": "2256.2054365",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643038466",
                        "open_amount": "-0.0000000",
                        "close_ts": "1643038527",
                        "close_amount": "-0.0000000",
                        "apy": "0.000000"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDC.e_vault_v1_5",
        "display_name": "Gro Labs USDC.e AVAX Vault v1.5",
        "stablecoin": "USDC.e",
        "amount": "48.9142590",
        "share": "0.000024",
        "all_time_apy": "0.115362",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDC.e_vault_v1_5",
            "display_name": "Gro Labs USDC.e AVAX Vault v1.5",
            "amount": "48.9142590",
            "share": "0.000024",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDC.e_strat_v1_5",
                "display_name": "USDC.e AH v1.5",
                "address": "0x45fa601854326de028b982df9839a27d22f36344",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "0.000000",
                "sortino_ratio": "0.000000",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1642898008",
                        "open_amount": "806650.0256420",
                        "close_ts": "1642898069",
                        "close_amount": "806650.0256420",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1642941628",
                        "open_amount": "806646.3934890",
                        "close_ts": "1642944632",
                        "close_amount": "806646.3934890",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643003375",
                        "open_amount": "806480.1073390",
                        "close_ts": "1643016155",
                        "close_amount": "806480.1073390",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643016202",
                        "open_amount": "806402.4541820",
                        "close_ts": "1643022024",
                        "close_amount": "806402.4541820",
                        "apy": "0.000000"
                    },
                    {
                        "open_ts": "1643022086",
                        "open_amount": "-0.0000010",
                        "close_ts": "1643038226",
                        "close_amount": "-0.0000010",
                        "apy": "0.000000"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDT.e_vault_v1_5",
        "display_name": "Gro Labs USDT.e AVAX Vault v1.5",
        "stablecoin": "USDT.e",
        "amount": "0.0000000",
        "share": "0.000000",
        "all_time_apy": "0.000000",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDT.e_vault_v1_5",
            "display_name": "Gro Labs USDT.e AVAX Vault v1.5",
            "amount": "0.0000000",
            "share": "0.000000",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDT.e_strat_v1_5",
                "display_name": "USDT.e AH v1.5",
                "address": "0xb29380360a44a7630f404c7609114e48fde0ddee",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "0.000000",
                "sortino_ratio": "0.000000",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": []
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groDAI.e_vault_v1_6",
        "display_name": "Gro Labs DAI.e AVAX Vault v1.6",
        "stablecoin": "DAI.e",
        "amount": "0.0000000",
        "share": "0.000000",
        "all_time_apy": "0.000000",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groDAI.e_vault_v1_6",
            "display_name": "Gro Labs DAI.e AVAX Vault v1.6",
            "amount": "0.0000000",
            "share": "0.000000",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_DAI.e_strat_v1_6",
                "display_name": "DAI.e AH v1.6",
                "address": "0xb7a4ed26da881196c3da388b46cd290fd92aacc8",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "0.000000",
                "sortino_ratio": "0.000000",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": []
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDC.e_vault_v1_6",
        "display_name": "Gro Labs USDC.e AVAX Vault v1.6",
        "stablecoin": "USDC.e",
        "amount": "0.0000000",
        "share": "0.000000",
        "all_time_apy": "0.000000",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDC.e_vault_v1_6",
            "display_name": "Gro Labs USDC.e AVAX Vault v1.6",
            "amount": "0.0000000",
            "share": "0.000000",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDC.e_strat_v1_6",
                "display_name": "USDC.e AH v1.6",
                "address": "0x21da4b3b6738adb122dedbfa722cdab6fa29d4ac",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "0.000000",
                "sortino_ratio": "0.000000",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": []
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDT.e_vault_v1_6",
        "display_name": "Gro Labs USDT.e AVAX Vault v1.6",
        "stablecoin": "USDT.e",
        "amount": "0.0000000",
        "share": "0.000000",
        "all_time_apy": "0.000000",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDT.e_vault_v1_6",
            "display_name": "Gro Labs USDT.e AVAX Vault v1.6",
            "amount": "0.0000000",
            "share": "0.000000",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDT.e_strat_v1_6",
                "display_name": "USDT.e AH v1.6",
                "address": "0x9889d8cdcdf4f5a0f30378c909a8930cf0fed2f4",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "0.000000",
                "sortino_ratio": "0.000000",
                "romad_ratio": "0.000000",
                "tvl_cap": "10000000.0000000",
                "open_position": {},
                "past_5_closed_positions": []
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groDAI.e_vault_v1_7",
        "display_name": "Gro Labs DAI.e AVAX Vault v1.7",
        "stablecoin": "DAI.e",
        "amount": "4362.5487075",
        "share": "0.141348",
        "all_time_apy": "0.091660",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groDAI.e_vault_v1_7",
            "display_name": "Gro Labs DAI.e AVAX Vault v1.7",
            "amount": "4362.5487075",
            "share": "0.141348",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_DAI.e_strat_v1_7",
                "display_name": "DAI.e AH v1.7",
                "address": "0x670ea3f675a332d561d5a9ecaa16c097ac0b0ba5",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "-73.525196",
                "sortino_ratio": "-87.764951",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1653655103",
                        "open_amount": "293694.6875321",
                        "close_ts": "1653655288",
                        "close_amount": "293694.9423659",
                        "apy": "0.147909"
                    },
                    {
                        "open_ts": "1653655348",
                        "open_amount": "268858.5565243",
                        "close_ts": "1654087404",
                        "close_amount": "269026.6744536",
                        "apy": "0.043205"
                    },
                    {
                        "open_ts": "1654088064",
                        "open_amount": "242495.9172731",
                        "close_ts": "1654520123",
                        "close_amount": "242066.4248259",
                        "apy": "-0.121282"
                    },
                    {
                        "open_ts": "1654520184",
                        "open_amount": "254031.8584967",
                        "close_ts": "1654589369",
                        "close_amount": "253595.1714021",
                        "apy": "-0.783568"
                    },
                    {
                        "open_ts": "1654589903",
                        "open_amount": "241969.9258505",
                        "close_ts": "1655071466",
                        "close_amount": "239778.6221692",
                        "apy": "-0.573425"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDC.e_vault_v1_7",
        "display_name": "Gro Labs USDC.e AVAX Vault v1.7",
        "stablecoin": "USDC.e",
        "amount": "30835.5794310",
        "share": "0.583427",
        "all_time_apy": "0.078493",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDC.e_vault_v1_7",
            "display_name": "Gro Labs USDC.e AVAX Vault v1.7",
            "amount": "30835.5794310",
            "share": "0.583427",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDC.e_strat_v1_7",
                "display_name": "USDC.e AH v1.7",
                "address": "0xa80ec1e57c5a37517a0f5912acc7b30585ebff56",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "19.973115",
                "sortino_ratio": "76.196812",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1653655230",
                        "open_amount": "667247.9046740",
                        "close_ts": "1654087285",
                        "close_amount": "667221.0593680",
                        "apy": "-0.002915"
                    },
                    {
                        "open_ts": "1654088003",
                        "open_amount": "620087.2910420",
                        "close_ts": "1654520065",
                        "close_amount": "619149.1933670",
                        "apy": "-0.106076"
                    },
                    {
                        "open_ts": "1654520123",
                        "open_amount": "635337.2722010",
                        "close_ts": "1654589369",
                        "close_amount": "634316.1932310",
                        "apy": "-0.731925"
                    },
                    {
                        "open_ts": "1654589844",
                        "open_amount": "610899.5652390",
                        "close_ts": "1654989508",
                        "close_amount": "610082.0562320",
                        "apy": "-0.105098"
                    },
                    {
                        "open_ts": "1654990463",
                        "open_amount": "-111253.8300270",
                        "close_ts": "1655078127",
                        "close_amount": "-96574.0618780",
                        "apy": "8.655805"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    },
    {
        "name": "groUSDT.e_vault_v1_7",
        "display_name": "Gro Labs USDT.e AVAX Vault v1.7",
        "stablecoin": "USDT.e",
        "amount": "7553.4203400",
        "share": "0.255403",
        "all_time_apy": "0.020200",
        "last3d_apy": "0.000000",
        "reserves": {
            "name": "groUSDT.e_vault_v1_7",
            "display_name": "Gro Labs USDT.e AVAX Vault v1.7",
            "amount": "7553.4203400",
            "share": "0.255403",
            "last3d_apy": "0.000000"
        },
        "strategies": [
            {
                "name": "ah_USDT.e_strat_v1_7",
                "display_name": "USDT.e AH v1.7",
                "address": "0x1a104793650684013c555d6ae07058f76e4679ef",
                "amount": "0.0000000",
                "share": "0.000000",
                "last3d_apy": "0.000000",
                "all_time_apy": "0.000000",
                "sharpe_ratio": "14.756008",
                "sortino_ratio": "56.347069",
                "romad_ratio": "0.000000",
                "tvl_cap": "2000000.0000000",
                "open_position": {},
                "past_5_closed_positions": [
                    {
                        "open_ts": "1653655344",
                        "open_amount": "722907.6192100",
                        "close_ts": "1654087403",
                        "close_amount": "721690.0089450",
                        "apy": "-0.122818"
                    },
                    {
                        "open_ts": "1654087763",
                        "open_amount": "709962.3531820",
                        "close_ts": "1654519826",
                        "close_amount": "707010.5303870",
                        "apy": "-0.298534"
                    },
                    {
                        "open_ts": "1654519885",
                        "open_amount": "718746.1186160",
                        "close_ts": "1654589369",
                        "close_amount": "717217.1554260",
                        "apy": "-0.965480"
                    },
                    {
                        "open_ts": "1654590144",
                        "open_amount": "700308.9319810",
                        "close_ts": "1654989508",
                        "close_amount": "699142.0352480",
                        "apy": "-0.129310"
                    },
                    {
                        "open_ts": "1654990824",
                        "open_amount": "-128269.8754120",
                        "close_ts": "1655077405",
                        "close_amount": "-110588.4007890",
                        "apy": "9.076680"
                    }
                ]
            }
        ],
        "avax_exposure": "0.000000"
    }
]