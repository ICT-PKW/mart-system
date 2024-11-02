import connectDB from "@/app/utils/connectDB";
import Stock from "@/app/models/stock.model";
import { myRes } from "@/app/utils/myRes";

export async function POST(req, res) {
    try {
        await connectDB();
        const { name } = await req.json()
        const stock = await Stock.findOne({ name });

        return myRes(true, 200, 'Check stock', (stock !== null));
    } catch (error) {
        console.log(error);
        return myRes(false, 500, error.message);
    }

}