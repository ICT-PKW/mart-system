import { myRes } from "@/app/utils/myRes";
import Counter from '@/app/models/counter.model'
import connectDB from "@/app/utils/connectDB";

export async function GET() {
    try {
        await connectDB();

        const allCounters = await Counter.find();
        return myRes(true, 200, 'All counters', allCounters);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}

export async function PUT(req) {
    const { counter, total } = await req.json()
    try {
        await connectDB();
        const selectedCounter = await Counter.findOne({ counter: Number(counter) });

        if (!selectedCounter) {
            return myRes(false, 404, 'ไม่พบเคาท์เตอร์');
        }

        const salary = selectedCounter.salary + total;
        const updatedCounter = await Counter.findOneAndUpdate(
            { counter: Number(counter) },
            { salary }
        );

        return myRes(true, 201, 'Updated success', updatedCounter);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}

export async function POST(req) {
    const { counter } = await req.json()

    try {
        await connectDB();
        const checkCounter = await Counter.findOne({ counter });

        if (checkCounter) {
            return myRes(false, 403, 'มีการสร้างเคาท์เตอร์ที่ ' + counter + ' แล้ว');
        }

        const payload = {
            counter,
            last_open: new Date(),
            salary: 0,
        }

        const newCounter = await Counter.create(payload);

        return myRes(true, 201, 'Create a new counter', newCounter);
    } catch (error) {
        return myRes(false, 500, error.message);
    }
}