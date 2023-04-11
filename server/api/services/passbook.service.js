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
    };

    /**
    * Fetch Current balance of the user and teh current INR price of ethereum
    * @param {string} address - crypto wallet address of the user
    */
    async fetchBalanceService(userAddress) {
        var result = {};
        try{
            // Latest Fetched Ethereum Price
            const ethereumPriceObject = await ethereum.find().limit(1).sort({$natural: -1});
            result = {...result, "Price": ethereumPriceObject[0]?.price, "timestamp": ethereumPriceObject[0]?.timestamp};
            Promise.all([ethereumPriceObject]);

            // Calculate Balance of the curretn user
            console.log({"balanceObject":this.balance})
            if(this.balance.hasOwnProperty(userAddress)){ // Balance calculated
                l.info("userAddress found in this.balance");
                const addressCollection = createCollectionIfNotExists(userAddress);
                const TransactionPromise = await addressCollection.find({ timeStamp: { $gt: new Date(this.balance?.userAddress?.timestamp) } });;
                Promise.all([TransactionPromise]);
                var balanceValue = 0;
                var timestamp = this.balance?.userAddress?.timestamp;
                TransactionPromise.forEach((transactionRecord) => {
                    if(transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
                    else if(transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
                    timestamp = Math.max(timestamp, transactionRecord?.timeStamp);                    
                });
                this.balance = {
                    ...this.balance,
                    userAddress: {
                        balanceValue: this.balance?.userAddress?.balanceValue + balanceValue,
                        timestamp
                    }
                };
                result = {...result, "Balance": this.balance?.userAddress?.balanceValue};
            }else{ // Calculating Balance for the first time
                l.info("userAddress NOT found in this.balance");
                const addressCollection = createCollectionIfNotExists(userAddress);
                const TransactionPromise = await addressCollection.find({});;
                Promise.all([TransactionPromise]);
                var balanceValue = 0;
                var timestamp = null;
                TransactionPromise.forEach((transactionRecord) => {
                    if(transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
                    else if(transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
                    timestamp = Math.max(timestamp, transactionRecord?.timeStamp);        
                });
                this.balance = {
                    ...this.balance,
                    userAddress: {
                        timestamp,
                        balanceValue
                    }
                };
                result = {...result, "Balance": balanceValue};
            }
        } catch (err) {
            throw err;
        }
        return result;
    };

}

export default new PassbookService();