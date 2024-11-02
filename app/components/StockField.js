"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function StockField({ type, barcode, close, action }) {
    const [stock, setStock] = useState({
        barcode: '',
        name: '',
        price: 0
    });

    if (type === 'add') {
        return (
            <div className='fixed top-0 left-0 z-10 bg-black/25 w-full h-full flex justify-center items-center'>
                <form className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group space-y-2">
                    <h1 className='font-bold text-lg'>เพิ่มสต๊อก</h1>
                    <hr />
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>หมายเลขบาร์โค้ด</p>
                        <input onChange={(e) => setStock((prev) => ({...prev, barcode: e.target.value}))} name='barcode' type='text' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกหมายเลขบาร์โค้ด' />
                    </div>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>ชื่อสต็อก</p>
                        <input onChange={(e) => setStock((prev) => ({...prev, name: e.target.value}))} name='name' type='text' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกชื่อสต็อก' />
                    </div>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>ราคา (บาท)</p>
                        <input type='number' onChange={(e) => setStock((prev) => ({...prev, price: Number(e.target.value)}))} name='price' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกราคา (บาท)' />
                    </div>
                    <hr />
                    <div className='flex gap-2 w-full text-[15px]'>
                        <button type='button' onClick={close} className='w-full bg-red-500 px-4 py-2 text-white rounded-md shadow-xl hover:bg-red-700 transition'>ยกเลิก</button>
                        <button type='button' onClick={() => {
                            action(stock);
                        }} className='w-full bg-blue-500 px-4 py-2 text-white rounded-md shadow-xl hover:bg-blue-700 transition'>ยืนยัน</button>
                    </div>
                </form>
            </div>
        )
    }

    if (type === 'edit') {
        const [info, setInfo] = useState({
            barcode: '',
            name: '',
            price: 0
        })
        // console.log(barcode);
        const getData = async (barcode) => {
            try {
                const selectedBillQuery = await axios.get(`/api/stock/${barcode}`);

                const selectedBill = selectedBillQuery.data.data;
                const id = selectedBill._id;

                setInfo({
                    id,
                    barcode: selectedBill.barcode,
                    name: selectedBill.name,
                    price: selectedBill.price,
                });
            } catch (error) {
                console.log(error.message)
            }
        }

        useEffect(() => {
            getData(barcode);
        }, [])
        return (
            <div className='fixed top-0 left-0 z-10 bg-black/25 w-full h-full flex justify-center items-center'>
                <form className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group space-y-2">
                    <h1 className='font-bold text-lg'>แก้ไขสต๊อก</h1>
                    <hr />
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>หมายเลขบาร์โค้ด</p>
                        <input value={info.barcode} onChange={(e) => setInfo((prev) => ({...prev, barcode: e.target.value}))} name='barcode' type='text' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกหมายเลขบาร์โค้ด' />
                    </div>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>ชื่อสต็อก</p>
                        <input value={info.name} onChange={(e) => setInfo((prev) => ({...prev, name: e.target.value}))} name='name' type='text' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกชื่อสต็อก' />
                    </div>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>ราคา (บาท)</p>
                        <input value={info.price} type='number' onChange={(e) => setInfo((prev) => ({...prev, price: Number(e.target.value)}))} name='price' className='text-sm border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกราคา (บาท)' />
                    </div>
                    <hr />
                    <div className='flex gap-2 w-full text-[15px]'>
                        <button type='button' onClick={close} className='w-full bg-red-500 px-4 py-2 text-white rounded-md shadow-xl hover:bg-red-700 transition'>ยกเลิก</button>
                        <button type='button' onClick={() => {
                            action(info);
                        }} className='w-full bg-yellow-500 px-4 py-2 text-black rounded-md font-medium shadow-xl hover:bg-yellow-700 transition'>ยืนยัน</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default StockField