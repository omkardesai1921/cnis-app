import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ReportsPage() {
    const { t } = useTranslation();
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const saved = localStorage.getItem('cnis_screenings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setReports(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (e) { /* ignore */ }
        }
    }, []);

    const filtered = filter === 'all'
        ? reports
        : reports.filter(r => r.result?.zone === filter);

    const stats = {
        total: reports.length,
        sam: reports.filter(r => r.result?.zone === 'red').length,
        mam: reports.filter(r => r.result?.zone === 'orange').length,
        normal: reports.filter(r => r.result?.zone === 'green').length,
    };

    const deleteReport = (id) => {
        const updated = reports.filter(r => r.id !== id);
        setReports(updated);
        localStorage.setItem('cnis_screenings', JSON.stringify(updated));
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return dateStr; }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('reports')}</h2>
                <p className="text-sm text-gray-500">View and manage screening records</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: t('total_screenings'), value: stats.total, icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50', filter: 'all' },
                    { label: t('sam_cases'), value: stats.sam, icon: '🔴', color: 'text-red-600', bg: 'bg-red-50', filter: 'red' },
                    { label: t('mam_cases'), value: stats.mam, icon: '🟠', color: 'text-orange-500', bg: 'bg-orange-50', filter: 'orange' },
                    { label: t('normal_cases'), value: stats.normal, icon: '🟢', color: 'text-green-600', bg: 'bg-green-50', filter: 'green' },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => setFilter(stat.filter)}
                        className={`glass rounded-2xl p-4 border-2 transition-all text-left ${filter === stat.filter ? 'border-clinical-blue shadow-md' : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}>
                            <span className="text-lg">{stat.icon}</span>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Reports List */}
            {filtered.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center border border-gray-100">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-500 font-medium">{t('no_reports')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">{t('recent_reports')}</h3>
                    {filtered.map((report, i) => (
                        <div
                            key={report.id || i}
                            className="glass rounded-2xl p-4 border border-gray-100 card-hover animate-slide-up"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Status indicator */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.result?.zone === 'red' ? 'bg-red-100' :
                                            report.result?.zone === 'orange' ? 'bg-orange-100' :
                                                'bg-green-100'
                                        }`}>
                                        <span className="text-xl">
                                            {report.result?.zone === 'red' ? '🚨' :
                                                report.result?.zone === 'orange' ? '⚠️' : '✅'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{report.childName || 'Unknown Child'}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${report.result?.zone === 'red' ? 'zone-sam' :
                                                    report.result?.zone === 'orange' ? 'zone-mam' :
                                                        'zone-normal'
                                                }`}>
                                                {report.result?.overallStatus || 'Normal'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {report.gender === 'male' ? '👦' : '👧'} {report.ageMonths}mo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">{formatDate(report.createdAt)}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-xs text-gray-500">MUAC: {report.muacCm}cm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-4 text-xs text-gray-500">
                                    {report.heightCm && <span>📏 {report.heightCm}cm</span>}
                                    {report.weightKg && <span>⚖️ {report.weightKg}kg</span>}
                                    {report.location?.state && <span>📍 {report.location.state}</span>}
                                </div>
                                <button
                                    onClick={() => deleteReport(report.id)}
                                    className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
