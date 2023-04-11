import ApiService from "./api.service";
import {createCollectionIfNotExists} from "./../../models/transaction"
import ethereum from "./../../models/ethereumPrice"
import l from "../../common/logger";

class PassbookService {
    
    /**
    * Fetch transactions of a user and store in MongoDB
    * @param {string} address - crypto wallet address of the user
    */
    async fetchTransactionsService(address){
        var transactionsArray;
        try{
            await ApiService.fetchTransactionsApi(address)
            .then((apiResponse) => {
                transactionsArray = apiResponse;
            })
            .catch((error) => {
                throw error;
            });
            const addressCollection = createCollectionIfNotExists(address);
            const TransactionPromise = addressCollection.insertMany(transactionsArray);
            Promise.all([TransactionPromise]);
            return {transactionsArray: transactionsArray};
        } catch(err) {
            throw err;
        }
    };

    /**
    * Fetch Ethereum Price in INR
    */ 
    async fetchEthereumPriceService() {
        var ethereumPriceObject = {};
        try {
            await ApiService.fetchEthereumPriceApi()
            .then((apiResponse) => {
                ethereumPriceObject = {"price": apiResponse};
            })
            .catch((error) => {
                throw error;
            });
            ethereumPriceObject = {...ethereumPriceObject, "timestamp": new Date().toISOString()};
            l.info({ethereumPriceObject})
            const ethereumPromise = await ethereum.insertMany(ethereumPriceObject);
            console.log({ethereumPromise});
            Promise.all([ethereumPromise]);
            return ethereumPriceObject;
        } catch (error) {
            throw error;
        }
    }

    

}

export default new PassbookService();