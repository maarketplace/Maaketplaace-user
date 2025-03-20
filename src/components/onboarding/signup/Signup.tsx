import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast';
import { UserSignUpInterface } from "../../../interface/Signupinterface";
import { SignUpSchema as SignUpValidationSchema } from "../../../schema/SignUpSchema";
import { userSignup } from "../../../api/mutation";
import { IErrorResponse } from "../../../interface/ErrorData";
import Loading from "../../../loader";


function UserSignupForm() {
    const [showPassword, setShow] = useState<boolean>(false);
    const [showConfirmassword, setShowConfirmPassword] = useState<boolean>(false);

    const form = useForm<UserSignUpInterface>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(SignUpValidationSchema) as any
    });
    const { register, handleSubmit, formState: { errors } } = form;
    const navigate = useNavigate()

    const { mutate, isLoading } = useMutation(['userSignup'], userSignup, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: async (data: any) => {
            toast.success(data?.data?.data?.message)
            navigate('/verify')
        },
        onError: (err: IErrorResponse) => {
            toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || err?.message)
            if (err?.response?.data?.message == "User already exists") {
                navigate('/')
            }
        }
    })
    const onSubmit: SubmitHandler<UserSignUpInterface> = (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...others } = data
        mutate(others)
        console.log(others);
    };

    const handleButtonClick = () => {
        handleSubmit(onSubmit)();
        console.log('Button clciked')
    };
    return (
        <div
            className=" w-[55%] flex items-center justify-center flex-col gap-[30px] max-[650px]:w-[100%] max-[650px]:gap-0 max-[650px]:mb-[40px] max-[650px]:mt-[20px]"
        >
            <div className="w-[70%] flex items-center justify-center flex-col gap-[10px] max-[650px]:w-[100%]" >
                <img src="MARKET.svg" alt="" className="max-[650px]:w-[80px]" />
                <span className="flex items-center justify-center flex-col gap-[10px] max-[650px]:w-[100%]" >
                    <h2 className="text-2xl max-[650px]:text-[18px] max-[650px]:m-[20px] text-center">Create your maarketplaace account</h2>
                </span>
            </div>
            <div className="w-[80%]  flex items-center gap-[10px] max-[650px]:flex-wrap max-[650px]:w-[90%] ">
                <span className="w-[100%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:mt-[10px]">
                    <label className="text-sm">Full Name</label>
                    <div className="w-[100%] border-[#999BA1]  border p-2">
                        <input
                            type="text"
                            placeholder="Ex: John Doe"
                            className="w-[100%] outline-none h-[30px] text-sm bg-transparent"
                            {...register('fullName')}
                        />
                    </div>
                    <b className='w-[100%] text-[red] text-[12px] max-[650px]:w-[90%]'>{errors.fullName?.message}</b>
                </span>
            </div>
            <div className="w-[80%]  flex items-center gap-[10px] max-[650px]:flex-wrap max-[650px]:w-[90%]">
                <span className="w-[50%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:mt-[10px]">
                    <label className="text-sm">Phone Number</label>
                    <div className="w-[100%] border-[#999BA1]  border p-2">
                        <input
                            type="number"
                            placeholder="Ex: 070555444111"
                            className="w-[100%] outline-none h-[30px] text-sm bg-transparent"
                            {...register('phoneNumber')}
                        />
                    </div>
                    <b className='w-[100%] text-[red] text-[12px] max-[650px]:w-[90%]'>{errors.phoneNumber?.message}</b>
                </span>
                <span className="w-[50%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:mt-[10px]">
                    <label className="text-sm">Email</label>
                    <div className="w-[100%] border-[#999BA1] border p-2">
                        <input
                            type="email"
                            placeholder="Ex: Maguire@FlexUI.com"
                            className="w-[100%] outline-none h-[30px] text-sm bg-transparent"
                            {...register('email')}
                        />
                    </div>
                    <b className='w-[100%] text-[red] text-[12px] max-[650px]:w-[90%]'>{errors.email?.message}</b>
                </span>
            </div>
            <div className="w-[80%]  flex items-center gap-[10px] max-[650px]:flex-wrap  max-[650px]:w-[90%]">
                <span className="w-[50%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:mt-[10px]">
                    <label className="text-sm">Password</label>
                    <div className="flex w-[100%] border-[#999BA1] items-center  border p-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-[90%] outline-none h-[30px] text-sm bg-transparent"
                            {...register('password')}
                        />
                        <span
                            onClick={() => setShow(!showPassword)}
                            className=""

                        >
                            {!showPassword ? <FaEye size={20} className="dark:text-[white]" /> : <FaEyeSlash size={20} className="dark:text-[white]" />}
                        </span>
                    </div>
                    <b className='w-[100%] text-[red] text-[12px] max-[650px]:w-[90%]'>{errors.password?.message}</b>
                </span>
                <span className="w-[50%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:mt-[10px]">
                    <label className="text-sm">Confirm Password</label>
                    <div className="flex w-[100%] items-center  border-[#999BA1] border p-2">
                        <input
                            type={showConfirmassword ? "text" : "password"}
                            placeholder="Confirm password"
                            className="w-[90%] outline-none h-[30px] text-sm bg-transparent"
                            {...register('confirmPassword')}
                        />
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmassword)}
                            className=""

                        >
                            {!showConfirmassword ? <FaEye size={20} className="dark:text-[white]" /> : <FaEyeSlash size={20} className="dark:text-[white]" />}
                        </span>
                    </div>
                    <b className='w-[100%] text-[red] text-[12px] max-[650px]:w-[90%]'>{errors.confirmPassword?.message}</b>
                </span>
            </div>
            <div className="w-[80%] flex items-center justify-center max-[650px]:w-[90%] max-[650px]:mt-[10px]">
                <button
                    type="submit"
                    className="w-[100%] h-[50px] outline-none p-2 bg-[#FFC300] rounded-lg text-[20px] dark:text-[black] "
                    onClick={handleButtonClick}
                    disabled={isLoading}
                >
                    {isLoading ? <Loading /> : "Create account"}
                </button>
            </div>
            <div className="w-[70%] flex items-center justify-center gap-[10px] max-[650px]:w-[90%] max-[650px]:flex-wrap max-[650px]:mt-[10px] ">

                <h4 className="">Already have an account?</h4>
                <h4
                    className="text-[#FFC300] cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    Sign in
                </h4>
            </div>
        </div>
    )
}

export default UserSignupForm