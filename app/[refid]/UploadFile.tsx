import React, { useCallback, useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import get_name from "../api_requests/get_name";
import { LuBookOpenText } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import upload_file from "../api_requests/upload_file";

interface Props {
    fileUrl: string,
    refid: string,
    setFileUrl: (url: string) => void
}


const UploadFile = ({ fileUrl, refid, setFileUrl }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = React.useState<string>('');


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            const res = await upload_file(refid, file as File);
            if (res.success) {
                setFileUrl(res.data.url);
            } else {
                console.log(res.message);
            }
        }
        else {
            console.log('empty');
        }
    };

    const handleView = () => {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
    };

    const handleGetName = useCallback(() => {
        get_name(refid, fileUrl).then(res => {
            if (res.success) {
                setName(res.data.name);
            }
            else {
                console.log(res.message);
            }
        });
    }, [refid, fileUrl]);

    useEffect(() => {
        if (fileUrl !== 'None') {
            handleGetName();
        }
    }, [fileUrl, handleGetName]);

    return (
        (fileUrl === 'None') ?
            < div className="flex w-[80%] gap-2.5 justify-between max-w-4xl py-10" >
                <input type="file" onChange={handleFileChange} className="file-input w-full border rounded-lg focus:outline-none" />
                <button className='btn btn-primary' onClick={handleFileUpload}>
                    <FaCloudUploadAlt className="w-5 h-5" /> Upload
                </button>
            </div >
            :
            <div className="flex w-[80%] gap-2.5 justify-between max-w-4xl py-10 content-center">
                <p className="w-full border rounded-lg flex items-center p-2">{name}</p>
                <button className='btn btn-primary flex items-center gap-2' onClick={handleView}>
                    <LuBookOpenText className="w-5 h-5" /> View
                </button>
                <button className='btn btn-error flex items-center gap-2'>
                    <MdDeleteForever className="w-5 h-5" /> Delete
                </button>
            </div>

    );
};

export default UploadFile;
