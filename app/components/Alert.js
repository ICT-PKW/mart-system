import React from 'react'

function Alert({ show, onClick, change }) {
    return (
        <div className={`top-0 left-0 bg-black/25 w-full h-full flex justify-center items-center ${show ? 'fixed' : 'hidden'}`}>
            <div className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group">
                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">เงินทอน</h1>
                <hr />
                <p className='my-2'>{change} บาท</p>
                <hr />
                <button className='bg-red-600 rounded-xl py-2 px-4 text-white mt-2 transition hover:bg-red-800 shadow-lg' onClick={onClick}>ยกเลิก</button>
            </div>
        </div>
    )
}

export default Alert