import { Outlet } from "react-router-dom"

// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "../sidebar";
import { HiMenuAlt2 } from "react-icons/hi";
import { useUser } from "../../../context/GetUser";
import Bottom from "../../pages/bottomNav";
const Layout = () => {
    // const navigate = useNavigate()
    const { user } = useUser();

    const [showSideBar, setShowSidebar] = useState<boolean>(false)
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setShowSidebar(false);
        }
    };

    // Add event listener for window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);  // Cleanup listener on component unmount
        };
    }, []);
    return (
        <div className=" w-[100%] h-[90vh] dark:bg-black">
            <div className="w-[82%] h-[8%] bg-[#FFC300] p-[10px] flex items-center  rounded-bl-[20px] fixed top-0 right-0 z-[100] max-[650px]:w-[100%] max-[650px]:rounded">
                <span className="w-[30%] max-[650px]:w-[50%]">
                    <HiMenuAlt2 className=" text-[30px] hidden max-[650px]:flex text-black" onClick={() => setShowSidebar(!showSideBar)} />
                </span>
                <span className="w-[100%] flex justify-end items-center max-[650px]:w-[80%] gap-2 sticky">
                    {/* <img src={user?.image} alt="" className="w-[40px] h-[40px] rounded-[100%] object-cover " /> */}
                    <p className="text-black">{user?.fullName}</p>
                </span>
            </div>
            {
                showSideBar &&
                <div className="fixed w-[100%] top-[61px] h-[92vh] z-[100] bg-[#00000054] rounded-tl-[10px] flex">
                    <div className="w-[75%] bg-[#FFC300] h-[100%] ">
                        <SideBar setShowSidebar={setShowSidebar} />
                    </div>
                    <div className="w-[30%] h-[100%]" onClick={() => setShowSidebar(!showSideBar)}></div>
                </div>
            }
            <div className="w-[100%] h-[90%] p-[10px] dark:text-white dark:bg-black mt-[60px] max-[650px]:mt-[0px]">
                <div className="w-[100%] h-[100%] ">
                    <Outlet />
                </div>
                <div className="w-[85%] h-[8%] bg-white dark:bg-[black] fixed right-0 bottom-0 z-50 flex items-center justify-center max-[650px]:w-[100%] ">
                    <Bottom />
                </div>
            </div>

        </div>
    )
}

export default Layout