import axios from 'axios';
import {TRANSACTION_URL, ETHEREUM_API_KEY, ETHEREUM_URL, COINS_URL} from "./../../common/config"
import l from "./../../common/logger"

class ApiService{
    async fetchTransactionsApi(userAddress) {
        try {
            const response = await axios.get(
                TRANSACTION_URL,
                {params:{
                    module:     "account",
                    action:     "txlist",
                    address:    userAddress,
                    startblock: 0,
                    endblock:   99999999,
                    page:       1,
                    offset:     10,
                    sort:       "asc",
                    apikey:     ETHEREUM_API_KEY
                }}
            );
            return response?.data?.result;
        } catch(error) {
                throw error;
        }
    }

    async fetchEthereumPriceApi() {
        try{
            const response = await axios.get(
                ETHEREUM_URL,
                {params: {
                    ids: "ethereum",
                    vs_currencies: "inr"
                }}
            );
            return response?.data;
        } catch(error)  {
            throw error;
        }
    }

    async fetchCoinsApi() {
        try{
            const response = await axios.get(
                COINS_URL,
                {params: {
                    vs_currency : "inr",
                    order : "market_cap_desc",
                    per_page : 1000,
                    page : 1,
                    sparkline : false,
                    locale : "en"
                }}
            )
            return response?.data;
        } catch(error) {
            throw error;
        };
    }
}


export default new ApiService();