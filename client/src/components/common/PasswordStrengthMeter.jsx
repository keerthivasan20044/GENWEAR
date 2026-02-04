import { useState } from 'react'

function PasswordStrengthMeter({ password }) {
    const getStrength = () => {
        let strength = 0

        if (password.length >= 6) strength++
        if (password.length >= 10 && (/\d/.test(password) || /[^a-zA-Z\d]/.test(password))) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password) && /[^a-zA-Z\d]/.test(password)) strength++

        return Math.min(strength, 4)
    }

    const strength = getStrength()

    const getColor = (level) => {
        if (strength < level) return 'bg-gray-100'
        if (strength === 1) return 'bg-red-500'
        if (strength === 2) return 'bg-orange-500'
        if (strength === 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getLabel = () => {
        if (strength === 0) return 'Too Weak'
        if (strength === 1) return 'Weak'
        if (strength === 2) return 'Fair'
        if (strength === 3) return 'Good'
        return 'Strong Protocol'
    }

    if (!password) return null

    return (
        <div className="mt-3 space-y-2">
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${getColor(level)}`}
                    />
                ))}
            </div>
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Security Strength
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${strength <= 1 ? 'text-red-500' :
                        strength === 2 ? 'text-orange-500' :
                            strength === 3 ? 'text-yellow-500' :
                                'text-green-500'
                    }`}>
                    {getLabel()}
                </p>
            </div>
        </div>
    )
}

export default PasswordStrengthMeter
