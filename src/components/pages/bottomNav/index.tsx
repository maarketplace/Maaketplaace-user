import { useLocation, useNavigate } from 'react-router-dom';
import { RxLightningBolt } from "react-icons/rx";
import { FiHome, FiUser } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState } from 'react';
import PostModal from '../../../utils/QuicksUploadModal';

<IoIosNotificationsOutline />
const Bottom = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [showQuicksModal, setShowQuicksModal] = useState(false)

    const handleHomeClick = () => {
        navigate('/home');
    };
    const handleQuicksClick = () => {
        navigate('/home/quicks')
    };
    // const handleSettingClick = () => {
    //     navigate('')
    // };
    const handleUserClick = () => {
        navigate('/dashboard')
    };
    return (
        <div className="w-[100%] h-[100%] flex items-center  ">
            <div className="w-[80%] h-[100%] ml-[20px] max-w-[650px]:ml-[20px] flex items-center justify-between ">
                <span className={(location.pathname === '/home' || location.pathname.startsWith('/home/details')) ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <FiHome
                        className=''
                        onClick={handleHomeClick} />
                </span>
                <span className={location.pathname === '/home/quicks' ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <RxLightningBolt
                        className=''
                        onClick={handleQuicksClick} />
                </span>
                {/* <span className={location.pathname === '/home/profile/adminsetting' ? 'text-[#FFC300] text-[20px]' : 'text-[25px]'}>
                    <IoIosNotificationsOutline
                        className=''
                        onClick={handleSettingClick} />
                </span> */}
                <span className={location.pathname === '/dashboard' ? 'text-[#FFC300] text-[20px]' : 'text-[25px]'}>
                    <FiUser
                        className=''
                        onClick={handleUserClick} />
                </span>
            </div>
         {showQuicksModal && <PostModal isOpen={showQuicksModal} onClose={() => setShowQuicksModal(false)} />}
        </div>
    )
}

export default Bottom