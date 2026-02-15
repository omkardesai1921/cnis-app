import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const roles = [
    {
        id: 'asha',
        labelKey: 'asha_worker',
        descKey: 'role_asha_desc',
        icon: '👩‍⚕️',
        gradient: 'from-blue-500 to-blue-600',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400',
    },
    {
        id: 'parent',
        labelKey: 'parent',
        descKey: 'role_parent_desc',
        icon: '👨‍👩‍👧',
        gradient: 'from-emerald-500 to-emerald-600',
        bgLight: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        hoverBorder: 'hover:border-emerald-400',
    },
    {
        id: 'other',
        labelKey: 'other',
        descKey: 'role_other_desc',
        icon: '🔬',
        gradient: 'from-purple-500 to-purple-600',
        bgLight: 'bg-purple-50',
        borderColor: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400',
    },
];

export default function RoleSelection() {
    const { t } = useTranslation();
    const { selectRole, user } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden p-4">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-200/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-clinical-accent/20 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Welcome */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-clinical flex items-center justify-center shadow-lg">
                        <span className="text-3xl">🏥</span>
                    </div>
                    {user?.displayName && (
                        <p className="text-gray-500 mb-2">
                            Welcome, <span className="font-semibold text-gray-700">{user.displayName}</span>
                        </p>
                    )}
                    <h1 className="text-2xl font-bold text-gray-800">{t('select_role')}</h1>
                    <p className="text-sm text-gray-500 mt-1">Choose your role to personalize your experience</p>
                </div>

                {/* Role Cards */}
                <div className="space-y-4">
                    {roles.map((role, index) => (
                        <button
                            key={role.id}
                            id={`role-${role.id}-btn`}
                            onClick={() => selectRole(role.id)}
                            className={`w-full glass rounded-2xl p-5 border-2 ${role.borderColor} ${role.hoverBorder} hover:shadow-xl transition-all duration-300 group text-left animate-slide-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{role.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-clinical-blue transition-colors">
                                        {t(role.labelKey)}
                                    </h3>
                                    <p className="text-sm text-gray-500">{t(role.descKey)}</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-clinical-blue group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
