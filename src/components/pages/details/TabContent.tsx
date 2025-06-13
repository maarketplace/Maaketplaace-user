import React from 'react';
import { IProduct } from "../../../interface/ProductInterface";

interface TabContentProps {
    product: IProduct;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
    product,
    activeTab,
    setActiveTab
}) => {
    const tabs = [
        { id: 'expect', label: 'What to Expect', content: product?.whatToExpect },
        { id: 'topics', label: 'Topics', content: product?.topics },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6">
                {tabs.map((tab) => (
                    activeTab === tab.id && (
                        <div key={tab.id} className="prose dark:prose-invert max-w-none">
                            {tab.content ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: tab.content }}
                                    className="text-gray-700 dark:text-gray-300 leading-relaxed text-[20px]"
                                />
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic">
                                    Content not available for this section.
                                </p>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};