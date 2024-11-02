import Link from 'next/link'
import React from 'react'

function Navbar() {
    return (
        <nav className='bg-sky-200 sticky top-0 z-10 shadow-md'>
            <div className="container mx-auto py-4 flex justify-between items-baseline">
                <Link href={'/'} className="font-bold text-lg">ระบบสหกรณ์ โรงเรียนภูเก็ตวิทยาลัย</Link>
                {/* <div className='flex'>
                    <Link href="/login" className='text-lg'>Login</Link>
                </div> */}
            </div>
        </nav>
    )
}

export default Navbar