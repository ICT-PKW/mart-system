import mongoose from "mongoose";

const Schema = mongoose.Schema;

const counterSchema = new Schema({
    last_open: { type: Date, required: true },
    salary: { type: Number, required: true },
    counter: { type: Number, required: true },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

module.exports = Counter;