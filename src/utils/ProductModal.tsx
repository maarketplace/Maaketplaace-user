import React from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return <div className="fixed h-[100vh] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-[black] rounded-lg shadow-lg w-[70%] max-[650px]:w-[95%] max-[650px]:h-[80%]">
            <div className="relative overflow-scroll h-[100%] p-4">
                <button
                    className="absolute top-2 right-[20px] max-[650px]:top-5 max-[650px]:right-[25px] text-[#FFc300] dark:text-[#FFC300]"
                    onClick={onClose}
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    </div>;
};

export default Modal;
