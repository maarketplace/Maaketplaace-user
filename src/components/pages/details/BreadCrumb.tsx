import React from 'react';

interface BreadcrumbProps {
    productName: string;
    onNavigateHome: () => void;
    onNavigateProducts: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    productName,
    onNavigateHome,
    onNavigateProducts
}) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <button onClick={onNavigateHome} className="hover:text-yellow-600 dark:hover:text-yellow-400">
                Home
            </button>
            <span>/</span>
            <button onClick={onNavigateProducts} className="hover:text-yellow-600 dark:hover:text-yellow-400">
                Products
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-xs">
                {productName}
            </span>
        </nav>
    );
};