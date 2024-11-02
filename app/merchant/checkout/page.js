"use client"
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import Modal from '@/app/components/Modal';
import Cookies from 'universal-cookie';
import Alert from '@/app/components/Alert';
import Item from '@/app/components/Item';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import BillDetails from '@/app/components/BillDetails';
import { Context } from '@/app/components/Context';
import Conclusion from '@/app/components/Conclusion';
import BillCancel from '@/app/components/BillCancel';
import BarcodeScanner from 'react-barcode-reader'
import BillDetail from '@/app/components/BillDetail';

function CheckoutPage() {
    const cookies = new Cookies();
    const router = useRouter();

    // Checkout Essentail
    const [multiply, setMultiply] = useState(1);
    const [voidCounter, setVoidCounter] = useState("");
    const [counter, setCounter] = useState(null);
    // const [bill, setBill] = useState("");
    const [bills, setBills] = useState([]);
    const [item, setItem] = useState([]);
    const [money, setMoney] = useState("");
    const [total, setTotal] = useState(0);
    const [change, setChange] = useState(cookies.get("change"));
    // const [change, setChange] = useState(0);

    // Popup State
    const [checkout, setCheckout] = useState(false);
    const [modal, setModal] = useState(false);
    const [conclusion, setConclusion] = useState(false);
    const [billVoid, setBillVoid] = useState(false);
    const [showBillsDetails, setShowBillsDetails] = useState(false);
    const [showCancelBill, setShowCancelBill] = useState(false);
    const [showBillDetail, setShowBillDetail] = useState(false);

    const { setGlobalItem } = useContext(Context);

    useEffect(() => {
        const url = new URL(window.location.href);
        const counter = url.searchParams.get("counter");
        const maxCounters = process.env.MAX_COUNTERS || 2;

        if (counter && parseInt(counter) > parseInt(maxCounters)) {
            router.replace('/');
        }

        setCounter(counter)
    }, []);

    const showDetail = async (billNumber) => {
        try {
            const selectedBill = await axios.get(`/api/bill/checkNumber/${billNumber}`);

            if (!selectedBill || selectedBill.data.statusCode === 404) {
                return Swal.fire({
                    title: "ไม่พบข้อมูลของบิล",
                    icon: "error"
                });
            }

            const billData = selectedBill.data.data
            return Swal.fire({
                title: "ข้อมูลของบิล",
                html: `
                <div style="width: 100%; padding-left: 16px; display: flex; flex-direction: column; text-align: left; margin-top: -6px; justify-content: start;">
                    <h4><b>เครื่องเคาท์เตอร์ที่</b>: ${billData.counter}</h4>
                    <h4><b>หมายเลขบิล</b>: ${billData.billNumber}</h4>
                    <h4><b>วันที่จ่าย</b>: ${convertTime(billData.time, true)}</h4>
                    <h4><b>ราคารวม</b>: ${billData.price} บาท</h4>
                    <h4><b>จำนวนเงินที่รับ</b>: ${billData.payIn} บาท | <b>ทอน</b> ${billData.payIn - billData.price} บาท</h4>
                    <h4><b>สินค้าที่ซื้อ</b>:</h4>
                    <ul style="list-style: disc; padding-left: 20px;">
                        ${extractItems(billData.items)}
                    </ul>
                </div>
                `,
                icon: "info"
            });
        } catch (error) {
            console.log(error.message);
            return Swal.fire({
                title: "ไม่พบข้อมูลของบิล",
                icon: "error"
            });
        }
    }

    const extractItems = (items) => {
        return items.map(item => `<li>${item.name}: ${item.price} บาท ${item.amount} ชิ้น</li>`).join("");
    }

    const Payment = async () => {
        // อย่าลืม set counter
        if (checkout) return;
        if (item.length === 0) return;

        const billNumber = `${new Date().getDate()}${new Date().getMonth()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`;

        const payIn = typeof money === "object" ? parseInt(money.join("")) : money;

        if (payIn >= total) {
            setCheckout(true);

            setChange(payIn - total);

            cookies.set("change", payIn - total);

            let newItemsList = item;

            newItemsList.forEach((data) => {
                data.amount = data.amount * multiply
            });

            setItem(newItemsList);

            console.log(item);

            const payLoad = {
                billNumber: billNumber.toString(),
                payIn,
                items: item,
                time: new Date(),
                status: 1,
                price: total,
                counter: +counter
            }

            await axios.post('/api/bill', payLoad)

            const updatePayload = {
                counter,
                total
            }

            await axios.put('/api/counter', updatePayload);

            const redirectToPrint = async () => {
                await Swal.fire({
                    title: 'ทอนเงิน ' + (payIn - total) + ' บาท',
                    text: "กด Enter เพื่อปิด",
                    icon: "info"
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/merchant/print');
                        setGlobalItem({
                            items: item,
                            payIn: +payIn,
                            change: payIn - total,
                            billNumber: billNumber,
                            price: +total,
                            counter: counter,
                        });
                    }
                })
            };
            redirectToPrint();
        }
    }

    const convertTime = (timeStr) => {
        const time = new Date(Date.parse(timeStr));
        const currentDate = new Date();
        const day = String(time.getDate()).padStart(2, '0');
        const monthIndex = time.getMonth();
        const year = time.getFullYear();
        const monthAbbreviation = [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
        ][monthIndex];

        const isToday = time.getDate() === currentDate.getDate() &&
            time.getMonth() === currentDate.getMonth() &&
            time.getFullYear() === currentDate.getFullYear();

        if (isToday) {
            return `วันนี้`;
        }

        if (year === currentDate.getFullYear()) {
            return `${day} ${monthAbbreviation}`;
        } else {
            return `${day} ${monthAbbreviation} ${year + 543}`;
        }
    };

    const cancelBill = async (id) => {
        try {
            const result = await Swal.fire({
                title: "แน่ใจว่าจะยกเลิกบิล ?",
                showCancelButton: true,
                cancelButtonText: 'ไม่ยกเลิก',
                confirmButtonText: "ยกเลิกบิล",
                confirmButtonColor: "#f00"
            })

            if (result.isConfirmed) {
                const selectedBillQuery = await axios.get(`/api/bill/${id}`);

                const selectedBill = selectedBillQuery.data.data;

                console.log(selectedBillQuery);

                const price = selectedBill.price;

                await axios.put(`/api/counter/cancelBill`, { counter, total: price });

                let currBills = bills.filter((bill) => bill._id !== id);

                setBills(currBills);
                Swal.fire({
                    title: "ยกเลิกบิลสำเร็จ",
                    text: "หมายเลขบิล : " + selectedBill.billNumber,
                    icon: "success"
                });

                await axios.delete(`/api/bill/${id}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const userInputCancelBill = async (billNumber) => {
        try {
            const result = await Swal.fire({
                title: "แน่ใจว่าจะยกเลิกบิล ?",
                showCancelButton: true,
                cancelButtonText: 'ไม่ยกเลิก',
                confirmButtonText: "ยกเลิกบิล",
                confirmButtonColor: "#f00"
            })

            if (result.isConfirmed) {
                const selectedBillQuery = await axios.get(`/api/bill/checkNumber/${billNumber}`);

                const selectedBill = selectedBillQuery.data.data;

                console.log(selectedBill);

                const price = selectedBill.price;

                await axios.put(`/api/counter/cancelBill`, { counter, total: price });

                let currBills = bills.filter((bill) => bill.billNumber !== billNumber);

                setBills(currBills);
                setShowCancelBill(false)
                Swal.fire({
                    title: "ยกเลิกบิลสำเร็จ",
                    text: "หมายเลขบิล : " + billNumber,
                    icon: "success"
                });

                await axios.delete(`/api/bill/${selectedBill._id}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const scanItem = async (barcodeNum) => {
        try {
            const scannedItem = await axios.get(`/api/stock/${barcodeNum}`);

            // console.log('the b is : ' + barcodeNum);
            // console.log(scannedItem.data.data);

            if (scannedItem.data.data) {
                const { barcode, name, price } = scannedItem.data.data
                const payload = {
                    barcode,
                    name,
                    price,
                    amount: multiply
                }
                setItem((prev) => [...prev, payload]);
                setMultiply(1);
            } else {
                return Swal.fire({
                    title: "ไม่พบสินค้า",
                    icon: "error"
                });
            }
        } catch (error) {
            console.log(error.message);
            return Swal.fire({
                title: "ไม่พบสินค้า",
                icon: "error"
            });
        }
    }

    useEffect(() => {
        const keyPress = (e) => {
            if (e.code === "NumpadDivide" || e.code === "Slash" || e.code === "Space") {
                setMoney('')
                document.getElementById("money").focus();
            }

            if (e.code === "NumpadMultiply") {
                setMultiply("");
                document.getElementById("multiply").focus();
            }
            if (
                e.code === "NumpadSubtract" ||
                e.code === "Minus" ||
                e.code === "NumpadAdd"
            ) {
                setModal(true);
            }
        }

        return () => {
            document.addEventListener("keydown", keyPress, false);
        }
    }, []);

    useEffect(() => {
        if (modal) {
            document.getElementById('plus-input').focus();
            document.getElementById('plus-input').value = "";
        }
    }, [modal]);

    useEffect(() => {
        // const fetchItems = async () => {
        //     const res = await axios.get('/api/stock');

        //     const items = res.data.data;

        //     setItem(items);
        // }

        const fetchBills = async () => {
            const res = await axios.get(`/api/bill?counter=${Number(counter)}&limit=8`);

            const allBills = res.data.data;

            console.log(allBills.bills);

            setBills(allBills.bills);
        }

        // fetchItems();
        if (counter !== null) {
            fetchBills();
        }
    }, [counter]);

    useEffect(() => {
        if (multiply <= 0) {
            setMultiply(1);
        }
    }, [multiply]);

    useEffect(() => {
        const total = item.reduce((total, { price, amount }) => total + (price * amount), 0);
        setTotal(total);
    }, [item, multiply]);


    return (
        <>
            <Navbar />
            <BarcodeScanner onScan={(e) => scanItem(e)} onError={(e) => console.error(e)} />
            {showBillsDetails && (
                <BillDetails close={() => setShowBillsDetails(false)} counter={counter} />
            )}
            {conclusion && (
                <Conclusion counter={counter} close={() => setConclusion(false)} />
            )}
            {showCancelBill && (
                <BillCancel close={() => setShowCancelBill(false)} cancelBill={(data) => userInputCancelBill(data)} />
            )}
            {showBillDetail && (
                <BillDetail close={() => setShowBillDetail(false)} func={(data) => showDetail(data)} />
            )}
            <div className="min-h-screen">
                <div className="container mx-auto py-4">
                    <p className="font-bold text-2xl mt-8 mb-2">สวัสดี, ผู้ขาย</p>
                    <hr className="mb-4" />
                    {modal && (
                        <Modal
                            close={() => setModal(false)}
                            setItem={(data) => {
                                setItem((prev) => [
                                    ...prev,
                                    { name: "ไม่มีบาร์โค้ด", price: parseInt(data), amount: 1 * multiply },
                                ]);
                                setModal(false);
                                setMultiply(1)
                            }}
                        />
                    )}
                    <div className='flex gap-2'>
                        <div className='w-3/5 bg-white border shadow-lg p-4'>
                            <h2 className='text-2xl font-bold'>เครื่องเคาท์เตอร์ที่ {counter}</h2>
                            <hr className='mt-1 mb-2' />
                            <div className='flex justify-between items-baseline mb-2'>
                                <div className='w-1/2'>
                                    <h3 className='text-xl font-semibold'>รายการสินค้า {item.length} ชิ้น</h3>
                                </div>
                                <div className='flex items-center justify-end w-1/2 gap-4'>
                                    <h1 className='font-bold text-lg'>X</h1>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            document.getElementById("multiply").blur();
                                        }}
                                        className='flex items-center space-x-2'
                                    >
                                        <input
                                            id="multiply"
                                            className='bg-neutral-300 w-3/4 text-lg p-1 rounded-full text-center px-4 py-2 shadow-md'
                                            type="number"
                                            value={multiply}
                                            onChange={(e) => setMultiply(e.target.value)}
                                        />
                                        <div className='flex gap-2'>
                                            <div onClick={() => setMultiply(multiply + 1)} className='bg-neutral-400 hover:bg-neutral-500 transition duration-100 flex justify-center items-center p-2 rounded-full shadow-md'>
                                                <FontAwesomeIcon icon={faAdd} className='text-white rounded-full p-1' />
                                            </div>
                                            <div onClick={() => setMultiply(multiply - 1)} className='bg-neutral-400 hover:bg-neutral-500 transition duration-100 flex justify-center items-center p-2 rounded-full shadow-md'>
                                                <FontAwesomeIcon icon={faMinus} className='text-white rounded-full p-1' />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='w-full overflow-y-auto flex flex-col p-2 gap-2 h-96 border-t border-b'>
                                {item.map(({ name, amount, price, barcode }, i) => (
                                    <Item
                                        barcode={barcode}
                                        order={i + 1}
                                        name={name}
                                        id={i}
                                        amount={amount}
                                        price={price}
                                        key={i}
                                        del={({ id, barcode, amount }) => {
                                            setItem((prev) => prev.filter((data, index) => index !== id))
                                        }}
                                    />
                                ))}
                            </div>
                            <div className='flex w-full gap-2 mt-2'>
                                <button
                                    className='w-1/4 px-2 py-1.5 text-[15px] bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 transition'
                                    onClick={() => setModal(true)}
                                >
                                    กดขายเอง
                                </button>
                                <button
                                    className='w-1/4 px-2 py-1.5 text-sm text-[15px] bg-neutral-500 text-white rounded-lg shadow-md hover:bg-neutral-600 transition'
                                    onClick={() => setShowBillDetail(true)}
                                >
                                    กรอกดูรายละเอียดบิล
                                </button>
                                <button
                                    className='w-1/4 px-2 py-1.5 text-[15px] bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition'
                                    onClick={() => setShowCancelBill(true)}
                                >
                                    กรอกยกเลิกบิลเอง
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col w-2/5 gap-3'>
                            <div className=' bg-white flex flex-col justify-center items-start border shadow-lg p-4 min-h-1/5'>
                                <p className='text-neutral-500'>ยอดเงิน</p>
                                <div className='flex items-baseline justify-start gap-2 w-full'>
                                    <h2 className='text-2xl font-medium'>รวมเป็นเงิน</h2>
                                    <h2 className='text-2xl font-medium'>{total} บาท</h2>
                                </div>
                            </div>
                            <div className=' bg-white flex flex-col justify-center items-start border shadow-lg p-4 min-h-1/5'>
                                <p className='text-neutral-700 text-lg font-semibold'>รับมา</p>
                                <form className='inline-flex items-baseline gap-2'
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        Payment();
                                    }}>
                                    <input value={money} id='money' className='border px-4 py-2 shadow-md rounded-md' onChange={(e) => setMoney(e.target.value.replace("/", ""))} />
                                    <span className='text-2xl font-semibold'>บาท</span>
                                </form>
                                <hr className='mt-1 mb-2' />
                                <div className='flex w-full gap-2 mt-2'>
                                    <button
                                        className='w-1/2 px-4 py-2 bg-emerald-400 text-white rounded-lg shadow-md hover:bg-emerald-600 transition'
                                        onClick={() => Payment()}
                                    >
                                        ทอนเงิน
                                    </button>
                                    <button
                                        className='w-1/2 px-4 py-2 bg-sky-400 text-white rounded-lg shadow-md hover:bg-sky-600 transition'
                                        onClick={() => setShowBillsDetails(true)}
                                    >
                                        ดูบิลทั้งหมด
                                    </button>
                                    <button
                                        className='w-1/2 px-2 py-1 bg-orange-500 text-black rounded-lg shadow-md hover:bg-orange-700 hover:text-white transition'
                                        onClick={() => setConclusion(true)}
                                    >
                                        สรุปยอด
                                    </button>
                                </div>
                            </div>
                            <div className=' bg-white flex flex-col items-start border shadow-lg p-4 h-full '>
                                <p className='text-neutral-700 font-medium text-lg underline'>บิลล่าสุด</p>
                                {bills.length <= 0 ? (
                                    <h3 className='mt-3 w-full text-center text-neutral-500 font-medium transition'>-- ไม่มีบิล --</h3>
                                ) : (
                                    <div className='w-full flex flex-col mt-1 overflow-y-auto h-48'>
                                        {bills.map((bill, i) => (
                                            <div key={i} className='w-full flex flex-col space-y-2 px-2 pt-1 hover:bg-neutral-200 transition'>
                                                <div className='flex items-center justify-between gap-2 w-full'>
                                                    <h2 className='font-medium text-sm w-1/6'>{convertTime(bill.time)}</h2>
                                                    <h2 className='font-medium w-1/6 text-sm'>{bill.billNumber}</h2>
                                                    <h2 className='font-medium w-1/6 text-sm'>{bill.price} บาท</h2>
                                                    <div className='gap-1 flex'>
                                                        {/* <button onClick={() => showDetail(bill._id)} className='text-white text-sm px-2 py-1 bg-neutral-400 rounded shadow-md hover:bg-neutral-600 transition'>ดูรายละเอียด</button> */}
                                                        <button onClick={() => cancelBill(bill._id)} className='text-white text-sm px-2 py-1 bg-red-500 rounded shadow-md hover:bg-red-700 transition'>ยกเลิกบิล</button>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        ))}
                                        <h3 onClick={() => setShowBillsDetails(true)} className='my-1 text-center text-sky-600 underline hover:text-sky-700 transition cursor-pointer'>ดูบิลทั้งหมด</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CheckoutPage
