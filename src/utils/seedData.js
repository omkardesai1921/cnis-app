/**
 * Seed data utility for generating realistic screening records.
 * Uses weighted randomness to simulate outbreaks and nutritional trends.
 */

import { performScreening } from './screening';

const locations = [
    { state: 'Maharashtra', districts: ['Nandurbar', 'Gadchiroli', 'Melghat', 'Palghar'] },
    { state: 'Bihar', districts: ['Gaya', 'Muzaffarpur', 'Sitamarhi'] },
    { state: 'Uttar Pradesh', districts: ['Bahraich', 'Shravasti', 'Balrampur'] }
];

const mockNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Reyansh', 'Ananya', 'Diya', 'Saanvi', 'Pari', 'Myra'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString().split('T')[0];
}

// Generate a correlated health record (e.g., Fever + Low Weight)
function generateSmartRecord(id) {
    const loc = getRandomItem(locations);
    const district = getRandomItem(loc.districts);
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const age = Math.floor(Math.random() * 55) + 5; // 5-60 months

    // Introduce Correlation: "Outbreak Mode"
    // If location is 'Nandurbar', increase chance of 'fever'
    let symptoms = [];
    const isOutbreakZone = district === 'Nandurbar';

    if (isOutbreakZone && Math.random() > 0.3) symptoms.push('fever');
    if (Math.random() > 0.8) symptoms.push('cough');
    if (Math.random() > 0.9) symptoms.push('diarrhea');

    // Simulate Measurements
    // SAM cases (unhealthy) vs Normal
    const isSAM = Math.random() > 0.7; // 30% malnutrition rate for demo
    const muac = isSAM ? (10 + Math.random() * 1.5).toFixed(1) : (12.5 + Math.random() * 2).toFixed(1);
    const weight = isSAM ? (5 + Math.random() * 3).toFixed(1) : (8 + Math.random() * 4).toFixed(1);
    const height = (60 + Math.random() * 20).toFixed(1);

    const screeningResult = performScreening(muac, age, isSAM, false); // weak check

    return {
        id: `SCREEN-${1000 + id}`,
        childName: getRandomItem(mockNames),
        ageMonths: age,
        gender,
        location: { state: loc.state, district },
        date: getRandomDate(30),
        measurements: { muac, weight, height },
        medicalHistory: symptoms,
        result: screeningResult,
        synced: Math.random() > 0.2
    };
}

export function generateSeedData(count = 50) {
    return Array.from({ length: count }, (_, i) => generateSmartRecord(i));
}
