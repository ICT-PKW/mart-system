import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        title: { type: String, required: true },
        fname: { type: String, required: true },
        lname: { type: String, required: true }
    },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

module.exports = Admin;