import { useLocation } from "react-router-dom";
import Bottom from "./bottomNav";
import Layout from "./layout";
import SideBar from "./sidebar";
import Logo from '../../assets/LOGO.svg'
const Home = () => {
    const location = useLocation();
    const isDetailsPage = /\/home\/details\/\d+/.test(location.pathname);
    const isQuicksPage = location.pathname === '/home/quicks';

    return (
        <div className="w-[100%] p-[0px] ">
            <div className="w-[100%] h-[10vh] bg-black flex items-center justify-center fixed top-0 left-0 z-50">
                <div className="w-[98%] h-[80%] flex">
                    <img src={Logo} alt="image" className="w-[180px] h-[50px] " />
                </div>
            </div>
            <div className="w-[100%] flex h-[90vh] ">
                <div className={isDetailsPage || isQuicksPage ? "hidden" : "w-[15%] h-[100%] bg-slate-50 max-[650px]:hidden mt-[60px]"}>
                    <SideBar />
                </div>
                <div className={isDetailsPage || isQuicksPage ? 'w-[100%]' : "w-[85%] flex flex-col items-center justify-center h-[100%] max-[650px]:w-[100%] "}>
                    <div className="w-[100%] h-[92%] p-[10px] mt-[60px] max-[650px]:p-[0px] ">
                        <Layout />
                    </div>
                    <div className={isQuicksPage ? "w-[100%] h-[8%] bg-black text-white fixed left-0 bottom-0 z-50" : "w-[100%] h-[8%] bg-black text-white fixed left-0 bottom-0 z-50"}>
                        <Bottom />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
