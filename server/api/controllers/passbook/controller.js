import PassbookService from "../../services/passbook.service";
import l from "../../../common/logger";

export class Controller {

    constructor() {
        setInterval(PassbookService.fetchEthereumPriceService, 600000);
    }

    async fetchTransactions(req, res, next){
        try{
            const transactions = await PassbookService.fetchTransactionsService(req.query.address);
            res.status(200).json({results: transactions});
        } catch(error) {
            next(error);
        }
    }

    async fetchBalance(req, res, next){
        try{
            const balance = await PassbookService.fetchBalanceService(req.query.address);
            res.status(200).json({results: balance});
        } catch (error) {
            next(error);
        }
    }

    async fetchCoins(req, res, next){
        try{
            const coins = await PassbookService.fetchCoins();
            res.status(200).json({results: coins});
        } catch(error) {
            next(error);
        };
    }

}

export default new Controller();