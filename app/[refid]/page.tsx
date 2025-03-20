'use client'

import React, { useCallback, useEffect } from 'react'
import { useParams } from "next/navigation";
import { MdSave } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import CopyToClipboard from './CopyToClipboard';
import post_text from '../api_requests/post_text';
import get_text from '../api_requests/get_text';

const Page = () => {
    const params = useParams();
    const refid = params?.refid as string;
    const [text, setText] = React.useState<string>('');
    const [saved, setSaved] = React.useState<boolean>(false);
    const [copied, setCopied] = React.useState<boolean>(false);

    const handleSave = async () => {
        const res = await post_text(refid, text);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000); // Reset icon after 2 seconds
        }
        else {
            console.log(res.message);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
        }).catch(err => console.error("Copy failed:", err));
    }

    // Use useCallback to memoize handleRefresh
    const handleRefresh = useCallback(() => {
        get_text(refid).then(res => {
            console.log(res.data);
            setText(res.data);
        });
    }, [refid]); // Only change if refid changes

    // Now useEffect will not re-run unnecessarily
    useEffect(() => {
        handleRefresh();
    }, [handleRefresh]);

    return (
        <>
            <div className='flex gap-10 flex-col items-center h-[calc(100vh-100px)] py-10'>
                <div>
                    <p>Link to this clipboard</p>
                    <CopyToClipboard refid={refid} />

                </div>
                <div className='w-[80%] max-w-4xl'>
                    <textarea
                        className="textarea bg-base-300 border-transparent outline-none ring-0 
                            focus:outline-none focus:border-transparent 
                            focus-visible:outline-none focus-visible:ring-0 resize-none
                            w-full h-72 "
                        placeholder="Type here ..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                    <div className='flex gap-2 mt-3 px-2.5 items-center justify-between'>
                        <div className='flex gap-2'>
                            <button className='btn btn-primary' onClick={handleSave}>
                                {
                                    saved ?
                                        <FaCheck className={`w-5 h-5 text-green-500 transition-opacity duration-300 ${saved ? "opacity-100" : "opacity-0"}`} />
                                        :
                                        <MdSave className={`w-5 h-5 transition-opacity duration-300 ${saved ? "opacity-0" : "opacity-100"}`} />
                                }
                                Save
                            </button>
                            <button className='btn btn-secondary' onClick={handleCopy}>
                                {
                                    copied ?
                                        <FaCheck className={`w-5 h-5 text-green-500 transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`} />
                                        :
                                        <FaCopy className={`w-5 h-5 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`} />
                                }
                                Copy
                            </button>
                        </div>
                        <button className='btn btn-ghost' onClick={handleRefresh}><IoMdRefresh className='w-6 h-6' />Refresh</button>
                    </div>
                </div>
                <input type="file" className="file-input w-[80%] max-w-4xl" />
            </div>
        </>
    )
}

export default Page