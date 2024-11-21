import { useQuery } from "react-query";
import Table from "../../../utils/Table";
import { getUserOrders, getUserOrderDetails } from "../../../api/query";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { IOrder } from "../../../interface/Order.interface";
import { IProduct } from "../../../interface/ProductInterface";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

Modal.setAppElement('#root');
interface Order {
    payable_amount: number;
    status: string;
    createdAt: string | number | Date;
    products: IProduct[];
    id: string;
}
const Order = () => {
    const [courseOrders, setCourseOrders] = useState<IOrder[]>([]);
    const [ebookOrders, setEbookOrders] = useState<IOrder[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [showCourses, setShowCourses] = useState(true);
    const [isDownloadLoading, setIsDownloadLoading] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery(['getUserOrders'], getUserOrders, {});

    useEffect(() => {
        if (data?.data?.data) {
            const orders = data.data.data.data.reverse();
            setCourseOrders(orders.filter((order: { products: IProduct[]; }) =>
                order.products.some(product => product.productType === 'course')
            ));
            setEbookOrders(orders.filter((order: { products: IProduct[]; }) =>
                order.products.some(product => product.productType === 'ebook')
            ));
        }
    }, [data]);


    const displayedOrders = showCourses ? ebookOrders : courseOrders;

    if (isError) {
        return <p>An error occurred while fetching the data.</p>;
    }

    const columns: Array<keyof typeof formattedData[0]> = [
        "Amount",
        "Status",
        "Date",
    ];

    const formattedData = displayedOrders.map(transaction => ({
        "Amount": transaction?.amount || "N/A",
        "Status": transaction.status,
        "Date": new Date(transaction?.createdAt).toLocaleDateString(),
        "id": transaction._id
    }));

    const filteredOrders = formattedData.filter(order => {
        if (statusFilter === "All") {
            return true;
        }
        return order.Status === statusFilter;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRowClick = async (row: any, orderId: string) => {
        setSelectedOrder(row);
        setIsModalOpen(true);
        setIsDetailsLoading(true);
        setDetailsError(null);

        try {
            const response = await getUserOrderDetails(orderId);
            console.log(response?.data?.data?.data);

            setOrderDetails(response?.data?.data?.data);
        } catch (error) {
            setDetailsError("Failed to fetch order details.");
        } finally {
            setIsDetailsLoading(false);
        }
    };
    const downloadEbook = async (product: IProduct) => {
        if (product?.eBook) {
            setIsDownloadLoading(product._id);
            try {
                await saveAs(product.eBook, `${product.productName}.pdf`);
                toast.success('Download Successful');
            } catch (error) {
                toast.error("Failed to download the file.");
            } finally {
                setIsDownloadLoading(null);
            }
        } else {
            toast.error("File URL not available for download.");
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setOrderDetails(null);
    };

    return (
        <div className="w-full flex items-center justify-center mt-[50px] max-[650px]:mt-[70px]">
            <div className="w-[100%] mb-[50px] flex flex-col gap-[20px]">
                <div className="flex w-[100%] justify-between items-center mb-4 flex-col max-[650px]:w-[full] gap-2 ">
                    <div>
                        <button onClick={() => setShowCourses(true)} className={`w-[100px] h-[30px] text-[12px] ${showCourses ? 'bg-[#FFC300]' : 'bg-gray-300'} text-black rounded`}>
                            Ebooks
                        </button>
                        <button onClick={() => setShowCourses(false)} className={`w-[100px] h-[30px] text-[12px] ${!showCourses ? 'bg-[#FFC300]' : 'bg-gray-300'} text-black rounded ml-2`}>
                            Courses
                        </button>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 w-[30%] border rounded text-black outline-none max-[650px]:w-full bg-transparent dark:text-white"
                    >
                        <option value="All">All</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                    </select>

                </div>

                <Table
                    data={filteredOrders}
                    columns={columns}
                    onRowClick={(row) => handleRowClick(row, row?.id)}
                    loading={isLoading}
                />
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Order Details"
                    className="bg-white p-6 rounded-md shadow-lg dark:bg-black dark:text-white"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-xl mb-4">Order Details</h2>

                    {isDetailsLoading ? (
                        <p>Loading details...</p>
                    ) : detailsError ? (
                        <p className="text-red-500">{detailsError}</p>
                    ) : (
                        orderDetails && (
                            <div className="flex flex-col gap-[]">
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Amount:</strong> {orderDetails?.payable_amount}</p>
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Status:</strong> {orderDetails?.status}</p>
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Purchase Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                {orderDetails?.products?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Products</h3>
                                        {orderDetails.products.map((product: IProduct) => (
                                            <div key={product._id} className="border p-4 mb-4">
                                                <p><strong className="font-semibold text-[14px]">Product Name:</strong> {product?.productName}</p>
                                                {product.productType === 'ebook' && (
                                                    <button
                                                        onClick={() => downloadEbook(product)}
                                                        disabled={isDownloadLoading === product._id} // Disable button if loading
                                                        className={`w-[100px] h-[30px] text-[14px] mt-[10px] rounded ${isDownloadLoading === product._id
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-[#FFC300] text-black"
                                                            }`}
                                                    >
                                                        {isDownloadLoading === product._id ? "Loading..." : "Download"}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    <button
                        onClick={closeModal}
                        className="mt-4 w-[80px] h-[30px] text-[12px] bg-red-500 text-white rounded"
                    >
                        Close
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default Order;
