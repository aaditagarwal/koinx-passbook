import mongoose from 'mongoose';

const EthereumPriceSchema = new mongoose.Schema({
    timestamp: {
        type: String,
        required: true
    },
    priceInr: {
        type: Number,
        requred: true
    }
});

export default mongoose.model('ethereum', EthereumPriceSchema);