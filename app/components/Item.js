import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function Item({ order, name, amount, price, del, id, customer, barcode }) {
    return (
        <div className='shadow-lg p-4 bg-slate-50 hover:bg-slate-200 transition rounded-lg border-b flex justify-between font-bold'>
            <div className='flex justify-start w-1/2 gap-4'>
                <div>{order}</div>
                <div>{name}</div>
            </div>
            <div className='flex justify-end w-1/2 gap-8'>
                <div>{amount} ชิ้น</div>
                <div>{price} บาท</div>
                {!customer && (
                    <span className='hover:cursor-pointer'
                        onClick={() => del({ id, barcode, amount })}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                )}
            </div>

        </div>
    )
}

export default Item