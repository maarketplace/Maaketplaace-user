import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import { ProductCard } from './ProductCard';
import { IProduct } from "../../../interface/ProductInterface";
import { ArrowRightIcon } from 'lucide-react';

interface RelatedProductsProps {
    products: IProduct[];
    loadingStates: { [key: string]: boolean };
    onPurchase: (id: string) => void;
    onNavigate: (id: string) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    products,
    loadingStates,
    onPurchase,
    onNavigate
}) => {
    if (!products || products.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-between">
                Recommended Products
                <p className='flex items-center font-semibold gap-2 text-lg animate-bounce text-[#ffc300]'>swipe <ArrowRightIcon className='' /></p>
            </h2>
            <Swiper
                spaceBetween={24}
                mousewheel={true}
                modules={[Mousewheel, Pagination]}
                className="w-full"
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 16 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                    1280: { slidesPerView: 4, spaceBetween: 24 },
                }}
            >
                {products.map((product: IProduct) => (
                    <SwiperSlide key={product?._id}>
                        <ProductCard
                            product={product}
                            loadingStates={loadingStates}
                            onPurchase={onPurchase}
                            onNavigate={onNavigate}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
