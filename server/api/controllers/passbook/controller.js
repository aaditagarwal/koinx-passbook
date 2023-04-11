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
        } catch(err) {
            next(err);
        }
    }


}

export default new Controller();