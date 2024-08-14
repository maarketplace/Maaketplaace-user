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
            <div className="bg-white overflow-hidden shadow-lg max-w-sm w-[300px] absolute max-[650px]:bottom-[55px] max-[650px]:w-[100%] max-[650px]:rounded-t-lg dark:bg-black dark:text-white dark:border">
                <div className="p-4 border-b flex items-center">
                    <h2 className="text-xl font-semibold mr-2">{title}</h2>
                </div>
                <div className="p-4 flex flex-col gap-[10px] dark:text-white">
                    <span className='flex justify-between'>
                        <p>Amount:</p>
                        <p>NGN {amount}</p>
                    </span>
                    {fee &&
                        <span className='flex justify-between'>
                            <p>Fee: </p>
                            <p>NGN {fee}</p>
                        </span>
                    }
                    {paymentAPI &&
                        <span className='flex justify-between'>
                            <p>Gateway: </p>
                            <p>{paymentAPI}</p>
                        </span>
                    }
                    {payeeName &&
                        <span className='flex justify-between'>
                            <p>Customer Name: </p>
                            <p>{payeeName}</p>
                        </span>
                    }
                    {payeeEmail &&
                        <span className='flex justify-between'>
                            <p>Customer Email: </p>
                            <p>{payeeEmail}</p>
                        </span>
                    }
                </div>
                <div className="p-4 border-t flex justify-between">
                    {secondaryButton?.display && (
                        <button
                            className={`py-1 px-1 rounded ${secondaryButton.primary ? '  border border-gray-300 w-[40%]' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
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
