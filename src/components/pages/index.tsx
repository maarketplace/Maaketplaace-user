import { useLocation, useNavigate } from "react-router-dom";
import Bottom from "./bottomNav";
import Layout from "./layout";
// import Logo from '../../assets/LOGO.svg'
import { IoSearch } from "react-icons/io5";
import { useContext } from "react";
import { SearchContext } from "../../context/Search";

const Home = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const context = useContext(SearchContext);

    // Check if the context is undefined
    if (!context) {
        return null; // or handle this case appropriately
    }

    const { searchQuery, setSearchQuery } = context;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };


    const isQuicksPage = location.pathname === '/quicks';
    return (
<div className="w-[100%] p-[0px] dark:bg-black max-w-fill no-scrollbar">

    <div className="relative w-full h-full">
        <header
            className={
                isQuicksPage
                    ? "hidden"
                    : "w-[100%] h-[10vh] bg-white dark:bg-black shadow flex items-center justify-center fixed top-0 z-50 p-2"
            }
        >
            <div className="w-[80%] h-[100%] flex items-center max-w-[650px]:w-[10%]">
                <img src="/LOGO.svg" alt="image" className="w-[180px] h-[50px] max-[650px]:hidden" />
                <img src="MARKET.svg" alt="image" className="w-[30px] h-[30px] hidden max-[650px]:flex" />
            </div>
            <div className="w-[30%] h-[100%] max-w-[650px]:w-[90%] flex justify-end items-center">
                <input
                    className="w-[100%] py-[5px] border border-[grey] text-[12px] px-[5px] outline-none text-white rounded-[4px] max-[650px]:w-[90%] bg-transparent max-[650px]:hidden"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <IoSearch
                    className="text-[25px] text-[#FFC300] hidden max-[650px]:flex"
                    onClick={() => navigate("/search")}
                />
            </div>
        </header>
        <div className={isQuicksPage ? 'pt-0': "pt-[10vh] h-[100%]"}>
            <div className="h-[92%]">
                <Layout searchQuery={searchQuery} />
            </div>
            <div className="w-[100%] h-[8%] bg-[white]  text-black fixed right-0 bottom-0 z-50 flex items-center justify-center dark:bg-black dark:text-white max-[650px]:w-[100%]">
                <Bottom />
            </div>
        </div>
    </div>
</div>

    )
}

export default Home;

// className={isQuicksPage ? "mt-0" : "w-[100%] h-[92%] mt-[60px] max-[650px]:mt-[0px] max-[650px]:p-[0px] block items-center justify-center no-scrollbar"}