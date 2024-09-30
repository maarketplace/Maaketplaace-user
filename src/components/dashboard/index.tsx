import SideBar from "./sidebar"
import Layout from "./layout"

const Dashaboard = () => {
    return (
        <div className="w-[100%] h-[100vh] flex ">
            <div className="w-[15%] bg-[white] dark:bg-black max-[650px]:hidden top-0 left-0 bottom-0 h-full">
                <div className="w-[100%] h-[15%] rounded-r-[50px] p-2">
                    <img src="LOGO.svg" alt="image" className="w-[180px] h-[100px]" />
                </div>
                <div className="w-[100%] h-[85%] bg-[#FFC300] rounded-tr-[50px] p-[10px]">
                    <SideBar />
                </div>
            </div>
            <div className="w-[85%] h-[100%] max-[650px]:w-[100%]">
                <Layout />
            </div>
        </div>
    )
}

export default Dashaboard