import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

function ProductSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
            {Array.from(new Array(8)).map((_, index) => (
                <div key={index} className="bg-white dark:bg-black shadow-lg overflow-hidden">
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={300}
                        className="dark:bg-gray-800"
                    />
                    <div className="p-4 space-y-3">
                        <Box className="flex items-center gap-3">
                            <Skeleton
                                variant="circular"
                                width={32}
                                height={32}
                                className="dark:bg-gray-800"
                            />
                            <Skeleton
                                width="60%"
                                height={20}
                                className="dark:bg-gray-800"
                            />
                        </Box>
                        <Skeleton
                            width="80%"
                            height={24}
                            className="dark:bg-gray-800"
                        />
                        <Skeleton
                            width="40%"
                            height={20}
                            className="dark:bg-gray-800"
                        />
                        <Skeleton
                            width="100%"
                            height={40}
                            className="dark:bg-gray-800"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductSkeleton;