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
        navigate('/');
    };
    const handleQuicksClick = () => {
        navigate('/quicks')
    };
    // const handleSettingClick = () => {
    //     navigate('')
    // };
    const handleUserClick = () => {
        navigate('/dashboard')
    };
    return (
        <div className="w-[90%] h-[100%] max-[650px]:w-[85%] max-[650px]:justify-center flex items-center justify-between">
            <div className="w-[100%]  max-w-[650px]:ml-[20px] flex items-center justify-between p-2">
                <span className={(location.pathname === '/' || location.pathname.startsWith('/details')) ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <FiHome
                        className=''
                        onClick={handleHomeClick} />
                </span>
                <span className={location.pathname === '/quicks' ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <RxLightningBolt
                        className=''
                        onClick={handleQuicksClick} />
                </span>
                {/* <span className={location.pathname === '/profile/adminsetting' ? 'text-[#FFC300] text-[20px]' : 'text-[25px]'}>
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