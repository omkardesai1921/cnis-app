import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const quickActions = [
    { path: '/screening', icon: '📋', labelKey: 'start_screening', color: 'from-blue-500 to-blue-600', desc: 'Begin a new child nutrition screening' },
    { path: '/reports', icon: '📊', labelKey: 'reports', color: 'from-emerald-500 to-emerald-600', desc: 'View screening history and reports' },
    { path: '/chatbot', icon: '🤖', labelKey: 'chatbot', color: 'from-purple-500 to-purple-600', desc: 'Ask the AI nutrition assistant' },
];

const stats = [
    { key: 'total_screenings', value: '0', icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'sam_cases', value: '0', icon: '🔴', color: 'text-red-600', bg: 'bg-red-50' },
    { key: 'mam_cases', value: '0', icon: '🟠', color: 'text-orange-500', bg: 'bg-orange-50' },
    { key: 'normal_cases', value: '0', icon: '🟢', color: 'text-green-600', bg: 'bg-green-50' },
];

export default function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const [screeningStats, setScreeningStats] = useState(stats);

    // Load stats from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cnis_screenings');
        if (saved) {
            try {
                const screenings = JSON.parse(saved);
                const total = screenings.length;
                const sam = screenings.filter(s => s.result?.zone === 'red').length;
                const mam = screenings.filter(s => s.result?.zone === 'orange').length;
                const normal = screenings.filter(s => s.result?.zone === 'green').length;
                setScreeningStats([
                    { ...stats[0], value: String(total) },
                    { ...stats[1], value: String(sam) },
                    { ...stats[2], value: String(mam) },
                    { ...stats[3], value: String(normal) },
                ]);
            } catch (e) { /* ignore */ }
        }
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl gradient-clinical p-6 md:p-8 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
                </div>
                <div className="relative z-10">
                    <p className="text-white/70 text-sm mb-1">{greeting()}</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                        {user?.displayName || 'Health Worker'} 👋
                    </h2>
                    <p className="text-white/80 text-sm max-w-md">
                        {role === 'asha' ? 'Ready to screen children and track nutrition in your community.' :
                            role === 'parent' ? 'Monitor your child\'s nutrition and growth easily.' :
                                'Access nutrition screening tools and reports.'}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {screeningStats.map((stat, i) => (
                    <div
                        key={stat.key}
                        className="glass rounded-2xl p-4 card-hover border border-gray-100 animate-slide-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <span className="text-lg">{stat.icon}</span>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t(stat.key)}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            id={`action-${action.labelKey}`}
                            className="glass rounded-2xl p-5 border border-gray-100 card-hover text-left group animate-slide-up"
                            style={{ animationDelay: `${(i + 4) * 80}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                <span className="text-2xl">{action.icon}</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 group-hover:text-clinical-blue transition-colors">
                                {t(action.labelKey)}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MUAC Guide */}
                <div className="glass rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📏</span>
                        <h4 className="font-semibold text-gray-800">MUAC Classification</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                            <div className="w-4 h-4 rounded-full bg-red-500" />
                            <div>
                                <p className="font-semibold text-red-700 text-sm">&lt; 11.5 cm — SAM</p>
                                <p className="text-xs text-red-500">Severe Acute Malnutrition</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                            <div className="w-4 h-4 rounded-full bg-orange-500" />
                            <div>
                                <p className="font-semibold text-orange-700 text-sm">11.5 - 12.5 cm — MAM</p>
                                <p className="text-xs text-orange-500">Moderate Acute Malnutrition</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                            <div className="w-4 h-4 rounded-full bg-green-500" />
                            <div>
                                <p className="font-semibold text-green-700 text-sm">&gt; 12.5 cm — Normal</p>
                                <p className="text-xs text-green-500">Healthy nutritional status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
