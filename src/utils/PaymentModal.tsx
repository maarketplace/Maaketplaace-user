import React, { useEffect } from 'react';

interface ButtonProps {
    text: React.ReactNode;
    onClick?: () => void;
    display?: boolean;
    primary?: boolean;
}

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onClose?: () => void;
    title?: string;
    amount?: string;
    fee?: string;
    paymentAPI?: string;
    payeeName?: string;
    payeeEmail?: string;
    primaryButton?: ButtonProps;
    secondaryButton?: ButtonProps;
}

const PaymentModal: React.FC<ModalProps> = ({
    isOpen,
    title,
    amount,
    fee,
    paymentAPI,
    payeeName,
    payeeEmail,
    primaryButton,
    secondaryButton,
}) => {
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="relative w-full h-full top-0 left-0 right-0 bottom-0 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 max-[650px]:items-end">
            <div className="bg-white overflow-hidden shadow-lg max-w-sm w-[300px] absolute max-[650px]:bottom-[34px] max-[650px]:w-[100%]">
                <div className="p-4 border-b flex items-center">
                    <h2 className="text-xl font-semibold mr-2">{title}</h2>
                </div>
                <div className="p-4">
                    <p>Amount: {amount}</p>
                    <p>Fee: {fee}</p>
                    <p>Gateway: {paymentAPI}</p>
                    <p>Customer Name: {payeeName}</p>
                    <p>Customer Email: {payeeEmail}</p>
                </div>
                <div className="p-4 border-t flex justify-between">
                    {secondaryButton?.display && (
                        <button
                            className={`py-2 px-4 rounded ${secondaryButton.primary ? ' text-black' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
                            onClick={secondaryButton.onClick}
                        >
                            {secondaryButton.text}
                        </button>
                    )}
                    {primaryButton?.display && (
                        <button
                            className={`py-2 px-4 rounded ${primaryButton.primary ? 'bg-[#FFC300] text-white' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
                            onClick={primaryButton.onClick}
                        >
                            {primaryButton.text}
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
