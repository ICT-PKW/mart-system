"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import Footer from '@/app/components/Footer';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

function BillsPage() {
    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredBills, setFilteredBills] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const fetchBills = async (page = 1) => {
        try {
            const res = await axios.get(`/api/bill?limit=10&page=${page}`);
            const { bills: fetchedBills, totalPages } = res.data.data;
            setBills(fetchedBills);
            setFilteredBills(fetchedBills);
            setMaxPage(totalPages);
        } catch (error) {
            console.error("Error fetching bills", error);
        }
    };

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

    useEffect(() => {
        fetchBills(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const filtered = bills.filter((bill) =>
            bill.billNumber.includes(search)
        );
        setFilteredBills(filtered);
    }, [search, bills]);

    const handleNextPage = () => {
        if (currentPage < maxPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const extractItems = (items) => {
        return items.map(item => `<li>${item.name}: ${item.price} บาท ${item.amount} ชิ้น</li>`).join("");
    }

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

                await axios.put(`/api/counter/cancelBill`, { counter: selectedBill.counter, total: price });

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
            return Swal.fire({
                title: "ไม่สามารถยกเลิกบิลได้",
                icon: "error"
            });
        }
    }

    const showDetail = async (id) => {
        try {
            const selectedBill = await axios.get(`/api/bill/${id}`);

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

    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <div className="container mx-auto py-4">
                    <p className="font-bold text-2xl mt-8 mb-2 text-red-500">สวัสดี, ผู้ดูแล</p>
                    <hr className="mb-4" />
                    <div className='flex items-baseline justify-between mb-2'>
                        <h3 className='mb-2 text-xl font-semibold'>ใบเสร็จทั้งหมด</h3>
                        <input
                            className='border border-neutral-300 rounded px-2 py-1 shadow text-sm'
                            placeholder='ค้นหาใบเสร็จ'
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full h-96  text-sm text-left rtl:text-right text-gray-500">
                        <table className="w-full border rounded-lg overflow-hidden shadow-md">
                            <thead className="sticky top-0 text-sm border-b text-gray-700 uppercase bg-gray-300">
                                <tr>
                                    <th scope="col" className="px-3 py-2">#</th>
                                    <th scope="col" className="px-3 py-2">หมายเลขบิล</th>
                                    <th scope="col" className="px-3 py-2">ราคารวม (บาท)</th>
                                    <th scope="col" className="px-3 py-2">ที่ลูกค้าจ่าย (บาท)</th>
                                    <th scope="col" className="px-3 py-2">จากเคาท์เตอร์</th>
                                    <th scope="col" className="px-3 py-2">คำสั่ง</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill, index) => (
                                    <tr className="odd:bg-white even:bg-gray-50 border-b hover:bg-neutral-200 text-black" key={bill._id}>
                                        <th scope="row" className="px-3 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1 + (currentPage - 1) * 10}
                                        </th>
                                        <td className="px-3 py-1">{bill.billNumber}</td>
                                        <td className="px-3 py-1">{bill.price}</td>
                                        <td className="px-3 py-1">{bill.payIn}</td>
                                        <td className="px-3 py-1">{bill.counter}</td>
                                        <td className="px-3 py-1 flex gap-2">
                                            <button onClick={() => showDetail(bill._id)} className='px-3 py-1 text-white bg-sky-500 rounded font-medium shadow hover:bg-sky-600 transition'>ดูข้อมูล</button>
                                            {/* <button className='px-3 py-1 text-black bg-yellow-400 rounded font-medium shadow hover:bg-yellow-600 transition'>แก้ไข</button> */}
                                            <button onClick={() => cancelBill(bill._id)} className='px-3 py-1 text-white bg-red-500 rounded font-medium shadow hover:bg-red-600 transition'>ยกเลิกบิล</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='justify-end flex mt-10 gap-4'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className='bg-neutral-300 hover:bg-neutral-400 transition duration-100 flex justify-center items-center border w-8 h-8 rounded-full shadow'
                            >
                                <FontAwesomeIcon icon={faCaretLeft} className='text-black rounded-full p-1' />
                            </button>
                            <h2>{currentPage} / {maxPage}</h2>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === maxPage}
                                className='bg-neutral-300 hover:bg-neutral-400 transition duration-100 flex justify-center items-center border w-8 h-8 rounded-full shadow'
                            >
                                <FontAwesomeIcon icon={faCaretRight} className='text-black rounded-full p-1' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default BillsPage;
