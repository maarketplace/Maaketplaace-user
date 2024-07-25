import Bottom from "./bottomNav"
import Layout from "./layout"
import SideBar from "./sidebar"

const Home = () => {
    return (
        <div className="w-[100%] ">
            <div className="w-[100%] h-[10vh] bg-black">

            </div>
            <div className="w-[100%] flex h-[90vh]">
                <div className="w-[15%] h-[100%] bg-slate-50 ">
                    <SideBar />
                </div>
                <div className="w-[85%] flex flex-col items-center justify-center h-[100%]  ">
                    <div className="w-[100%] h-[95%] p-[10px] ">
                        <Layout />
                    </div>
                    <div className="w-[100%] h-[5%] bg-black text-white ">
                        <Bottom />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home