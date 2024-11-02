import React, { useState } from 'react';

function Modal({ open, close, setItem }) {
    const [value, setValue] = useState("");

    return (
        <div className='fixed top-0 left-0 bg-black/25 w-full h-full flex justify-center items-center'>
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (value === '') {
                        return
                    }

                    if (/\+/g.test(value)) {
                        const exactValue = value.split("+");
                        exactValue.shift();
                        console.log(exactValue);
                        const price = exactValue
                            .map((value) => parseInt(value))
                            .reduce((total, price) => price + total, 0);
                        setItem(Math.abs(price));
                    } else {
                        setItem(Math.abs(parseInt(value)));
                    }
                }}
                className="bg-white w-1/3 border p-4 rounded-md shadow-md transition-all hover:bg-slate-50 group">
                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">จำนวนเงิน</h1>
                <hr />
                <input
                    id='plus-input'
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    className='px-4 py-4 border w-full my-4 rounded-md shadow-md text-2xl'
                    placeholder='กรอกจำนวนเงิน (บาท)'
                />
                <hr />
                <button
                    type="button"
                    className='bg-red-600 rounded-xl py-2 px-4 text-white mt-2 transition hover:bg-red-800 shadow-lg'
                    onClick={close}
                >
                    ยกเลิก
                </button>
            </form>
        </div>
    );
}

export default Modal;
