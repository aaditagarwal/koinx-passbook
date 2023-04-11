import axios from 'axios';
import {TRANSACTION_URL, ETHEREUM_API_KEY, ETHEREUM_URL} from "./../../common/config"
import l from "./../../common/logger"

class ApiService{
    async fetchTransactionsApi(userAddress) {
        return new Promise((resolve, reject) => {
            axios.get(
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
            )
            .then(function (apiResponse) {
                resolve(apiResponse?.data?.result);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    async fetchEthereumPriceApi() {
        return new Promise((resolve, reject) => {
            axios.get(
                ETHEREUM_URL,
                {params: {
                    ids: "ethereum",
                    vs_currencies: "inr"
                }}
            )
            .then(function (response) {
                resolve(response?.data);
            })
            .catch((err) => {
                reject(err);
            });
        })
    }
}

export default new ApiService();