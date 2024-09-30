import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { userVerify } from '../../../api/mutation';
// import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { IResponseData } from '../../../interface/ResponseData';
import { IErrorResponse } from '../../../interface/ErrorData';
import Loading from '../../../loader';

interface VerificationFormData {
    verificationCode: string;
}

const VerificationSchema = yup.object({
    verificationCode: yup
        .string()
        .required('Verification code is required')
        .matches(/^\d{6}$/, 'Verification code must be exactly 6 digits')
});

const Verify = () => {
    const navigate = useNavigate();
    const form = useForm<VerificationFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(VerificationSchema) as any,
        defaultValues: {
            verificationCode: '',
        }
    });
    const { handleSubmit, register, formState: { errors }, setValue } = form;

    const { mutate, isLoading } = useMutation(['merchantverify'], userVerify, {
        onSuccess: async (data: IResponseData) => {
            toast.success(data?.data?.data?.message);
            navigate('/');
        },
        onError: (err: IErrorResponse) => {
            toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || err?.message);
        }
    });

    const onSubmit: SubmitHandler<VerificationFormData> = (data) => {
        const numericCode = Number(data.verificationCode); 
        mutate({ ...data, verificationCode: numericCode });
    };

    const handleFormSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d$/.test(value) || value === "") {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value !== "" && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
            const verificationCode = newCode.join('');
            setValue('verificationCode', verificationCode);  // Ensure setValue is called with the latest code
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && code[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text');
        
        // Check if the pasted data is exactly 6 digits
        if (/^\d{6}$/.test(pasteData)) {
            const newCode = pasteData.split('');
            setCode(newCode);
    
            // Focus on the last input field after pasting
            inputRefs.current[5]?.focus();
    
            const verificationCode = newCode.join('');
            setValue('verificationCode', verificationCode);
        }
    };
    const verificationCode = code.join('');
    setValue('verificationCode', verificationCode); 

    return (
        <div className='w-[100%] h-[100vh] flex items-center justify-center bg-[#FFC300] max-[650px]:bg-[white] max-[650px]:flex dark:bg-black'>
            <div className='w-[45%]  bg-[white] rounded-lg flex items-center justify-center flex-col gap-[20px] max-[650px]:w-[95%] p-[20px]'>
                <img src="MARKET.svg" alt="" className="max-[650px]:w-[80px]" />
                <div className="w-[70%] flex gap-[10px] items-center flex-col">
                    <label className='text-[25px] text-[#FFC300] text-center'>
                        Check your email
                    </label>
                    <p className='w-[70%] flex justify-center text-center text-[15px] max-[650px]:w-[95%] max-[650px]:text-[12px] dark:text-black'>
                        We just sent you a 6 digit verification message
                        to your email address
                    </p>
                </div>
                <div className="w-[70%] flex gap-[10px] justify-center max-[650px]:w-[100%]">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            className='w-[50px] h-[50px] border border-[#999BA1] outline-none text-center rounded-lg max-[650px]:w-[35px] max-[650px]:h-[35px] dark:text-black'
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
                <input
                    type='number'
                    {...register('verificationCode')}
                    value={verificationCode}
                />
                <b className='w-[60%] text-[red] text-[12px]'>{errors?.verificationCode?.message}</b>
                <button type="submit"
                    className='w-[55%] bg-[#FFC300] h-[40px] rounded-lg'
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <Loading/> : "Submit"}
                </button>
            </div>
 
        </div>
    );
};

export default Verify;
