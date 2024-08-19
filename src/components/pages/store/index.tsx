import { useQuery } from "react-query";
import { getOneMerchantStoreProduct } from "../../../api/query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interface/ProductInterface";
const Store = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { id } = useParams<{ id?: any }>();
    const { isUserAuthenticated } = useAuth()
    const [allProduct, setAllProduct] = useState<IProduct[]>([])

    const {
        data
    } = useQuery(["getOneMerchantStoreProduct", id], getOneMerchantStoreProduct, {
        onSuccess: () => {

        },
        onError: () => {

        },
    });
    const AdminInfo = data?.data?.data?.admin

    useEffect(() => {
        if (data && data.data && data.data.data) {
            const reversedData = [...data?.data?.data?.data].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);
    const handleCartAddingAuth = () => {
        if (isUserAuthenticated) {
            alert('Are you sure you want to buy')
        } else {
            localStorage.setItem('redirectPath', location.pathname);
            navigate('/');
        }
    }
    return (
        <div className="w-[100%] flex items-center justify-center flex-col gap-[20px] dark:text-white ">
            <div className="w-[50%] mt-[30px] h-[auto] p-[2%] shadow-lg shadow-grey-500/50 bg-slate-50  dark:bg-[#1D1C1C] dark:shadow-white-500/50 rounded-[16px]  max-[650px]:w-[90%] max-[650px]:p-[2%]">
                <div className="w-[60%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:items-center ">
                    <div className=" w-[100%] flex items-center gap-5 max-[650px]:flex-col">
                        <span className="flex w-[70%] flex-col items-center gap-[10px] relative">
                            <img src={AdminInfo?.image} alt="" className="w-[150px] h-[150px] rounded-[100%] object-cover max-[650px]:w-[80px] max-[650px]:h-[80px] " />
                            <p className="text-[15px] font-bold hidden max-[650px]:flex ">{AdminInfo?.profession}</p>
                        </span>
                        <span className="h-[100px] w-[100%] gap-5 max-[650px]:w-[100%] max-[650px]:flex max-[650px]:items-center max-[650px]:flex-col">
                            <p className="text-clamp text-[25px] mb-[10px]">@{AdminInfo?.business_name}</p>
                            <p className="text-[12px] max-[650px]:text-center">{AdminInfo?.bio}</p>
                        </span>
                    </div>
                    <div className="w-[100%] flex  items-center ">
                        <p className="text-[12px] font-bold max-[650px]:hidden ">{AdminInfo?.profession}</p>
                    </div>
                </div>
            </div>
            <div className="w-[70%] mb-[70px] flex flex-wrap justify-center gap-[20px] max-[650px]:justify-center max-[650px]:w-[100%]">
                {
                    allProduct?.map((i: IProduct) => (
                        <div className="w-[200px]rounded-[8px] border flex flex-col items-center p-[10px] gap-[10px] max-[650px]:w-[150px] rounded-[8px]">
                            <img src={i?.productImage} alt="" className="w-[100%] h-[200px] object-cover aspect-square " />
                            <span className="w-full">
                                <p className="max-[650px]:text-[12px] text-[14px]">{i?.productName}</p>
                            </span>
                            <button className="w-full p-[2px] bg-[#FFC300] rounded-[4px]" onClick={() => handleCartAddingAuth()}>Buy now</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Store