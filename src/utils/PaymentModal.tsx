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
        <div className="fixed inset-0 z-10 flex items-end justify-center bg-black bg-opacity-50">
            <div className={`bg-white dark:bg-black mb-[60px] overflow-hidden shadow-lg max-w-sm w-[100%] transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} duration-300 ease-in-out absolute bottom-0`}>
                <div className="p-4 border-b flex items-center">
                    <h2 className="text-xl font-semibold mr-2">{title}</h2>
                </div>
                <div className="p-4 flex flex-col gap-[10px]">
                    <span className='flex justify-between text-[12px]'>
                        <p>Amount:</p>
                        <p>NGN {amount}</p>
                    </span>
                    {fee && (
                        <span className='flex justify-between text-[12px]'>
                            <p>Fee: </p>
                            <p>NGN {fee}</p>
                        </span>
                    )}
                    {paymentAPI && (
                        <span className='flex justify-between text-[12px]'>
                            <p>Gateway: </p>
                            <p>{paymentAPI}</p>
                        </span>
                    )}
                    {payeeName && (
                        <span className='flex justify-between text-[12px]'>
                            <p>Name: </p>
                            <p>{payeeName}</p>
                        </span>
                    )}
                    {payeeEmail && (
                        <span className='flex justify-between text-[12px]'>
                            <p>Email: </p>
                            <p>{payeeEmail}</p>
                        </span>
                    )}
                </div>
                <div className="p-4 border-t flex justify-between">
                    {secondaryButton?.display && (
                        <button
                            className={`py-1 px-1 rounded ${secondaryButton.primary ? 'border border-gray-300 w-[40%]' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
                            onClick={secondaryButton.onClick}
                        >
                            {secondaryButton.text}
                        </button>
                    )}
                    {primaryButton?.display && (
                        <button
                            className={`py-2 px-2 rounded ${primaryButton.primary ? 'bg-[#FFC300] text-white w-[50%]' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
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
