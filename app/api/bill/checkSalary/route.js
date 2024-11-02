import Bill from "@/app/models/bill.model";
import connectDB from "@/app/utils/connectDB";
import { myRes } from "@/app/utils/myRes";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const counter = searchParams.get("counter");

        const bills = await Bill.find({ counter }).sort({ _id: -1 });
        let total = 0;

        bills.forEach(bill => {
            total += bill.price
        });

        return myRes(true, 200, 'Counter ' + counter + ' total', total);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}