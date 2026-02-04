import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 focus:border-primary-500 focus:bg-white transition-all outline-none text-sm font-medium
                        ${Icon ? 'pl-14' : ''}
                        ${error ? 'border-red-500 bg-red-50/10' : ''}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
