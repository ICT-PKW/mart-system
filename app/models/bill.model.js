import mongoose from "mongoose";

const Schema = mongoose.Schema;

const billSchema = new Schema({
    billNumber: { type: String, required: true },
    payIn: { type: Number, required: true },
    items: [{ type: Object, required: true }],
    time: { type: Date, required: true },
    status: { type: Number },
    price: { type: Number },
    counter: { type: Number, required: true },
});

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

module.exports = Bill;