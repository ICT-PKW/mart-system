"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

function BillDetails({ open, close, setItem, counter }) {
    const [bills, setBills] = useState("");

    useEffect(() => {
        const fetchBills = async () => {
            const res = await axios.get(`/api/bill?counter=${counter}`);

            const allBills = res.data.data;

            setBills(allBills.bills);
        }

        fetchBills();
    }, [])

    const convertTime = (timeStr, isDesc) => {
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

        if (year === currentDate.getFullYear() && !isDesc) {
            return `${day} ${monthAbbreviation}`;
        } else {
            return `${day} ${monthAbbreviation} ${year + 543}`;
        }
    };

    const columns = [
        {
            name: 'วันที่',
            selector: row => convertTime(row.time),
        },
        {
            name: 'หมายเลขบิล',
            selector: row => row.billNumber,
        },
        {
            name: 'ราคารวม (บาท)',
            selector: row => row.price,
        },
        {
            name: 'ราคารับ (บาท)',
            selector: row => row.payIn,
        },
        {
            name: 'คำสั่ง',
            cell: row => (
                <div className='gap-1 flex'>
                    <button onClick={() => showDetail(row._id)} className='text-white text-xs p-1 bg-neutral-400 rounded shadow-md hover:bg-neutral-600 transition'>ดูรายละเอียด</button>
                    <button className='text-white text-xs p-1 bg-red-500 rounded shadow-md hover:bg-red-600 transition'>ยกเลิกบิล</button>
                </div>
            ),
            selector: row => row._id,
        }
    ];

    const extractItems = (items) => {
        return items.map(item => `<li>${item.name}: ${item.price} บาท ${item.amount} ชิ้น</li>`).join("");
    }

    const showDetail = async (id) => {
        try {
            const selectedBill = await axios.get(`/api/bill/${id}`);
            
            const billData = selectedBill.data.data
            Swal.fire({
                title: "ข้อมูลของบิล",
                html: `
                <div style="width: 100%; padding-left: 16px; display: flex; flex-direction: column; text-align: left; margin-top: 0px; justify-content: start; overflow-y: auto;">
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
        }
    }

    return (
        <div className='z-20 fixed top-0 left-0 bg-black/25 w-full h-full flex justify-center items-center '>
            <div className='bg-white p-4 rounded shadow-md container relative'>
                <h1 className='text-xl font-bold'>บิลทั้งหมด</h1>
                <DataTable
                    columns={columns}
                    data={bills}
                    pagination
                    paginationPerPage={8}
                    customStyles={{
                        headCells: {
                            style: {
                                fontWeight: 'bold',
                            }
                        },
                        cells: {
                            style: {
                                paddingTop: '0px'
                            }
                        }
                    }}
                />
                <button onClick={close}><FontAwesomeIcon icon={faXmarkCircle} className='text-red-500 bg-white rounded-full text-3xl absolute -top-2 -right-2' /></button>

            </div>
        </div>
    );
}

export default BillDetails;
