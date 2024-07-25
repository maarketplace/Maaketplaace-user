import { useLocation, useNavigate } from 'react-router-dom';
import { RxLightningBolt } from "react-icons/rx";
import { FiHome, FiUser } from "react-icons/fi";
import { MdNotificationsNone } from 'react-icons/md';

const Bottom = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const handleHomeClick = () => {
        navigate('/home');
    };
    const handleQuicksClick = () => {
        navigate('/userhome/userreels');
    };
    const handleSettingClick = () => {
        navigate('')
    };
    const handleUserClick = () => {
        navigate('/userhome/userprofile/userdashboard')
    };
    return (
        <div className="w-[100%] h-[100%] flex items-center justify-center ">
            <div className="w-[80%] h-[100%] flex items-center justify-between ">
                <span className={location.pathname === '/home' ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <FiHome
                        className='BottomNav_Icons'
                        onClick={handleHomeClick} />
                </span>
                <span className={location.pathname === '/userhome/userreels' ? 'text-[#FFC300] text-[20px]' : 'text-[20px]'}>
                    <RxLightningBolt
                        className='BottomNav_Icons'
                        onClick={handleQuicksClick} />
                </span>
                <span className={location.pathname === '/home/profile/adminsetting' ? 'text-[#FFC300] text-[20px]' : 'text-[25px]'}>
                    <MdNotificationsNone
                        className='BottomNav_Icons'
                        onClick={handleSettingClick} />
                </span>
                <span className={location.pathname === '/userhome/userprofile/userdashboard' ? 'text-[#FFC300] text-[20px]' : 'text-[25px]'}>
                    <FiUser
                        className='BottomNav_Icons'
                        onClick={handleUserClick} />
                </span>
            </div>
        </div>
    )
}

export default Bottom