import ApiService from "./api.service";
import Transactions from "./../../models/transaction"

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
            const TransactionPromise = await Transactions.insertMany(transactionsArray);
            Promise.all([TransactionPromise]);
            return {transactionsArray: transactionsArray};
        } catch(err) {
            throw err;
        }
    };

}

export default new PassbookService();