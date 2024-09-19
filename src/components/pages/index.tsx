import { useLocation, useNavigate, useParams } from "react-router-dom";
import Bottom from "./bottomNav";
import Layout from "./layout";
import SideBar from "./sidebar";
import Logo from '../../assets/LOGO.svg'
import { IoSearch } from "react-icons/io5";
import { useState } from "react";

const Home = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const isDetailsPage = /\/home\/details\/\d+/.test(location.pathname);
    const isQuicksPage = location.pathname === '/home/quicks';
    const isStorePage = location.pathname === `/home/store/${id}`;
    return (
        <div className="w-[100%] p-[0px] dark:bg-black max-w-fill">
            <div className={isQuicksPage ? "hidden" : "w-[100%] h-[10vh] bg-black flex items-center justify-center fixed top-0 left-0 z-50 p-2"}>
                <div className="w-[80%] h-[100%] flex items-center max-w-[650px]:w-[10%]">
                    <img src={Logo} alt="image" className="w-[180px] h-[50px] max-[650px]:hidden " />
                    <img src='MARKET.svg' alt="image" className="w-[30px] h-[30px] hidden max-[650px]:flex " />
                </div>
                <div className="w-[30%] h-[100%] max-w-[650px]:w-[90%] flex justify-end items-center">
                    <input 
                    className="w-[100%] py-[5px] border border-[grey] text-[12px] px-[5px] outline-none text-white rounded-[4px]  max-[650px]:w-[90%] bg-transparent max-[650px]:hidden" 
                    placeholder="Search here" 
                    value={searchQuery}
                    onChange={handleSearch}
                    />
                    <IoSearch className="text-[25px] text-[#FFC300] hidden max-[650px]:flex " onClick={() => navigate('/home/search')}/>
                </div>
            </div>
            <div className="w-[100%] flex h-[90vh] ">
                <div className={isDetailsPage || isQuicksPage || isStorePage ? "hidden" : "w-[15%] h-[100%] bg-white max-[650px]:hidden mt-[60px]  "}>
                    <SideBar />
                </div>
                <div className={isDetailsPage || isQuicksPage || isStorePage ? 'w-[100%]' : "w-[85%] flex flex-col items-center justify-center h-[100%] max-[650px]:w-[100%] "}>
                    <div className={isQuicksPage ? "mt-0" : "w-[100%] h-[92%] mt-[60px] max-[650px]:p-[0px] "}>
                        <Layout searchQuery={searchQuery}/>
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

