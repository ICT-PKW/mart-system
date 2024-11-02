"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import StockField from '@/app/components/StockField';
import Swal from 'sweetalert2';

function StocksPage() {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [toggleEditModal, setToggleEditModal] = useState({
        status: false,
        id: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const fetchStocks = async (page = 1) => {
        const res = await axios.get(`/api/stock?limit=10&page=${page}`);
        const { stocks: fetchedStocks, totalPages } = res.data.data;
        setStocks(fetchedStocks);
        setFilteredStocks(fetchedStocks);
        setMaxPage(totalPages);
    }

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

    useEffect(() => {
        fetchStocks(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const filtered = stocks.filter((stock) =>
            stock.name.includes(search) || stock.barcode.includes(search)
        );
        setFilteredStocks(filtered);
    }, [search, stocks]);

    const addStock = async ({ barcode, name, price }) => {
        try {
            const payload = {
                barcode,
                name,
                price
            }
            const newStock = await axios.post('/api/stock', payload);

            setFilteredStocks((prev) => [...prev, newStock.data.data])
        } catch (error) {
            console.log(error.message);
        }
    }

    const editStock = async ({ barcode, name, price, id }) => {
        try {
            const confirm = await Swal.fire({
                title: "แน่ใจว่าจะแก้ไข ?",
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: "แก้ไข",
                confirmButtonColor: "#040"
            });

            if (confirm.isConfirmed) {
                const payload = {
                    barcode,
                    name,
                    price
                }

                await axios.put(`/api/stock?id=${id}`, payload);
                setFilteredStocks((prev) => prev.map((stock) => (stock._id === id ? { _id: id, ...payload } : stock)));

                Swal.fire({
                    title: "แก้ไขข้อมูลสำเร็จ",
                    icon: "info"
                });
            }
        } catch (error) {
            console.log(error.message);
            Swal.fire({
                title: "แก้ไขข้อมูลไม่สำเร็จ",
                icon: "error"
            });
        }
    }

    const deletedStock = async (id, barcode) => {
        try {
            const confirm = await Swal.fire({
                title: "แน่ใจว่าจะลบสต็อก ?",
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: "ลบสต็อก",
                confirmButtonColor: "#f00"
            });

            if (confirm.isConfirmed) {
                const updatedStock = await axios.delete(`/api/stock?id=${id}`);

                setFilteredStocks((prev) => prev.filter((loopStock) => loopStock._id !== id))

                if (updatedStock) {
                    return Swal.fire({
                        title: "ลบสินค้าสำเร็จ",
                        text: "หมายเลขบาร์โค้ด : " + barcode,
                        icon: "success"
                    });
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            {toggleModal && <StockField type={'add'} action={(data) => {
                addStock(data);
                setToggleModal(false);
            }} close={() => setToggleModal(false)} />}
            {toggleEditModal['status'] && <StockField type={'edit'} barcode={toggleEditModal['barcode']} action={(data) => {
                editStock(data);
                setToggleEditModal(false);
            }} close={() => setToggleEditModal(false)} />}
            <Navbar />
            <div className="min-h-screen">
                <div className="container mx-auto py-4">
                    <p className="font-bold text-2xl mt-8 mb-2 text-red-500">สวัสดี, ผู้ดูแล </p>
                    <hr className="mb-4" />
                    <div className='flex items-baseline justify-between mb-2'>
                        <h3 className='mb-2 text-xl font-semibold'>สต๊อกทั้งหมด</h3>
                        <div className='flex gap-2'>
                            <input
                                className='border border-neutral-400 rounded px-2 py-1 shadow-md text-sm'
                                placeholder='ค้นหาสต๊อก'
                                name="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={() => setToggleModal(true)} className='px-2 py-1 rounded text-sm shadow-lg bg-green-500 text-white hover:bg-emerald-600 transition'>
                                <FontAwesomeIcon icon={faAdd} /> เพิ่มสต๊อก
                            </button>
                        </div>
                    </div>
                    <div className="w-full max-h-96 overflow-y-auto rounded-lg shadow-lg border text-sm text-left rtl:text-right text-gray-500">
                        <table className="w-full">
                            <thead className="sticky top-0 text-sm border-b text-gray-700 uppercase bg-gray-300">
                                <tr>
                                    <th scope="col" className="px-3 py-2">
                                        #
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        หมายเลขบาร์โค้ด
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        ชื่อสินค้า
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        ราคา (บาท)
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        คำสั่ง
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.map((stock, index) => (
                                    <tr className="odd:bg-white even:bg-gray-50 border-b hover:bg-neutral-200 text-black" key={index}>
                                        <th scope="row" className="px-3 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1}
                                        </th>
                                        <td className="px-3 py-1">
                                            {stock.barcode}
                                        </td>
                                        <td className="px-3 py-1">
                                            {stock.name}
                                        </td>
                                        <td className="px-3 py-1">
                                            {stock.price}
                                        </td>
                                        <td className="px-3 py-1 flex gap-2">
                                            <button onClick={() => setToggleEditModal({
                                                status: true,
                                                barcode: stock.barcode
                                            })} className='px-3 py-1 text-black bg-yellow-400 rounded font-medium shadow hover:bg-yellow-600 transition'>แก้ไข</button>
                                            <button onClick={() => {
                                                deletedStock(stock._id, stock.barcode);
                                            }} className='px-3 py-1 text-white bg-red-500 rounded font-medium shadow hover:bg-red-600 transition'>ลบ</button>
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
        </>
    )
}

export default StocksPage;