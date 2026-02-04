function SkeletonLoader({ type = 'card' }) {
    if (type === 'card') {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (type === 'product-details') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                <div>
                    <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-1 bg-gray-200 h-20 rounded-lg"></div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (type === 'list') {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="flex justify-between mb-4">
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Default skeleton
    return (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
    )
}

export default SkeletonLoader
