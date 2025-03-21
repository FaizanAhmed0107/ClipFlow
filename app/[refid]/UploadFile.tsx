import React, { useCallback, useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import get_name from "../api_requests/get_name";
import { LuBookOpenText } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import upload_file from "../api_requests/upload_file";
import delete_file from "../api_requests/delete_file";
import { Bounce, toast } from "react-toastify";

interface Props {
    fileUrl: string;
    refid: string;
    setFileUrl: (url: string) => void;
}

const UploadFile = ({ fileUrl, refid, setFileUrl }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            const res = await upload_file(refid, file);
            if (res.success) {
                setFileUrl(res.data.url);
            } else {
                toast.error(res.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } else {
            toast.error('No file selected!', {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const handleView = () => {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
    };

    const handleDelete = async () => {
        const modal = document.getElementById("deleteModal") as HTMLDialogElement;
        modal.close(); // Close modal after confirming
        try {
            const res = await delete_file(refid);
            if (res.success) {
                setFileUrl("None");
            } else {
                toast.error(res.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Error deleting file:", {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const handleGetName = useCallback(() => {
        get_name(refid, fileUrl).then(res => {
            if (res.success) {
                setName(res.data.name);
            } else {
                toast.error(res.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        });
    }, [refid, fileUrl]);

    useEffect(() => {
        if (fileUrl !== 'None') {
            handleGetName();
        }
    }, [fileUrl, handleGetName]);

    return (
        fileUrl === 'None' ? (
            <div className="flex w-[80%] gap-2.5 justify-between max-w-4xl py-10">
                <input type="file" onChange={handleFileChange} className="file-input w-full border rounded-lg focus:outline-none" />
                <button className="btn btn-primary" onClick={handleFileUpload}>
                    <FaCloudUploadAlt className="w-5 h-5" /> Upload
                </button>
            </div>
        ) : (
            <div className="flex w-[80%] gap-2.5 justify-between max-w-4xl py-10 content-center">
                <p className="w-full border rounded-lg flex items-center p-2">{name}</p>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleView}>
                    <LuBookOpenText className="w-5 h-5" /> View
                </button>
                <button className="btn btn-error flex items-center gap-2" onClick={() => (document.getElementById("deleteModal") as HTMLDialogElement).showModal()}>
                    <MdDeleteForever className="w-5 h-5" /> Delete
                </button>

                {/* DaisyUI Delete Confirmation Modal */}
                <dialog id="deleteModal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete this file?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDelete}>Yes, Delete</button>
                            <button className="btn" onClick={() => (document.getElementById("deleteModal") as HTMLDialogElement).close()}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            </div>
        )
    );
};

export default UploadFile;
