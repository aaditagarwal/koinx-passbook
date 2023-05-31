import FetchURLService from "./fetchURL.service";
import { getCollectionModel } from "./../../models/transaction"
import ethereumPriceModel from "./../../models/ethereumPrice"
import l from "../../common/logger";

class PassbookService {

  constructor() {
    this.balance = {};
  }

  /**
  * Fetch transactions of a user and store in MongoDB
  * @param {string} address - crypto wallet address of the user
  */
  async fetchTransactions(address) {
    const transactionsArray = await FetchURLService.fetchTransactions(address);

    const addressCollectionModel = getCollectionModel(address);
    await addressCollectionModel.insertMany(transactionsArray);

    return transactionsArray;
  };

  /**
  * Fetch Ethereum Price in INR
  */
  async fetchEthereumPrice() {
    const response = await FetchURLService.fetchEthereumPrice()
    const ethereumPriceObject = { "price": response, "timestamp": new Date().toISOString() };

    await ethereumPriceModel.insertMany(ethereumPriceObject);

    return ethereumPriceObject;
  };

  /**
  * Fetch Current balance of the user and the current INR price of ethereum
  * @param {string} address - crypto wallet address of the user
  */
  async fetchBalance(userAddress) {
    const ethereumPriceObject = await ethereumPriceModel.find().limit(1).sort({ $natural: -1 });
    let result = { "Price": ethereumPriceObject[0]?.price, "timestamp": ethereumPriceObject[0]?.timestamp };

    // Calculate Balance of the re-visiting user
    if (this.balance.hasOwnProperty(userAddress)) {
      const addressCollectionModel = getCollectionModel(userAddress);
      const TransactionsArray = await addressCollectionModel.find({ timeStamp: { $gt: this.balance[userAddress]?.timestamp } });;

      let balanceValue = 0;
      let timestamp = this.balance[userAddress]?.timestamp;
      TransactionsArray.forEach((transactionRecord) => {
        if (transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
        else if (transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
        timestamp = Math.max(timestamp, transactionRecord?.timeStamp);
      });

      this.balance[userAddress] = {
        balanceValue: this.balance[userAddress]?.balanceValue + balanceValue,
        timestamp
      };
      result = { ...result, "Balance": this.balance[userAddress]?.balanceValue };
    }

    // Calculate Balance for the first time user
    else {
      const addressCollectionModel = getCollectionModel(userAddress);
      const TransactionsArray = await addressCollectionModel.find({});;

      var balanceValue = 0;
      var timestamp = null;
      TransactionsArray.forEach((transactionRecord) => {
        if (transactionRecord?.to === userAddress) balanceValue += transactionRecord?.value;
        else if (transactionRecord?.from === userAddress) balanceValue -= transactionRecord?.value;
        timestamp = Math.max(timestamp, transactionRecord?.timeStamp);
      });

      this.balance[userAddress] = {
        balanceValue,
        timestamp
      };
      result = { ...result, "Balance": balanceValue };
    }

    return result;
  };

  /**
   * Fetch Top 1000 Coins by marketcap. 
   */
  async fetchCoins() {
    return await FetchURLService.fetchCoins()
  }

}

export default new PassbookService();