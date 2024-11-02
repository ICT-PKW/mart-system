import Bill from "@/app/models/bill.model";
import connectDB from "@/app/utils/connectDB";
import { myRes } from "@/app/utils/myRes";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit")) || 0;
        const page = parseInt(searchParams.get("page")) || 1;
        const counter = searchParams.get("counter");

        let billsQuery = {};

        if (counter) {
            billsQuery.counter = counter;
        }

        const skip = (page - 1) * limit;

        const bills = await Bill.find(billsQuery)
            .sort({ _id: -1 })
            .skip(limit > 0 ? skip : 0)
            .limit(limit > 0 ? limit : 0);

        const totalBills = await Bill.countDocuments(billsQuery);
        const totalPages = limit > 0 ? Math.ceil(totalBills / limit) : 1;

        return myRes(true, 200, 'Stocks fetched successfully', { bills, totalPages });
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }
}

export async function POST(req) {
    const { billNumber, payIn, items, time, status, price, counter } = await req.json();

    const payLoad = {
        billNumber, payIn, items, time, status, price, counter
    }
    try {
        await connectDB();
        const newBill = await Bill.create(payLoad);

        return myRes(true, 201, 'Add bill', newBill);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}