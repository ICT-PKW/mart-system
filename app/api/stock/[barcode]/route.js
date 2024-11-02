import Stock from "@/app/models/stock.model";
import { myRes } from "@/app/utils/myRes";

export async function GET(req, { params }) {
    try {
        const barcode = params.barcode;
        const selectedStock = await Stock.findOne({ barcode });
        if (!selectedStock) {
            return myRes(false, 404, 'Stock not found');
        }

        return myRes(true, 200, 'Selected Stock', selectedStock);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}