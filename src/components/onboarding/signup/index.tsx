import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaAt, FaUserCircle, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'


import toast from 'react-hot-toast';
import { UserSignUpInterface } from "../../../interface/Signupinterface";
import { SignUpSchema } from "../../../schema/SignUpSchema";
import { userSignup } from "../../../api/mutation";


interface IErrorResponse {
    message: any;
    response: {
        data: {
            error: any;
            message: string
        }
    };
}
function UserSignupForm() {
    const [showPassword, setShow] = useState<boolean>(false);
    const [showConfirmassword, setShowConfirmPassword] = useState<boolean>(false);

    const form = useForm<UserSignUpInterface>({
        resolver: yupResolver(SignUpSchema) as any
    });
    const { register, handleSubmit, formState: { errors } } = form;
    const navigate = useNavigate()

    const { mutate, isLoading } = useMutation(['userSignup'], userSignup, {
        onSuccess: async (data: any) => {
            console.log(data)
            toast.success(data?.data?.data?.message)
            navigate('/userverify')
        },
        onError: (err: IErrorResponse) => {
            toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || err?.message)
        }
    })
    const onSubmit: SubmitHandler<UserSignUpInterface> = (data) => {
        const { confirmPassword, ...others } = data
        mutate(others)
        console.log(others);
        // console.log("clikedf")
    };

    const handleButtonClick = () => {
        handleSubmit(onSubmit)();
        console.log('hey this is clciked')
    };
    return (
        <div
            className="AdminSignupForm_Main"
        >
            <header className="Adminsignup_Header">
                <img src='/maarketplaacelogo.png' className="AdminSignupMainLogo" />
            </header>
            <div className="AdminSignupForm_Main_InputWrap">
                <FaUserCircle size={20} color="gold" />
                <input
                    type="text"
                    placeholder="Full Name"
                    className="AdminSignupForm_Main_Input"
                    {...register('fullName')}
                />
            </div>
            <b className='adminLogin_error_msg'>{errors.fullName?.message}</b>
            <div className="AdminSignupForm_Main_InputWrap">
                <FaAt size={20} color="gold" />
                <input
                    type="email"
                    placeholder="Email"
                    className="AdminSignupForm_Main_Input"
                    {...register('email')}
                />
            </div>
            <b className='adminLogin_error_msg'>{errors.email?.message}</b>
            <div className="AdminSignupForm_Main_InputWrap">
                <FaPhoneAlt size={20} color="gold" />
                <input
                    type="number"
                    placeholder="Phone Number"
                    className="AdminSignupForm_Main_Input"
                    {...register('phoneNumber')}
                />
            </div>
            <b className='adminLogin_error_msg'>{errors.phoneNumber?.message}</b>
            <div className="AdminSignupForm_Parent_InputWrap" >
                <div className="AdminSignupForm_InputWrap">
                    <FaLock size={20} color="gold" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="AdminSignupForm_Input"
                        {...register('password')}
                    />
                    <span
                        onClick={() => setShow(!showPassword)}
                        className="Adminsignup_Eye"

                    >
                        {!showPassword ? <FaEye size={20} color="black" /> : <FaEyeSlash size={20} color="black" />}
                    </span>
                </div>
                <b className='adminLogin_error_msg'>{errors.password?.message}</b>
                <div className="AdminSignupForm_InputWrap">
                    <FaLock size={20} color="gold" />
                    <input
                        type={showConfirmassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="AdminSignupForm_Main_Input"
                        {...register('confirmPassword')}
                    />
                    <span
                        onClick={() => setShowConfirmPassword(!showConfirmassword)}
                        className="Adminsignup_Eye"

                    >
                        {!showConfirmassword ? <FaEye size={20} color="black" /> : <FaEyeSlash size={20} color="black" />}
                    </span>
                </div>
                <b className='adminLogin_error_msg'>{errors.confirmPassword?.message}</b>
            </div>
            <div className="AdminSignupButtonWrap">
                <button
                    type="submit"
                    className="AdminSignup_Submit_button"
                    onClick={handleButtonClick}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Create account"}
                </button>
                <h4>or</h4>
                <h4
                    onClick={() => navigate("/")}
                    className="AdminSignUp_SignIn_Button"
                >
                    Sign In
                </h4>
            </div>
        </div>
    )
}

export default UserSignupForm