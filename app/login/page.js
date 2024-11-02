"use client";
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const formSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            return Swal.fire({
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                icon: 'error'
            });
        }
    }

    return (
        <main className='h-screen w-full'>
            <div className='flex flex-col justify-center items-center h-full gap-2'>
                <Link href={'/'}>
                    <Image src={'/img/PKWLogo.png'} width={100} height={130} />
                </Link>
                <h1 className='mb-4 text-xl font-semibold'>เข้าสู่ระบบ<span className='text-red-500'>แอดมิน</span></h1>
                <form onSubmit={formSubmit} className='bg-white shadow-md rounded-md p-4 border w-1/3 gap-4 flex flex-col'>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>ชื่อผู้ใช้ / Username</p>
                        <input onChange={(e) => setUsername(e.target.value)} name='username' type='text' className='border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกชื่อผู้ใช้' />
                    </div>
                    <div className='space-y-1'>
                        <p className='font-medium text-base'>รหัสผ่าน / Password</p>
                        <div className='w-full relative'>
                            <button type='button' className='absolute right-4 top-[10px]' onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={faEye} className={!showPassword ? 'text-neutral-700 w-6' : 'text-sky-500 w-6'} />
                            </button>
                            <input onChange={(e) => setPassword(e.target.value)} name='password' type={showPassword ? 'text' : 'password'} className='border rounded-md shadow px-4 py-2 w-full' placeholder='กรอกรหัสผ่าน' />
                        </div>
                    </div>
                    <hr className='my-1' />
                    <button type='submit' className='bg-sky-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-sky-700 transition'>เข้าสู่ระบบ</button>
                </form>
            </div>
        </main>
    )
}

export default LoginPage