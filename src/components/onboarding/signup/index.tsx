import UserSignupForm from './Signup'
// import AdminSignupForm from './SignUpForm'
function Signup() {
    return (
        <div className=' w-[100%] flex justify-between  dark:bg-[#141414] dark:text-[white]'>
            <UserSignupForm/>
            <div className='h-[100vh] w-[45%] bg-[#FFC300] rounded-tl-lg rounded-bl-lg  items-center justify-center hidden md:flex'>
                <img src="./Loginimage.png" alt="" className="h-[60%] w-[70%] max-[650px]:text-center"  />
            </div>
        </div>
    )
}

export default Signup