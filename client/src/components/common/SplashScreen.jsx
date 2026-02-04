import React from 'react';

const SplashScreen = ({ isOffline }) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo */}
                <h1 className="text-6xl font-heading font-black text-white tracking-widest mb-4">
                    GENWEAR
                </h1>

                {/* Tagline */}
                <p className="text-gray-400 font-sans tracking-[0.3em] uppercase text-xs mb-12">
                    Next-Generation Fashion
                </p>

                {/* Loader */}
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-accent animate-[loading_1.5s_infinite_ease-in-out]" />
                </div>

                {/* Offline Message */}
                {isOffline && (
                    <p className="mt-8 text-warning text-sm font-medium animate-pulse">
                        You're offline. Browsing demo products.
                    </p>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}} />
        </div>
    );
};

export default SplashScreen;
