/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    DEFAULT: '#1c1917',
                },
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    DEFAULT: '#f97316',
                },
                'text-main': '#0F172A',
                'text-muted': '#64748B',
            },
            boxShadow: {
                premium: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                soft: '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
