import { useState } from "react";
import './Table.css'

interface TableProps<T> {
    columns: Array<keyof T>;
    data: T[];
    emptyMessage?: string;
    rowsPerPage?: number;
    onRowClick?: (row: T) => void;
}

const Table = <T extends object>({
    columns,
    data,
    emptyMessage = "No data available",
    rowsPerPage = 10,
    onRowClick,
}: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredData = data.filter(row =>
        columns.some(column =>
            String(row[column]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="AllUser"> {/* Main container class */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded w-full"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full"> {/* Class for table */}
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column)}
                                    className="px-4 py-2 border-b-2 text-left text-sm font-semibold text-white bg-gray-800"
                                >
                                    {String(column)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => {
                                // Determine if the row should have a grey background
                                const shouldHaveGreyBackground = 
                                    rowIndex % 2 === 0; // This can be modified based on your criteria

                                return (
                                    <tr
                                        key={rowIndex}
                                        className={`hover:bg-gray-100 cursor-pointer ${
                                            shouldHaveGreyBackground ? "bg-gray-200" : ""
                                        }`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={String(column)}
                                                className="px-4 py-2 text-sm border-b"
                                                data-label={String(column)}
                                            >
                                                {String(row[column])}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-4 text-black"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt- max-[650px]:p-[10px]">
                <span>
                    Showing {currentPage} of {totalPages}
                </span>
                <span className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </span>
            </div>
        </div>
    );
};

export default Table;