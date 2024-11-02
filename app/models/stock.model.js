import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stockSchema = new Schema({
    barcode: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);

export default Stock;
