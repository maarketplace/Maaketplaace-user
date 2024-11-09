import { useUser } from "../../../context/GetUser";

const Overview = () => {
  const { data } = useUser();
  return (
    <div className="w-full mt-[50px] h-[90vh] max-[650px]:mt-[70px] flex items-center justify-center ">
      <div className="w-[100%] h-[50%] flex items-center">
        <p className="text-center">Welcome back {data.fullName} </p>
      </div>
    </div>
  )
}

export default Overview