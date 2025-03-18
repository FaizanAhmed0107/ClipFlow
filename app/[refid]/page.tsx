'use client'

import React from 'react'
import { useParams } from "next/navigation";
import { MdSave } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import CopyToClipboard from './CopyToClipboard';

const page = () => {
    const params = useParams();
    const refid = params?.refid as string;

    return (
        <>
            <div className='flex gap-10 flex-col items-center h-[calc(100vh-100px)] py-10'>
                <div>
                    <p>Link to this clipboard</p>
                    {/* <label className="input">
                        <p className='text-2xl'>{refid}</p>
                        <span className="label"> <FaCopy className='w-5 h-5' /></span>
                    </label> */}
                    <CopyToClipboard refid={refid} />

                </div>
                <div className='w-[80%] max-w-4xl'>
                    <textarea
                        className="textarea bg-base-300 border-transparent outline-none ring-0 
                            focus:outline-none focus:border-transparent 
                            focus-visible:outline-none focus-visible:ring-0 resize-none
                            w-full h-72 "
                        placeholder="Type here ..."
                    ></textarea>
                    <div className='flex gap-2 mt-3 px-2.5 items-center justify-between'>
                        <div className='flex gap-2'>
                            <button className='btn btn-primary'><MdSave className='w-6 h-6' />Save</button>
                            <button className='btn btn-secondary'><FaCopy className='w-5 h-5' />Copy</button>
                        </div>
                        <button className='btn btn-ghost'><IoMdRefresh className='w-6 h-6' />Refresh</button>
                    </div>
                </div>
                <input type="file" className="file-input w-[80%] max-w-4xl" />
            </div>
        </>
    )
}

export default page