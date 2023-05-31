import ApiService from "./api.service";
import {createCollectionIfNotExists} from "./../../models/transaction"
import ethereum from "./../../models/ethereumPrice"
import l from "../../common/logger";

class PassbookService {

    constructor() {
        this.balance = {};
    }
    
    /**
    * Fetch transactions of a user and store in MongoDB
    * @param {string} address - crypto wallet address of the user
    */
    async fetchTransactionsService(address){
        let transactionsArray;
        try{
            const apiResponse = await ApiService.fetchTransactionsApi(address);
            transactionsArray = apiResponse;

            const addressCollection = createCollectionIfNotExists(address);
            const TransactionPromise = addressCollection.insertMany(transactionsArray);
            // Promise.all([TransactionPromise]);
            
            return transactionsArray;
        } catch(error) {
            throw error;
        }
    };

    /**
    * Fetch Ethereum Price in INR
    */ 
    async fetchEthereumPriceService() {
        let ethereumPriceObject = {};
        try {
            const apiResponse = await ApiService.fetchEthereumPriceApi()
            ethereumPriceObject = {"price": apiResponse};
            ethereumPriceObject = {...ethereumPriceObject, "timestamp": new Date().toISOString()};

            const ethereumPromise = await ethereum.insertMany(ethereumPriceObject);
            // Promise.all([ethereumPromise]);
            
            return ethereumPriceObject;
        } catch (error) {
            throw error;
        }
    };

    /**
    * Fetch Current balance of the user and teh current INR price of ethereum
    * @param {string} address - crypto wallet address of the user
    */
    async fetchBalanceService(userAddress) {
        let result = {};
        try{
            // Latest Fetched Ethereum Price
            const ethereumPriceObject = await ethereum.find().limit(1).sort({$natural: -1});
            result = {...result, "Price": ethereumPriceObject[0]?.price, "timestamp": ethereumPriceObject[0]?.timestamp};
            // Promise.all([ethereumPriceObject]);

            // Calculate Balance of the curretn user
            if(this.balance.hasOwnProperty(userAddress)){ // Balance calculated
                const addressCollection = createCollectionIfNotExists(userAddress);
                const TransactionPromise = await addressCollection.find({ timeStamp: { $gt: this.balance[userAddress]?.timestamp } });;
                // Promise.all([TransactionPromise]);

                let balanceValue = 0;
                let timestamp = this.balance[userAddress]?.timestamp;
                TransactionPromise.forEach((transactionRecord) => {
                    if(transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
                    else if(transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
                    timestamp = Math.max(timestamp, transactionRecord?.timeStamp);                    
                });

                this.balance[userAddress]= {
                    balanceValue: this.balance[userAddress]?.balanceValue + balanceValue,
                    timestamp
                };
                result = {...result, "Balance": this.balance[userAddress]?.balanceValue};
            }else{ // Calculating Balance for the first time
                const addressCollection = createCollectionIfNotExists(userAddress);
                const TransactionPromise = await addressCollection.find({});;
                // Promise.all([TransactionPromise]);

                var balanceValue = 0;
                var timestamp = null;
                TransactionPromise.forEach((transactionRecord) => {
                    if(transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
                    else if(transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
                    timestamp = Math.max(timestamp, transactionRecord?.timeStamp);        
                });

                this.balance[userAddress] = {
                    timestamp,
                    balanceValue
                };
                result = {...result, "Balance": balanceValue};
            }
            return result;
        } catch (err) {
            throw err;
        }
    };

    /**
     * Fetch Top 1000 Coins by marketcap. 
     */
    async fetchCoins() {
        try{
            const apiResponse = await ApiService.fetchCoinsApi()
            return apiResponse;
        } catch(error) {
            throw error;
        };
    }

}

export default new PassbookService();