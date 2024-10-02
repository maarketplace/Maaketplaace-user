import { useQuery } from "react-query";
import Table from "../../../utils/Table";
import { getUserOrders, getUserOrderDetails } from "../../../api/query";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { IOrder } from "../../../interface/Order.interface";
import { IProduct } from "../../../interface/ProductInterface";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

Modal.setAppElement('#root');

const Order = () => {
    const [allOrder, setAllOrder] = useState<IOrder[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("All");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery(['getUserOrders'], getUserOrders, {});

    useEffect(() => {
        if (data?.data?.data) {
            const reversedData = data?.data?.data?.data.reverse();
            setAllOrder(reversedData);
        }
    }, [data, selectedOrder]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>An error occurred while fetching the data.</p>;
    }

    const columns: Array<keyof typeof formattedData[0]> = [
        "Amount",
        "Status",
        "Date",
    ];

    const formattedData = allOrder.map(transaction => ({
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

    const closeModal = () => {
        setIsModalOpen(false); 
        setOrderDetails(null); 
    };

    return (
        <div className="w-full flex items-center justify-center mt-[50px] max-[650px]:mt-[70px]">
            <div className="w-[100%] mb-[50px] flex flex-col gap-[20px]">
                <div className="flex justify-between items-center mb-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded text-black outline-none"
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
                />
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Order Details"
                    className="bg-white p-6 rounded-md shadow-lg dark:bg-black dark:text-white"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-xl font-bold mb-4">Order Details</h2>

                    {isDetailsLoading ? (
                        <p>Loading details...</p>
                    ) : detailsError ? (
                        <p className="text-red-500">{detailsError}</p>
                    ) : (
                        orderDetails && (
                            <div className="flex flex-col gap-[]">
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Amount:</strong> {orderDetails?.payable_amount}</p>
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Status:</strong> {orderDetails?.status}</p>
                                <p className="flex justify-between"><strong className="font-semibold text-[14px]">Created At:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                {orderDetails?.products?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold">Products</h3>
                                        {orderDetails.products.map((product: IProduct) => (
                                            <div key={product._id} className="border p-4 mb-4">
                                                <p><strong className="font-semibold text-[14px]">Product Name:</strong> {product?.productName}</p>
                                                {
                                                    product.eBook ? (
                                                        <div style={{ height: '250px' }}>
                                                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                                                <Viewer fileUrl={product?.eBook} />
                                                            </Worker>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Close
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default Order;
