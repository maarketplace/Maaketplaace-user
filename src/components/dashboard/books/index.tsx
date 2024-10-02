import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom"; // For navigation
import { getUserOrders } from "../../../api/query";

const Books = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookDetails, setBookDetails] = useState<any[]>([]);
    const { data, isLoading, isError } = useQuery(['getUserOrders'], getUserOrders, {});
    const navigate = useNavigate();


    useEffect(() => {
        setBookDetails(data?.data?.data?.data)
        console.log(bookDetails);

    }, [data]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>An error occurred while fetching the data.</p>;

    return (
        <div className="w-full flex items-center justify-center mt-[50px] max-[650px]:mt-[70px]">
            <h2>eBooks</h2>
            {bookDetails?.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {bookDetails?.map((book, index) => (
                        <div
                            key={index}
                            className="border p-4 cursor-pointer"
                            onClick={() => navigate(`/dashboard/books/${book._id}`)}
                        >
                            <img src={book?.productImage} alt={book?.productName} className="h-32 w-32" />
                            <h3>{book?.productName}</h3>
                            <p>{book?.productDescription}...</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No eBooks found.</p>
            )}
        </div>
    );
};

export default Books;
