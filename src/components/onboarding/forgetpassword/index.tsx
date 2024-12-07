import { useMutation } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordSchema } from '../../../schema/LoginSchema';
import { userForgotPassword } from '../../../api/mutation';
import { ForgotPasswordInterface } from '../../../interface/LoginInterface';
import { IErrorResponse } from '../../../interface/ErrorData';
import Loading from '../../../loader';

function ForgotPassword() {
    const navigate = useNavigate()
    const form = useForm<ForgotPasswordInterface>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(ForgotPasswordSchema) as any
    });
    const { register, handleSubmit, formState: { errors } } = form;
    const { isLoading, mutate } = useMutation(['merchantForgotPassword'], userForgotPassword, {
        onSuccess: (data) => {
            console.log(data)
            toast.success(data?.data?.data?.message)
        },
        onError: (error: IErrorResponse) => {
            console.log(error)
        }
    });

    const onSubmit: SubmitHandler<ForgotPasswordInterface> = (data) => {
        mutate(data.email)
    };
    const handleForgotSubmit = () => {
        handleSubmit(onSubmit)();
    };
    return (
        <div className='w-[100%] h-[100vh] flex items-center justify-center bg-[#FFC300] max-[650px]:bg-[white] max-[650px]:flex  dark:bg-black dark:text-[white]'>
            <div className='w-[45%] h-[55vh] bg-[white] rounded-lg flex items-center justify-center flex-col gap-[20px] max-[650px]:w-[100%]  dark:bg-black dark:text-[white]'>
                <img src="MARKET.svg" alt="" className=" w-[100px] max-[650px]:w-[80px]" />
                <div
                    className=" w-[70%] flex items-center justify-center flex-col gap-[20px] max-[650px]:w-[90%] "
                >
                    <h3 className='italic text-center max-[650px]:text-[12px] text-wrap'>We'll send you a link to reset your password. Be sure to check your email (and maybe your spam folder too)</h3>
                    <div className=" w-[100%] flex flex-col gap-[10px] max-[650px]:w-[100%]">
                        <label>Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="Email"
                            className="w-[100%] h-[50px] border border-[#999BA1] p-[10px] outline-none bg-transparent"
                            {...register('email')}
                        />
                    </div>
                    <b className=''>{errors.email?.message}</b>
                    <button
                        onClick={handleForgotSubmit}
                        className="w-[100%] h-[50px] outline-none p-2 bg-[#FFC300] rounded-lg max-[650px]:w-[100%]"
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <Loading /> : " Send Reset Email"
                        }
                    </button>
                    <div className="w-[70%] flex items-center justify-center gap-[10px] max-[650px]:w-[90%] max-[650px]:flex-wrap ">

                        <h4 className="max-[650px]:text-[13px]">Remember your password?</h4>
                        <h4
                            className="text-[#0c50af] cursor-pointer max-[650px]:text-[13px]"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword