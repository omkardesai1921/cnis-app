// WHO-based nutrition classification using MUAC thresholds
// Primary screening tool for community health workers

/**
 * Classify nutritional status based on MUAC
 * < 11.5 cm = SAM (Severe Acute Malnutrition)
 * 11.5 - 12.5 cm = MAM (Moderate Acute Malnutrition)
 * > 12.5 cm = Normal
 */
export function classifyByMUAC(muacCm) {
    const muac = parseFloat(muacCm);
    if (isNaN(muac)) return null;

    if (muac < 11.5) {
        return {
            status: 'SAM',
            zone: 'red',
            label: 'sam',
            zoneLabel: 'red_zone',
            severity: 3,
            color: '#dc2626',
            bgColor: '#fef2f2',
            urgent: true
        };
    } else if (muac <= 12.5) {
        return {
            status: 'MAM',
            zone: 'orange',
            label: 'mam',
            zoneLabel: 'orange_zone',
            severity: 2,
            color: '#f97316',
            bgColor: '#fff7ed',
            urgent: false
        };
    } else {
        return {
            status: 'Normal',
            zone: 'green',
            label: 'normal',
            zoneLabel: 'green_zone',
            severity: 1,
            color: '#22c55e',
            bgColor: '#f0fdf4',
            urgent: false
        };
    }
}

/**
 * Weight-for-Height Z-Score approximation
 * Simplified WHO standard check
 */
export function classifyWeightForHeight(gender, ageMonths, heightCm, weightKg) {
    const age = parseInt(ageMonths);
    const height = parseFloat(heightCm);
    const weight = parseFloat(weightKg);

    if (isNaN(age) || isNaN(height) || isNaN(weight)) return null;

    // Simplified WHO median weight-for-height reference
    // Using approximate median values
    const expectedWeight = getExpectedWeight(gender, age, height);

    if (!expectedWeight) return null;

    const ratio = weight / expectedWeight;

    if (ratio < 0.7) {
        return { status: 'SAM', zScore: -3, label: 'Severely Wasted' };
    } else if (ratio < 0.8) {
        return { status: 'MAM', zScore: -2, label: 'Moderately Wasted' };
    } else if (ratio < 0.9) {
        return { status: 'At Risk', zScore: -1, label: 'Mildly Wasted' };
    } else {
        return { status: 'Normal', zScore: 0, label: 'Normal Weight' };
    }
}

/**
 * Get expected weight based on WHO growth standards (simplified)
 */
function getExpectedWeight(gender, ageMonths, heightCm) {
    // Simplified lookup table for expected weight based on height
    // These are approximate WHO median values
    const heightWeightMap = {
        male: {
            65: 7.9, 70: 8.7, 75: 9.5, 80: 10.2, 85: 11.0,
            90: 12.0, 95: 13.1, 100: 14.3, 105: 15.5, 110: 16.9
        },
        female: {
            65: 7.4, 70: 8.2, 75: 9.0, 80: 9.8, 85: 10.6,
            90: 11.5, 95: 12.6, 100: 13.9, 105: 15.2, 110: 16.6
        }
    };

    const map = heightWeightMap[gender] || heightWeightMap.female;
    const heights = Object.keys(map).map(Number);

    // Find closest height
    let closest = heights[0];
    let minDiff = Math.abs(heightCm - closest);

    for (const h of heights) {
        const diff = Math.abs(heightCm - h);
        if (diff < minDiff) {
            minDiff = diff;
            closest = h;
        }
    }

    return map[closest];
}

/**
 * Comprehensive screening assessment
 * Combines MUAC, weight-for-height, and medical history
 */
export function performScreening(data) {
    const { gender, ageMonths, heightCm, weightKg, muacCm, medicalHistory = [] } = data;

    const muacResult = classifyByMUAC(muacCm);
    const wfhResult = classifyWeightForHeight(gender, ageMonths, heightCm, weightKg);

    // Determine overall status (worst case)
    let overallStatus = 'Normal';
    let zone = 'green';
    let severity = 1;

    if (muacResult) {
        if (muacResult.severity > severity) {
            overallStatus = muacResult.status;
            zone = muacResult.zone;
            severity = muacResult.severity;
        }
    }

    if (wfhResult) {
        const wfhSeverity = wfhResult.status === 'SAM' ? 3 : wfhResult.status === 'MAM' ? 2 : 1;
        if (wfhSeverity > severity) {
            overallStatus = wfhResult.status;
            zone = wfhSeverity === 3 ? 'red' : wfhSeverity === 2 ? 'orange' : 'green';
            severity = wfhSeverity;
        }
    }

    // Medical history can upgrade severity
    const dangerSigns = [];
    const hasEdema = medicalHistory.includes('edema');
    const hasLethargy = medicalHistory.includes('lethargy');
    const hasDiarrhea = medicalHistory.includes('diarrhea');

    if (hasEdema) {
        dangerSigns.push('warning_edema');
        if (severity < 3) {
            overallStatus = 'SAM';
            zone = 'red';
            severity = 3;
        }
    }

    if (hasLethargy) {
        dangerSigns.push('warning_lethargy');
        if (severity < 3) {
            overallStatus = 'SAM';
            zone = 'red';
            severity = 3;
        }
    }

    if (muacResult && muacResult.urgent) {
        dangerSigns.push('warning_muac');
    }

    return {
        overallStatus,
        zone,
        severity,
        muacResult,
        wfhResult,
        dangerSigns,
        medicalFlags: {
            edema: hasEdema,
            lethargy: hasLethargy,
            diarrhea: hasDiarrhea,
            fever: medicalHistory.includes('fever'),
            cough: medicalHistory.includes('cough')
        },
        recommendations: getRecommendations(overallStatus, zone),
        timestamp: new Date().toISOString()
    };
}

/**
 * Get action recommendations based on status
 */
function getRecommendations(status, zone) {
    switch (zone) {
        case 'red':
            return {
                action: 'URGENT: Refer to nearest health facility immediately',
                feeding: 'Therapeutic feeding (F-75/F-100 as per protocol)',
                followUp: 'Daily monitoring required',
                referral: true
            };
        case 'orange':
            return {
                action: 'Enroll in supplementary feeding program',
                feeding: 'High-energy, nutrient-dense foods with increased frequency',
                followUp: 'Weekly monitoring and weight check',
                referral: false
            };
        default:
            return {
                action: 'Continue regular nutrition and growth monitoring',
                feeding: 'Age-appropriate balanced diet',
                followUp: 'Monthly growth monitoring',
                referral: false
            };
    }
}
