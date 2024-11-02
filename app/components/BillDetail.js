import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function BillDetail({ close, func }) {
    const [value, setValue] = useState("");

    return (
        <div className='fixed top-0 left-0 z-10 bg-black/25 w-full h-full flex justify-center items-center'>
            <div
                className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group">
                <h1 className="text-xl text-center font-semibold gap-2 group-hover:gap-4 transition-all duration-100">ดูรายละเอียดบิล</h1>
                <hr className='my-2' />
                <div className='space-y-2 '>
                    <input
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        className='px-4 py-2 border w-full rounded-md shadow-md text-xl'
                        placeholder='กรอกหมายเลขบิล'
                    />
                </div>
                <hr className='mt-4 mb-2' />
                <div className='flex justify-center gap-2'>
                    <button
                        type="button"
                        className='bg-sky-600 rounded-lg py-2 px-4 text-white mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all hover:bg-sky-800 shadow-lg'
                        onClick={close}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />กลับ
                    </button>
                    <button
                        type="button"
                        className='bg-neutral-500 rounded-lg py-2 px-4 text-white mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all hover:bg-neutral-700 shadow-lg'
                        onClick={() => func(value)}
                    >
                        ดูรายละเอียด
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BillDetail;
