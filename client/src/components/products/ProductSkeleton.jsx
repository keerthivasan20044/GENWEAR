import React from 'react';

const ProductSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white rounded-[3rem] overflow-hidden shadow-soft border border-gray-100/50 animate-pulse">
                    <div className="aspect-[4/5] bg-slate-50" />
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="h-2 w-16 bg-slate-100 rounded-full" />
                            <div className="h-2 w-10 bg-slate-100 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-slate-100 rounded-full" />
                            <div className="h-4 w-2/3 bg-slate-100 rounded-full" />
                        </div>
                        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                            <div className="h-6 w-24 bg-slate-100 rounded-full" />
                            <div className="h-10 w-10 bg-slate-100 rounded-2xl" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;
