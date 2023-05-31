import mongoose from 'mongoose';

const EthereumPriceSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  price: {
    type: Object,
    required: true
  }
});

export default mongoose.model('ethereumPriceModel', EthereumPriceSchema);