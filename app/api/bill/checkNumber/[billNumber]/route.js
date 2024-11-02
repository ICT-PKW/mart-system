import Bill from "@/app/models/bill.model";
import { myRes } from "@/app/utils/myRes";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        const billNumber = params.billNumber;
        const selectedBill = await Bill.findOne({ billNumber });
        if (!selectedBill) {
            return myRes(false, 404, 'Bill not found');
        }

        return myRes(true, 200, 'Selected Bill', selectedBill);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}