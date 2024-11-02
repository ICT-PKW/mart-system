import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto py-4">
          <p className="font-bold text-2xl mt-8 mb-2">สวัสดี, ผู้ขาย</p>
          <hr className="mb-4" />
          <div className="grid grid-cols-2 gap-4 w-full">
            <Link href={`/merchant/checkout?counter=${process.env.COUNTER}`}>
              <div className="bg-white border p-4 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-slate-50 group">
                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">เข้าสู่ร้านค้า <FontAwesomeIcon icon={faArrowRight} className="w-4" /></h1>
                <hr />
                <p className="text-neutral-500 mt-2">สำหรับผู้ขาย | จัดการการซื้อขาย</p>
              </div>
            </Link>
            <Link href='/admin'>
              <div className="bg-white border p-4 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-slate-50 group">
                <h1 className="text-xl font-semibold mb-1 inline-flex gap-2 group-hover:gap-4 transition-all duration-100">จัดการสต๊อก <FontAwesomeIcon icon={faArrowRight} className="w-4" /></h1>
                <hr />
                <p className="text-red-500 mt-2">สำหรับแอดมินเท่านั้น | จัดการสต๊อก</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
