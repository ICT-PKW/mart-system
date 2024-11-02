import { myRes } from "@/app/utils/myRes";
import Counter from '@/app/models/counter.model'
import connectDB from "@/app/utils/connectDB";

export async function GET(req, { params }) {
    try {
        const id = params.id;
        await connectDB();

        const selectedCounter = await Counter.findOne({ counter: id });
        return myRes(true, 200, 'Selected counter : ' + id, selectedCounter);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}