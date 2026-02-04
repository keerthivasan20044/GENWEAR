import { toast } from 'react-toastify';

/**
 * Custom Toast wrappers for GENWEAR branding
 * Standardizes notifications across the app
 */
export const showToast = {
    success: (message) => {
        toast.success(message, {
            icon: '✅',
            className: 'font-bold text-sm uppercase tracking-tight',
        });
    },
    error: (message) => {
        toast.error(message, {
            icon: '❌',
            className: 'font-bold text-sm uppercase tracking-tight',
        });
    },
    info: (message) => {
        toast.info(message, {
            className: 'font-bold text-sm uppercase tracking-tight',
        });
    },
    cart: (productName) => {
        toast.success(
            <div>
                <p className="font-black uppercase tracking-tight text-xs mb-1">Added to Cart!</p>
                <p className="text-[10px] text-muted font-bold truncate">{productName}</p>
            </div>,
            {
                icon: '🛍️',
                position: "bottom-right",
            }
        );
    }
};

// Default export if they want to import Toast directly
const Toast = () => null;
export default Toast;
