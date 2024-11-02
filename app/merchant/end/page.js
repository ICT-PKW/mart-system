"use client"
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Context } from '@/app/components/Context';

function EndPrintPage() {
    const { GlobalItem } = useContext(Context);
    const router = useRouter();

    useEffect(() => {
        window.print();
        setTimeout(() => {
            router.replace(`/merchant/checkout?counter=${counter}`)
        }, 1000);
    }, []);

    useEffect(() => {
        console.log('This is global item');
        console.log(GlobalItem);
    }, [])

    const months = [
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
    ];

    const { total, change, counter, net, profit, last_open } = GlobalItem;
    return (
        <>
            <div className='pt-4 flex flex-col items-center justify-center bg-white gap-[10px]'>
                {/* <img className='w-24 mt-3' src="/img/PKWLogo.png" /> */}
                <h4>
                    มินิมาร์ท โรงเรียนภูเก็ตวิทยาลัย
                </h4>

                <h4 className='font-light'>
                    {`${new Date().getUTCDate()} ${months[new Date().getUTCMonth()]} ${new Date().getFullYear() + 543
                        } `}{" "}
                    {`${new Date().getHours() <= 9
                        ? `0${new Date().getHours()}`
                        : new Date().getHours()
                        }:${new Date().getMinutes() <= 9
                            ? `0${new Date().getMinutes()}`
                            : new Date().getMinutes()
                        } น. `}
                </h4>
                <div className='text-center'>
                    <h4 className='font-light'>
                        บิลเครื่องที่{" "}
                        {counter === "1"
                            ? 1
                            : counter === "2"
                                ? 2
                                : "admin"}
                    </h4>
                </div>

                <h4 className='font-mono'>
                    ===============================
                </h4>
            </div>

            <div className='space-y-1 flex flex-col items-center'>
                <h4 className='font-light text-right px-8 mt-3'>
                    รายได้ทั้งหมด{" "}
                    {total?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                    บาท
                </h4>
                <h4 className='font-light text-right px-8 mt-3'>
                    เงินคงที่{" "}
                    {change?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                    บาท
                </h4>
                <h4 className='font-light text-center px-8 mt-3'>
                    สุทธิ{" "}<br />
                    {
                        net >= 0 ? `กำไร ${net?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} บาท` : `ขาดทุน ${(-net)?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} บาท`
                    }
                </h4>
                <h4 className='font-mono'>
                    ===============================
                </h4>
{/*                 

                <div
                        className='flex justify-between items-center w-full px-8 font-light'>
                        <div className='w-1/3'>
                            <h4>{total}</h4>
                        </div>
                        <div className='w-1/3'>
                            <h4 className='text-right'>
                                x {net?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                            </h4>
                        </div>
                        <div className='w-1/3'>
                            <h4 className='text-right'>
                                {change?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} บาท
                            </h4>
                        </div>
                    </div> */}
                {/* {GlobalItem.type !== "qr" && (
                    <>
                        <h4 style={{ fontWeight: "lighter" }}>
                            รับเงินมา{" "}
                            {GlobalItem.total
                                ?.toString()
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            บาท
                        </h4>
                        <h4 style={{ fontWeight: "lighter" }}>
                            เงินทอน{" "}
                            {GlobalItem.change
                                ?.toString()
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            บาท
                        </h4>
                    </>
                )} */}
            </div>
        </>
    )
}

export default EndPrintPage