import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone, Accept } from 'react-dropzone';
import { IUploadQuicks } from '../interface/UploadQuicks';
import { UploadQuicksSchema } from '../schema/UploadQuicksSchema';
import { RiImageAddLine } from 'react-icons/ri';
import { GoVideo } from "react-icons/go";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const accept: Accept = {
    'image/*': [], // Accept all image types
    'video/*': [], // Accept all video types
};
const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<IUploadQuicks>({
        resolver: yupResolver(UploadQuicksSchema) as any,
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate, isLoading } = useMutation(
        (formData: FormData) => axios.post('/api/submit', formData),
        {
            onSuccess: () => {
                setErrorMessage('');
                onClose();
            },
            onError: (error: any) => {
                setErrorMessage(error?.message);
            },
        }
    );

    // Handlers for Image Dropzone
    const onDropImage = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedImage(file);
            setSelectedVideo(null); // Reset video if an image is selected
            setValue('image', file, { shouldValidate: true });
        }
    }, [setValue]);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
        onDrop: onDropImage,
        accept,
        multiple: false,
    });

    // Handlers for Video Dropzone
    const onDropVideo = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedVideo(file);
            setSelectedImage(null); // Reset image if a video is selected
            setValue('video', file, { shouldValidate: true });
        }
    }, [setValue]);

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
        onDrop: onDropVideo,
        accept,
        multiple: false,
    });

    const onSubmit = (data: IUploadQuicks) => {
        const formData = new FormData();
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        if (selectedVideo) {
            formData.append('video', selectedVideo);
        }
        formData.append('message', data.message);

        mutate(formData);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-10">
                <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-semibold text-center mb-6">Create a Post</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className='w-full flex gap-[20px]'>
                        <div className="w-[150px]  flex flex-col gap-2">
                            <div
                                {...getImageRootProps()}
                                className={` w-[120px] h-10 flex items-center justify-center rounded-md cursor-pointer ${isImageDragActive ? 'bg-gray-100' : 'bg-[#FFc300] text-black'
                                    }`}
                            >
                                <input {...getImageInputProps()} />
                                {!selectedImage ? (
                                    <div className='flex gap-2 items-center'>
                                        <RiImageAddLine />
                                        <p className="text-black text-sm">Add image</p>
                                    </div>
                                )
                            :
                            <p>Add image</p>
                            }
                            </div>
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                        </div>
                        <div className="w-[150px] flex flex-col gap-2">
                            <div
                                {...getVideoRootProps()}
                                className={`w-[120px]  h-10 flex items-center justify-center rounded-md cursor-pointer ${isVideoDragActive ? 'bg-gray-100' : 'bg-[#FFc300] text-black'
                                    }`}
                            >
                                <input {...getVideoInputProps()} />
                                {!selectedVideo && (
                                    <div className='flex gap-2 items-center'>
                                        <GoVideo />
                                        <p className="text-black text-sm">Add video</p>
                                    </div>
                                )}
                            </div>
                            {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video.message}</p>}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            {...control.register('message')}
                            placeholder="Write something..."
                            className="shadow-sm focus:ring-[#FFc300] outline-none text-black focus:border-[#FFc300] mt-1 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                            rows={4}
                        ></textarea>
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <div className="w-full">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#FFc300] text-white font-semibold rounded-md shadow hover:bg-[#ffc4009f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Post...' : 'Create Post'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 space-y-4">
                    {selectedImage && (
                        <div>
                            <p className="text-lg font-semibold mb-2">Image Preview</p>
                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="rounded-lg h-[100px] shadow-md max-h-64 object-cover w-[100px]" />
                        </div>
                    )}

                    {selectedVideo && (
                        <div>
                            <p className="text-lg font-semibold mb-2">Video Preview</p>
                            <video controls className="rounded-lg shadow-md max-h-64 w-full">
                                <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
                {errorMessage && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default PostModal;
