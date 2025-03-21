import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, } from "react-icons/fa";
import { useMutation } from 'react-query'
import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginInterface } from "../../../interface/LoginInterface";
import { AdminLoginSchema } from "../../../schema/LoginSchema";
import { userLogin } from "../../../api/mutation";
import Loading from "../../../loader";
import { IErrorResponse } from "../../../interface/ErrorData";
import { IResponseData } from "../../../interface/ResponseData";
import { useAuth } from "../../../context/Auth";
import { cacheAuthData } from "../../../utils/auth.cache.utility";

function UserLoginForm() {
    const { setIsUserAuthenticated } = useAuth();
    const [showPassword, setShow] = useState<boolean>(false);
    const navigate = useNavigate()
    const form = useForm<LoginInterface>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(AdminLoginSchema) as any
    });
    const { register, handleSubmit, formState: { errors } } = form;

    const { mutate, isLoading } = useMutation(['userlogin'], userLogin, {
        onSuccess: async (data: IResponseData) => {
            cacheAuthData(data?.data?.data?.token)
            console.log(cacheAuthData)
            toast.success(data?.data?.message);
            setIsUserAuthenticated(true)
            const redirectPath = localStorage.getItem('redirectPath');
            if (redirectPath) {
                navigate(redirectPath);
                localStorage.removeItem('redirectPath');
                cacheAuthData(data?.data?.data?.token)
                setIsUserAuthenticated(true)
            } else {
                navigate('/');
                setIsUserAuthenticated(true)
            }
        },
        onError: (err: IErrorResponse) => {
            toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || err?.message);
            if(err?.response?.data?.message ==  "Please verify your account"){
                navigate('/verify')
            }
        }
    })

    const onSubmit: SubmitHandler<LoginInterface> = (data) => {
        localStorage.setItem('userEmail', data.email);
        mutate(data)
    };

    const handleButtonClick = () => {
        handleSubmit(onSubmit)();
    };
    return (
        <div className="h-[100vh] w-[55%] flex items-center flex-col gap-5 max-[650px]:w-[100%]">
            <span className="w-[100%] p-[10px] max-[650px]:w-[100%] flex gap-[20px] justify-end items-center" >
                <p className="cursor-pointer bg-[#FFC300] w-[100px] h-[30px] flex items-center justify-center text-[14px] rounded-[8px] "> <a href="http://merchant.maarketplaace.com">Start Selling</a></p>
            </span>
            <div className="w-[70%] flex items-center justify-center flex-col gap-[10px] max-[650px]:w-[100%]" >
                <img src="MARKET.svg" alt="" className="max-[650px]:w-[80px]" />
                <span className="flex items-center justify-center flex-col gap-[10px] max-[650px]:w-[100%]" >
                    <h2 className="text-2xl max-[650px]:text-[15px]">Welcome  Back to Maarketplaace</h2>
                    <p className="text-center max-[650px]:text-[12px] text-wrap">Continue buying wonderful products</p>
                </span>
            </div>
            <div className='w-[70%] flex flex-col gap-[10px] max-[650px]:w-[90%] ' >
                <label htmlFor="email" className="max-[650px]:text-[15px]"> Email</label>
                <input
                    required
                    type="email"
                    {...register('email')}
                    placeholder="Enter your Email"
                    className="w-[100%] h-[50px] outline-none p-2 border border-[#999BA1] max-[650px]:h-[40px] bg-transparent max-[650px]:text-[14px]"
                />
            </div>
            <b className='w-[70%] text-[red] text-sm max-[650px]:w-[90%]'>{errors.email?.message}</b>
            <div className='w-[70%] flex gap-[10px] flex-col max-[650px]:w-[90%] '  >
                <label htmlFor="password" className="max-[650px]:text-[15px]">Password</label>
                <div className=" w-[100%] border border-[#999BA1] flex items-center  ">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Password"
                        className="w-[90%] h-[50px] outline-none p-2 max-[650px]:h-[40px] bg-transparent max-[650px]:text-[14px] "
                        {...register('password')}
                    />
                    <span
                        onClick={() => setShow(!showPassword)}
                        className=""
                        style={{ background: "none", border: "none" }}
                    >
                        {!showPassword ? <FaEye   className="text-[30px] w-[15px]" /> : <FaEyeSlash   className="text-[30px] w-[15px]" />}
                    </span>
                </div>
                <b className='w-[70%] text-[red] text-sm'>{errors.password?.message}</b>
            </div>
            <div className="w-[70%] flex items-center justify-center max-[650px]:w-[90%]">
                <button
                    type="submit"
                    onClick={handleButtonClick}
                    disabled={isLoading}
                    className="w-[100%] h-[50px] outline-none p-2 bg-[#FFC300] rounded-lg text-black"
                >
                    {isLoading ? <Loading/> : "Login"}
                </button>

            </div>
            <div className="w-[70%] flex items-center justify-center gap-[10px] max-[650px]:w-[90%] max-[650px]:flex-wrap ">

                <h4 className="">Don't have an account?</h4>
                <h4
                    className="text-[#FFc300] cursor-pointer"
                    onClick={() => navigate('/create-account')}
                >
                    Create an Account
                </h4>
            </div>
            <h4 className="text-[red] cursor-pointer" onClick={() => navigate('/userForgotPassword')}>Forgot Password?</h4>
        </div>
    )
}

export default UserLoginForm