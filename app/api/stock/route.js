import connectDB from "@/app/utils/connectDB";
import Stock from "@/app/models/stock.model";
import { NextResponse } from "next/server";
import { myRes } from "@/app/utils/myRes";

export async function GET(req) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit")) || 0;
        const page = parseInt(searchParams.get("page")) || 1;
        const counter = searchParams.get("counter");

        let stocksQuery = {};

        if (counter) {
            stocksQuery.counter = counter;
        }

        const skip = (page - 1) * limit;

        const stocks = await Stock.find(stocksQuery)
            .sort({ _id: -1 })
            .skip(limit > 0 ? skip : 0)
            .limit(limit > 0 ? limit : 0);

        const totalStocks = await Stock.countDocuments(stocksQuery);
        const totalPages = limit > 0 ? Math.ceil(totalStocks / limit) : 1;

        return myRes(true, 200, 'Stocks fetched successfully', { stocks, totalPages });
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }
}


export async function POST(req, res) {
    try {
        await connectDB();
        const { barcode, name, price } = await req.json();

        const payload = {
            barcode,
            name,
            price
        };

        const checkStock = await Stock.findOne({name});

        if (checkStock) {
            return myRes(false, 401, 'มีสินค้านี้อยู่ในคลังแล้ว');
        }

        const newStock = await Stock.create(payload);

        return myRes(true, 201, 'Add stock', newStock);
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }

}

export async function PUT(req, res) {
    try {
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("id");
        const { barcode, name, price } = await req.json();


        const payload = {
            barcode,
            name,
            price
        };

        const updatedStock = await Stock.findByIdAndUpdate(query, payload);

        return myRes(true, 201, 'Updated stock', updatedStock);
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }

}

export async function DELETE(req, res) {
    try {
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("id");

        const deletedStock = await Stock.findByIdAndDelete(query);

        return myRes(true, 201, 'Deleted stock', deletedStock);
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }

}