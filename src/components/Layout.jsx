import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const navItems = [
    { path: '/', icon: '🏠', labelKey: 'home' },
    { path: '/screening', icon: '📋', labelKey: 'screening' },
    { path: '/reports', icon: '📊', labelKey: 'reports' },
    { path: '/chatbot', icon: '🤖', labelKey: 'chatbot' },
];

export default function Layout() {
    const { t, i18n } = useTranslation();
    const { user, logout, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('cnis_dark_mode');
        return saved === 'true';
    });

    // Apply dark mode to html element
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('cnis_dark_mode', darkMode.toString());
    }, [darkMode]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const languages = [
        { code: 'en', label: 'EN', full: 'English' },
        { code: 'hi', label: 'हि', full: 'हिंदी' },
        { code: 'mr', label: 'म', full: 'मराठी' },
    ];

    return (
        <div className={`min-h-screen bg-surface flex flex-col ${darkMode ? 'dark' : ''}`}>
            {/* Top Header */}
            <header className="sticky top-0 z-40 glass border-b border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
                            id="menu-toggle-btn"
                        >
                            <svg className="w-6 h-6 text-clinical-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-9 h-9 rounded-xl gradient-clinical flex items-center justify-center shadow-sm">
                                <span className="text-lg">🏥</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-clinical-dark leading-tight">{t('app_name')}</h1>
                                <p className="text-[10px] text-gray-400 -mt-0.5 hidden sm:block">{t('app_full_name')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
                        {navItems.map(item => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                id={`nav-${item.labelKey}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${location.pathname === item.path
                                        ? 'bg-white text-clinical-blue shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{t(item.labelKey)}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Right: Dark Mode + Language + Profile */}
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl hover:bg-primary-50 transition-all dark-mode-toggle"
                            id="dark-mode-toggle"
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                        </button>

                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-0.5">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${i18n.language === lang.code
                                            ? 'bg-clinical-blue text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    title={lang.full}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Profile */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 transition-colors">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-primary-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full gradient-clinical flex items-center justify-center text-white text-sm font-bold">
                                        {user?.displayName?.[0] || 'U'}
                                    </div>
                                )}
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200/50">
                                <div className="px-3 py-2 mb-2 border-b border-gray-100">
                                    <p className="font-semibold text-gray-800 text-sm">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                    {role && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                                            {t(role === 'asha' ? 'asha_worker' : role)}
                                        </span>
                                    )}
                                </div>

                                {/* Language switcher in dropdown for mobile */}
                                <div className="sm:hidden px-3 py-2 mb-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1.5">Language</p>
                                    <div className="flex gap-1">
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${i18n.language === lang.code
                                                        ? 'bg-clinical-blue text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {lang.full}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                                    id="logout-btn"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    {t('logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-5 flex flex-col" style={{ animation: 'slide-in-left 0.3s ease-out' }}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl gradient-clinical flex items-center justify-center">
                                    <span className="text-xl">🏥</span>
                                </div>
                                <span className="font-bold text-clinical-dark">{t('app_name')}</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${location.pathname === item.path
                                            ? 'bg-clinical-light text-clinical-blue font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{t(item.labelKey)}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Dark mode toggle in drawer */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 w-full text-left transition-all"
                            >
                                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </div>

                        {/* Drawer footer */}
                        <div className="mt-auto p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🎤</span>
                                <span className="text-sm font-semibold text-clinical-dark">Voice Enabled</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Say "Start Screening" or "शुरू करो" to begin
                            </p>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content (full width, no sidebar) */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation (Mobile only) */}
            <nav className="md:hidden sticky bottom-0 z-30 glass border-t border-gray-200/50 shadow-top">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'text-clinical-blue'
                                    : 'text-gray-400'
                                }`}
                        >
                            <span className={`text-xl transition-transform ${location.pathname === item.path ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                            {location.pathname === item.path && (
                                <div className="w-1 h-1 rounded-full bg-clinical-blue mt-0.5" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
