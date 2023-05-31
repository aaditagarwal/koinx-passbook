import * as express from "express";
import controller from "./controller";

export default express
    .Router()
    .get('/fetchTransactions', controller.fetchTransactions)
    .get('/fetchBalance', controller.fetchBalance)
    .get('/fetchCoins', controller.fetchCoins);