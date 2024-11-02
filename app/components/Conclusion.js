import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Context } from '@/app/components/Context';

function Conclusion({ counter, open, close }) {
    const [money, setMoney] = useState(0);
    const [notes, setNotes] = useState({
        thousand: "",
        fivehund: "",
        hundred: "",
        fifty: "",
        twenty: "",
        ten: "",
        five: "",
        two: "",
        one: "",
    });
    const [status, setStatus] = useState(0);
    const [profit, setProfit] = useState(0);
    const [lastOpen, setLastOpen] = useState("");
    const [currsalary, setCurrSalary] = useState(0);
    const router = useRouter();
    const { setGlobalItem } = useContext(Context);

    useEffect(() => {
        const { thousand, fivehund, hundred, fifty, twenty, ten, five, two, one } = notes;

        const parseToInt = (value) => {
            return parseInt(value, 10) || 0;
        };

        const totalMoney =
            parseToInt(thousand) * 1000 +
            parseToInt(fivehund) * 500 +
            parseToInt(hundred) * 100 +
            parseToInt(fifty) * 50 +
            parseToInt(twenty) * 20 +
            parseToInt(ten) * 10 +
            parseToInt(five) * 5 +
            parseToInt(two) * 2 +
            parseToInt(one) * 1;

        setMoney(totalMoney);
    }, [notes]);

    const Calculate = () => {
        axios.get(`/api/counter/${counter}`).then((res) => {
            const { salary, last_open } = res.data.data;

            setLastOpen(last_open);
            setProfit(money - 5000 - salary);
            setCurrSalary(salary);
            setStatus(1);
        });
    };

    const Print = async () => {
        const { thousand, fivehund, hundred, fifty, twenty, ten, five, two, one } = notes;
        const parseToInt = (value) => {
            return parseInt(value, 10) || 0;
        };
        axios.get(`/api/counter/${counter}`).then((res) => {
            const { salary, last_open } = res.data.data;
            const totalMoney =
                parseToInt(thousand) * 1000 +
                parseToInt(fivehund) * 500 +
                parseToInt(hundred) * 100 +
                parseToInt(fifty) * 50 +
                parseToInt(twenty) * 20 +
                parseToInt(ten) * 10 +
                parseToInt(five) * 5 +
                parseToInt(two) * 2 +
                parseToInt(one) * 1;
            setGlobalItem({
                total: totalMoney,
                change: 5000,
                net: totalMoney - 5000,
                counter: counter,
                profit: (money - 5000 - salary),
                last_open
            });
            router.push('/merchant/end');
            
        })
    }

    if (status === 0) return (
        <div className='fixed top-0 left-0 bg-black/25 w-full h-full flex justify-center items-center'>
            <div
                className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group">
                <h1 className="text-xl text-center font-semibold gap-2 group-hover:gap-4 transition-all duration-100">สรุปยอดการขายวันนี้</h1>
                <h3 className="text-lg text-center text-slate-500 font-medium mb-1 gap-2 group-hover:gap-4 transition-all duration-100">{money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} บาท</h3>
                <hr className='my-2' />
                <form className='space-y-2 flex flex-col items-center'>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>1,000</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, thousand: e.target.value }))
                            }
                            value={notes.thousand}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>500</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, fivehund: e.target.value }))
                            }
                            value={notes.fivehund}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>100</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, hundred: e.target.value }))
                            }
                            value={notes.hundred}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>50</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, fifty: e.target.value }))
                            }
                            value={notes.fifty}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>20</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, twenty: e.target.value }))
                            }
                            value={notes.twenty}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>10</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, ten: e.target.value }))
                            }
                            value={notes.ten}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>5</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, five: e.target.value }))
                            }
                            value={notes.five}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>2</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, two: e.target.value }))
                            }
                            value={notes.two}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='inline-flex items-center w-3/6'>
                        <div className='w-1/3 text-right pr-4'>1</div>
                        <input
                            type='number'
                            onChange={(e) =>
                                setNotes((prev) => ({ ...prev, one: e.target.value }))
                            }
                            value={notes.one}
                            className='px-2 py-1 border w-2/3 rounded shadow text-sm'
                            placeholder='กรอกจำนวนเงิน'
                        />
                    </div>
                    <div className='flex gap-2 pt-4'>
                        <button
                            type="button"
                            className='bg-sky-500 rounded-lg py-2 px-4 text-white mt-2 transition hover:bg-sky-700 shadow-lg'
                            onClick={Calculate}
                        >
                            ตกลง
                        </button>
                        <button
                            type="button"
                            className='bg-red-600 rounded-lg py-2 px-4 text-white mt-2 transition hover:bg-red-800 shadow-lg'
                            onClick={close}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );

    if (status === 1) return (
        <div className='fixed top-0 left-0 bg-black/25 w-full h-full flex justify-center items-center'>
            <div
                className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group">
                <h1 className="text-xl text-center font-semibold gap-2 group-hover:gap-4 transition-all duration-100">สรุปยอดการขายวันนี้</h1>
                <hr className='my-2' />
                <div className='space-y-2 mt-4'>
                    <div className='flex items-baseline w-4/6 mx-auto'>
                        <h4 className='w-full text-left'>เงินทั้งหมด</h4>
                        <h4 className='w-2/4 text-right text-3xl'>{money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h4>
                        <h4 className='w-1/4 text-right'>บาท</h4>
                    </div>
                    <div className='flex items-end w-4/6 mx-auto'>
                        <h4 className='w-full text-left'>เงินทอน</h4>
                        <h4 className='w-2/4 text-right text-3xl'>- 5,000</h4>
                        <h4 className='w-1/4 text-right'>บาท</h4>
                    </div>
                    <div className='flex items-baseline w-4/6 mx-auto'>
                        <h4 className='w-full text-left'>เงินสุทธิ</h4>
                        <h4 className='w-2/4 text-right text-3xl'>{(money - 5000).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h4>
                        <h4 className='w-1/4 text-right'>บาท</h4>
                    </div>
                    <div className={`flex items-baseline w-4/6 mx-auto ${profit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        <h4 className='w-full text-left'>{profit > 0 ? 'เงินเกิน(กำไร)' : 'เงินขาด(ขาดทุน)'}</h4>
                        <h4 className='w-2/4 text-right text-3xl'>{Math.abs(profit).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h4>
                        <h4 className='w-1/4 text-right'>บาท</h4>
                    </div>
                </div>
                <hr className='mt-4 mb-2' />
                <div className='flex justify-center gap-2'>
                    <button
                        type="button"
                        className='bg-sky-600 rounded-lg py-2 px-4 text-white mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all hover:bg-sky-800 shadow-lg'
                        onClick={() => setStatus(0)}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />กลับ
                    </button>
                    <button
                        type="button"
                        className='bg-emerald-500 rounded-lg py-2 px-4 text-white mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all hover:bg-emerald-700 shadow-lg'
                        onClick={Print}
                    >
                        <FontAwesomeIcon icon={faPrint} />พิมพ์
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Conclusion;
