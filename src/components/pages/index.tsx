import { useLocation, useParams } from "react-router-dom";
import Bottom from "./bottomNav";
import Layout from "./layout";
import SideBar from "./sidebar";
import Logo from '../../assets/LOGO.svg'
const Home = () => {
    const {id} = useParams()
    const location = useLocation();
    const isDetailsPage = /\/home\/details\/\d+/.test(location.pathname);
    const isQuicksPage = location.pathname === '/home/quicks';
    const isCommentPage = location.pathname === `/home/store/${id}`;
    return (
        <div className="w-[100%] p-[0px] dark:bg-black max-w-fill">
            <div className="w-[100%] h-[10vh] bg-black flex items-center justify-center fixed top-0 left-0 z-50 p-2">
                <div className="w-[30%] h-[100%] flex items-center max-w-[650px]:w-[10%]">
                    <img src={Logo} alt="image" className="w-[180px] h-[50px] max-[650px]:hidden " />
                    <img src='MARKET.svg' alt="image" className="w-[40px] h-[40px] hidden max-[650px]:flex " />
                </div>
                <div className="w-[70%] h-[100%] max-w-[650px]:w-[90%] flex justify-center items-center">
                    <input type="text"
                        placeholder="Search for product and store"
                        className="w-[300px] text-[12px] p-2 bg-transparent border outline-none text-white max-w-[650px]:w-[200px] max-w-[650px]:h-[18px] max-w-[650px]:text-[10px]"
                    />
                </div>
            </div>
            <div className="w-[100%] flex h-[90vh] ">
                <div className={isDetailsPage || isQuicksPage || isCommentPage ? "hidden" : "w-[15%] h-[100%] bg-slate-50 max-[650px]:hidden mt-[60px]  "}>
                    <SideBar />
                </div>
                <div className={isDetailsPage || isQuicksPage || isCommentPage ? 'w-[100%]' : "w-[85%] flex flex-col items-center justify-center h-[100%] max-[650px]:w-[100%] "}>
                    <div className="w-[100%] h-[92%] mt-[60px] max-[650px]:p-[0px] ">
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
