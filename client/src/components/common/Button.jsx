import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    const variants = {
        primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-soft hover:shadow-strong',
        secondary: 'bg-slate-50 text-slate-900 border-2 border-slate-50 hover:border-slate-200 hover:bg-white shadow-soft',
        outline: 'border-2 border-slate-100 text-slate-900 hover:border-slate-900',
        ghost: 'text-slate-400 font-bold uppercase tracking-widest hover:text-slate-900',
        danger: 'bg-accent text-white hover:bg-red-700 shadow-accent'
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                h-14 px-10 rounded-2xl flex items-center justify-center font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </div>
            ) : children}
        </button>
    );
};

export default Button;
