import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SplashScreen({ onFinish }) {
    const { t } = useTranslation();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 300),
            setTimeout(() => setPhase(2), 800),
            setTimeout(() => setPhase(3), 1500),
            setTimeout(() => onFinish(), 3000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center gradient-clinical overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 transition-all duration-1000 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 transition-all duration-1000 delay-200 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                <div className={`absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-white/8 transition-all duration-1000 delay-400 ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
            </div>

            <div className="relative text-center">
                {/* Logo */}
                <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-2xl border border-white/30">
                        <span className="text-5xl">🏥</span>
                    </div>
                </div>

                {/* Title */}
                <div className={`transition-all duration-700 delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-5xl font-extrabold text-white tracking-wider mb-2">
                        {t('app_name')}
                    </h1>
                    <div className="w-16 h-1 bg-white/40 mx-auto rounded-full mb-4" />
                </div>

                {/* Subtitle */}
                <div className={`transition-all duration-700 delay-500 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-lg text-white/80 font-light max-w-xs mx-auto">
                        {t('app_full_name')}
                    </p>
                    <p className="text-sm text-white/60 mt-2 font-light">
                        {t('tagline')}
                    </p>
                </div>

                {/* Loading indicator */}
                <div className={`mt-10 transition-all duration-500 delay-700 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex justify-center gap-2">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-white/60"
                                style={{
                                    animation: `pulse-soft 1.2s ease-in-out ${i * 0.2}s infinite`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
