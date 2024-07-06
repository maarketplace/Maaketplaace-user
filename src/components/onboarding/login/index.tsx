import { Outlet } from "react-router-dom"
import LoginForm from "./LoginForm"

function Login() {
    return (
        <div className=' w-[100%] flex justify-between  '>
            <LoginForm />
            <div className='h-[100vh] w-[45%] bg-[#FFC300] rounded-tl-lg rounded-bl-lg  items-center justify-center hidden md:flex'>
                <img src="./Loginimage.png" alt="" className="h-[60%] w-[70%] max-[650px]:text-center"  />
            </div>
            <Outlet />
        </div>
    )
}

export default Login

