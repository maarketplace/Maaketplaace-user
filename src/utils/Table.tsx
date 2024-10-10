import { useState } from "react";
import './Table.css'

interface TableProps<T> {
    columns: Array<keyof T>;
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    rowsPerPage?: number;
    onRowClick?: (row: T) => void;
}

const Table = <T extends object>({
    columns,
    data,
    loading = false,
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

    const renderLoadingSkeleton = () => {
        return (
            <tbody>
                {Array.from({ length: rowsPerPage }).map((_, index) => (
                    <tr key={index}>
                        {columns.map((_column, colIndex) => (
                            <td
                                key={colIndex}
                                className="px-4 py-2 text-sm border-b animate-pulse bg-gray-200"
                            >
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <div className="AllUser">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded w-full outline-none max-[650px]:bg-transparent"
                    disabled={loading} // Disable search when loading
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
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

                    {/* Render loading skeleton or table data */}
                    {loading ? (
                        renderLoadingSkeleton()
                    ) : currentData.length > 0 ? (
                        <tbody>
                            {currentData.map((row, rowIndex) => {
                                const shouldHaveGreyBackground = 
                                    rowIndex % 2 === 0;
                                return (
                                    <tr
                                        key={rowIndex}
                                        className={` cursor-pointer bg-[#f5f5f5] dark:bg-[#1b1a1a] ${
                                            shouldHaveGreyBackground ? "" : ""
                                        }`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={String(column)}
                                                className="px-4 py-2 text-sm border-b truncate"
                                                data-label={String(column)}
                                            >
                                                {String(row[column]).slice(0, 32)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-4 text-black dark:text-white"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            <div className="flex justify-between items-center mt-[20px] max-[650px]:p-[10px]">
                <span className="max-[650px]:text-[12px]">
                    Showing {currentPage} of {totalPages}
                </span>
                <span className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-gray-200 text-black rounded max-[650px]:p-0 max-[650px]:text-[12px] max-[650px]:h-[30px] max-[650px]:w-[70px]"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-200 text-black rounded max-[650px]:p-0 max-[650px]:text-[12px] max-[650px]:h-[30px] max-[650px]:w-[60px]"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                    >
                        Next
                    </button>
                </span>
            </div>
        </div>
    );
};

export default Table;
