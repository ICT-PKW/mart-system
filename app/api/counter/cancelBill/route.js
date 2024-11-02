import { myRes } from "@/app/utils/myRes";
import Counter from '@/app/models/counter.model'
import connectDB from "@/app/utils/connectDB";

export async function PUT(req) {
    const { counter, total } = await req.json()
    try {
        await connectDB();
        const selectedCounter = await Counter.findOne({ counter: Number(counter) });

        if (!selectedCounter) {
            return myRes(false, 404, 'ไม่พบเคาท์เตอร์');
        }

        const salary = selectedCounter.salary - total;
        const updatedCounter = await Counter.findOneAndUpdate(
            { counter: Number(counter) },
            { salary }
        );

        return myRes(true, 201, 'Updated success', updatedCounter);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}