import { FiLogOut } from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5"
import { RxDashboard } from "react-icons/rx"
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

interface SideBarProps {
    setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}
const SideBar = ({ setShowSidebar }: SideBarProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const handleLogout = () => {
        localStorage.clear();
        queryClient.invalidateQueries(['USER_DATA']);
        queryClient.setQueryData(['USER_DATA'], undefined);
        navigate('/login');
        if (setShowSidebar) {
            setShowSidebar(false);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (setShowSidebar) {
            setShowSidebar(false);
        }
    };
    return (
        <div className="w-[100%] h-[100%] text-black">
            <div className="w-[100%] flex flex-col gap-[10px]">
                <span className="flex items-center gap-[20px] justify-center h-[50px] cursor-pointer w-[90%]" onClick={() => handleNavigation('/dashboard')}>
                    <RxDashboard className="w-[20%] h-[15px]" />
                    <p className="text-[15px] w-[80%]">Overview</p>
                </span>
                <span className="flex items-center gap-[20px] justify-center h-[50px] cursor-pointer w-[90%]" onClick={() => handleNavigation('/dashboard/order')}>
                    <IoBagHandleOutline className="w-[20%] h-[15px]" />
                    <p className="text-[15px] w-[80%]">Order</p>
                </span>
                {/* <span className="flex items-center gap-[20px] justify-center h-[50px] cursor-pointer w-[90%]" onClick={() => handleNavigation('/dashboard/books')}>
                    <IoBagHandleOutline className="w-[20%] h-[15px]" />
                    <p className="text-[15px] w-[80%]">Books</p>
                </span> */}
                <span
                    className='flex items-center gap-[20px] justify-center h-[50px] cursor-pointer w-[90%]'
                    onClick={() => {
                        handleLogout()
                    }}
                >
                    <FiLogOut className="w-[20%] h-[15px]" />
                    <p className="text-[15px] w-[80%]">Log out</p>
                </span>
            </div>
        </div>
    )
}

export default SideBar