import Bill from "@/app/models/bill.model";
import { myRes } from "@/app/utils/myRes";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        const id = params.id;
        const selectedBill = await Bill.findById(id);
        // console.log(selectedBill);
        
        if (!selectedBill) {
            return myRes(false, 404, 'Bill not found');
        }

        return myRes(true, 200, 'Selected Bill', selectedBill);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = params.id;
        const deletedBill = await Bill.findByIdAndDelete(id);

        return myRes(true, 200, 'Deleted Bill', deletedBill);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}