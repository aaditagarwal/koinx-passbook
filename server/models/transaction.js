import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    blockNumber:{
        type: String,
        required: true
    },
    timeStamp:{
        type: Number,
        required: true
    },
    hash:{
        type: String,
        required: true,
        index: true,
        unique: true
    },
    nonce:{
        type: Number,
        required: true
    },
    blockHash:{
        type: String,
        required: true
    },
    transactionIndex:{
        type: Number,
        required: true
    },
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    gas:{
        type: Number,
        required: false
    },
    gasPrice:{
        type: Number,
        required: false
    },
    isError:{
        type: Number,
        required: true
    },
    txreceipt_status:{
        type: Number,
        required: true
    },
    input:{
        type: String,
        required: false
    },
    contractAddress:{
        type: String,
        required: false
    },
    cumulativeGasUsed:{
        type: Number,
        required: false
    },
    gasUsed:{
        type: Number,
        required: false
    },
    confirmations:{
        type: Number,
        required: true
    },
    methodId:{
        type: String,
        required: false
    },
    functionName:
    {   type: String,
        required: false
    }
});

TransactionSchema.index({'hash': 1}, {unique:true});

export const createCollectionIfNotExists = (address) => {
    return mongoose.model(address, TransactionSchema);
}