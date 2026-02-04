import React from 'react';
import { FiWifiOff } from 'react-icons/fi';

const OfflineBanner = () => {
    return (
        <div className="bg-warning text-primary py-2 px-4 flex items-center justify-center gap-3 sticky top-0 z-[60] shadow-md animate-slide-in-down">
            <FiWifiOff className="text-xl" />
            <p className="text-sm font-semibold tracking-wide">
                ⚠ Offline mode enabled – Browsing demo products
            </p>
        </div>
    );
};

export default OfflineBanner;
