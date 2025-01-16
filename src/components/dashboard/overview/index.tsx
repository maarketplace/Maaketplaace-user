import { useUser } from "../../../context/GetUser";

const Overview = () => {
  const { user } = useUser();
  console.log(user)
  return (
    <div className="w-full mt-[50px] h-[80vh] max-[650px]:mt-[70px] flex items-center justify-center ">
      <div className="w-[100%] h-[50%] flex items-center justify-center flex-col gap-2">
        <img src="/login.png" alt="" className="w-[100px]" />
        <p className="text-center">Welcome to your dashboard  {user?.fullName} </p>
      </div>
    </div>
  )
}

export default Overview