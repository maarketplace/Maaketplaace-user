import { useLocation, useNavigate } from "react-router-dom";
import Bottom from "./bottomNav";
import Layout from "./layout";
import { IoSearch } from "react-icons/io5";
import { useContext } from "react";
import { SearchContext } from "../../context/Search";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const context = useContext(SearchContext);
    if (!context) return null;

    const { searchQuery, setSearchQuery } = context;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const isQuicksPage = location.pathname === "/quicks";

    return (
        <div className="w-full h-screen flex flex-col dark:bg-black">
            {!isQuicksPage && (
                <header className="w-full h-[10vh] min-h-[60px] bg-white dark:bg-black shadow flex items-center justify-between px-4 fixed top-0 left-0 z-50">
                    <div className="flex items-center justify-between w-[90%]  mx-auto">
                        <div className="flex items-center gap-2">
                            <img
                                src="/LOGO.svg"
                                alt="logo"
                                className="w-[180px] h-[50px] max-[650px]:hidden"
                            />
                            <img
                                src="/MARKET.svg"
                                alt="market"
                                className="w-[30px] h-[30px] hidden max-[650px]:block"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 w-[30%] max-w-[650px]:w-auto">
                            <input
                                className="w-[70%] py-1 px-2 border border-gray-400 text-sm rounded bg-transparent dark:text-white outline-none  max-[650px]:hidden"
                                placeholder="Search here"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <IoSearch
                                className="text-[25px] text-[#FFC300] hidden max-[650px]:block"
                                onClick={() => navigate("/search")}
                            />
                        </div>
                    </div>
                </header>
            )}

            <main
                className={`flex-1 overflow-y-auto no-scrollbar pt-${isQuicksPage ? "0" : "[10vh]"
                    } pb-[8vh]`}
            >
                <Layout searchQuery={searchQuery} />
            </main>

            {!isQuicksPage && (
                <nav className="w-full h-[8vh] min-h-[60px] bg-white dark:bg-black text-black dark:text-white fixed bottom-0 left-0 z-50 flex items-center justify-center">
                    <Bottom />
                </nav>
            )}
        </div>
    );
};

export default Home;
