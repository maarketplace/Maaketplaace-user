import { useQuery } from "react-query";
import Table from "../../../utils/Table"
import { getUserOrders } from "../../../api/query";
import { useEffect, useState } from "react";
import { IOrder } from "../../../interface/Order.interface";

const Order = () => {
    const [allOrder, setAllOrder] = useState<IOrder[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("All");


    const { data, isLoading, isError } = useQuery(['getUserOrders'], getUserOrders, {
    });
    useEffect(() => {
        if (data?.data?.data) {
            const reversedData = data?.data?.data?.data.reverse();
            setAllOrder(reversedData);
        }
    }, [data]);
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
        "Date": new Date(transaction?.createdAt).toLocaleDateString()
    }));
    const filteredOrders = formattedData.filter(order => {
        if (statusFilter === "All") {
            return true;
        }
        return order.Status === statusFilter;
    });
    return (
        <div className="w-full flex items-center justify-center mt-[50px] max-[650px]:mt-[70px]">
            <div className="w-[100%] mb-[50px] flex flex-col gap-[20px]">
                <div className="flex justify-between items-center mb-4">
                    {/* Dropdown to select order status */}
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
                        {/* Add more statuses as needed */}
                    </select>
                </div>
                <Table data={filteredOrders} columns={columns} />
            </div>
        </div>
    )
}

export default Order