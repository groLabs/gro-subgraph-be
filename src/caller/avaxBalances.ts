import axios from 'axios';
import { wallets } from '../data/avaxWallets/avaxWallets';

const callSubgraph = async (wallet: string) => {
    try {
        const response = await axios.get(
            `https://j8ibm6u3ca.execute-api.eu-west-2.amazonaws.com/subgraph/gro_personal_position_mc?address=${wallet}&subgraph=prod_studio`
        );
        return response;
    } catch (error) {
        console.error('Error calling internal route:', error);
    }
}
export const getAvaxBalances = async () => {
    for (let i = 0; i < wallets.data.users.length; i++) {
        const wallet = wallets.data.users[i].id;
        const res = await callSubgraph(wallets.data.users[i].id);
        const balance = res?.data.gro_personal_position_mc.avalanche.current_balance.total;
        console.log(`${wallet},${balance}`);
    }
}
