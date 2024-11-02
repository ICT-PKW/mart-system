"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

function AdminPage() {
    const [stocks, setStocks] = useState([]);
    const [bills, setBills] = useState([]);

    const fetchStocks = async () => {
        try {
            const query = await axios.get('/api/stock');
            const stocks = query.data.data;
            // console.log(stocks);
            

            return stocks
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchBills = async () => {
        try {
            const query = await axios.get('/api/bill');
            const bills = query.data.data;
            console.log(bills);
            

            return bills
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const stocksData = await fetchStocks();
            const billsData = await fetchBills();
            setStocks(stocksData.stocks);
            setBills(billsData.bills);
        }

        fetchData();
    }, [])
    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <div className="container mx-auto py-4">
                    <p className="font-bold text-2xl mt-8 mb-2 text-red-500">สวัสดี, ผู้ดูแล </p>
                    <hr className="mb-4" />
                    <h3 className='mb-2 text-lg font-semibold'>ข้อมูลทั้งหมด</h3>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <Link href={'/admin/stocks'} className='w-full'>
                            <div className="bg-white border p-4 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-slate-100 group">
                                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">สต๊อก</h1>
                                <hr />
                                <p className="mt-2 text-slate-500">จำนวนทั้งหมด {stocks.length} รายการ</p>
                            </div>
                        </Link>
                        <Link href={'/admin/bills'} className='w-full'>
                            <div className="bg-white border p-4 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-slate-100 group">
                                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">ใบเสร็จ</h1>
                                <hr />
                                <p className="mt-2 text-slate-500">จำนวนทั้งหมด {bills.length} รายการ</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPage