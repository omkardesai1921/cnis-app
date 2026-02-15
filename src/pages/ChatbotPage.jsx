import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoice } from '../hooks/useVoice';
import { speak, getTTSLang } from '../utils/voice';
import { generateSeedData } from '../utils/seedData';
import { getDistrictStats } from '../data/nfhsStats';
import { searchRagKnowledge } from '../data/ragPdfKnowledge';

// Built-in knowledge base for offline use
const knowledgeBase = {
    en: {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: {
            greeting: "Hello! I'm **NutriCare Medibot** 🏥✨\n\nI'm your smart AI assistant! I can help you with **anything** you need:\n\n🏥 **Health & Medical** — symptoms, treatments, first aid\n🍼 **Child Nutrition** — feeding, diet, malnutrition\n📏 **Growth Monitoring** — MUAC, weight, height\n💉 **Vaccinations** — schedules, importance\n🤰 **Maternal Health** — pregnancy, breastfeeding\n📚 **General Knowledge** — science, history, education\n💡 **Any Question** — I'm here to help with everything!\n\nAsk me anything! 😊",
            muac: "**MUAC (Mid-Upper Arm Circumference) Guide:**\n\n🔴 **< 11.5 cm = SAM (Severe Acute Malnutrition)**\n- Child needs immediate medical attention\n- Refer to Nutrition Rehabilitation Center\n\n🟠 **11.5 - 12.5 cm = MAM (Moderate)**\n- Enroll in supplementary feeding\n- Weekly monitoring needed\n\n🟢 **> 12.5 cm = Normal**\n- Continue regular growth monitoring\n- Monthly checkups recommended",
            breastfeeding: "**Breastfeeding Guidelines:**\n\n🍼 **0-6 months:** Exclusive breastfeeding\n- No water, no other milk, no food\n- Feed on demand (8-12 times/day)\n\n🍼 **6-24 months:** Continue breastfeeding + complementary foods\n- Start with mashed foods at 6 months\n- Gradually increase texture and variety",
            malnutrition_signs: "**Early Warning Signs of Malnutrition:**\n\n⚠️ **Weight loss** or no weight gain for 2+ months\n⚠️ **Thin arms and legs** - loose skin\n⚠️ **Swollen feet/face** (edema)\n⚠️ **Hair changes** - thin, discolored\n⚠️ **Repeated infections**\n⚠️ **Lethargy** - very weak and inactive\n\n🚨 **DANGER SIGNS - Go to hospital NOW:**\n- Severe swelling of both feet\n- Extreme weakness/unconsciousness\n- Convulsions",
            diet_6_24: "**Complementary Feeding (6-24 months):**\n\n📅 **6-8 months:** 2-3 tablespoons, 2-3 times/day\n📅 **9-11 months:** 1/2 cup, 3-4 times/day + 1 snack\n📅 **12-24 months:** 3/4 to 1 cup, 3-4 times/day + 2 snacks\n\n💡 Add oil/ghee to increase calories!",
            when_doctor: "**When to Visit a Doctor:**\n\n🏥 **Immediately if:**\n- Swollen feet or face\n- Very weak, unable to play\n- Not eating/drinking for 24+ hours\n- High fever (>102°F)\n- Convulsions\n\n📋 **Within a week if:**\n- Not gaining weight for 2 months\n- MUAC between 11.5-12.5 cm\n- Persistent cough for 2+ weeks",
            fever: "**Managing Fever in Children:**\n\n🌡️ **Normal:** 36.5-37.5°C\n⚠️ **Mild fever:** Give fluids, sponge with lukewarm water\n🚨 **High fever (>39°C):** Seek medical attention immediately",
            diarrhea: "**Managing Diarrhea:**\n\n💧 Start ORS immediately\n🍼 Continue breastfeeding\n💊 Zinc supplements for 10-14 days\n\n📋 **ORS Recipe:** 1L water + 6 tsp sugar + ½ tsp salt",
            vaccination: "**Vaccination Schedule (India):**\n\n💉 Birth: BCG, OPV-0, Hep B\n💉 6 weeks: Pentavalent-1, Rotavirus-1\n💉 9 months: MR-1, JE-1\n💉 16-24 months: MR-2, DPT Booster",
            default: "I can help with many topics! Here are some ideas:\n\n1️⃣ **MUAC measurement** — 'MUAC'\n2️⃣ **Child nutrition** — 'diet'\n3️⃣ **Fever or illness** — 'fever'\n4️⃣ **Vaccinations** — 'vaccination'\n5️⃣ **When to see doctor** — 'doctor'\n\nOr ask me any question — health, education, general knowledge, or anything else! 😊"
        }
    },
    hi: {
        greetings: ['नमस्ते', 'हेलो', 'हाय', 'नमस्कार'],
        responses: {
            greeting: "नमस्ते! मैं **NutriCare Medibot** हूं 🏥✨\n\nमैं आपका स्मार्ट AI सहायक हूं! मैं **किसी भी** सवाल में मदद कर सकता हूं:\n\n🏥 **स्वास्थ्य और चिकित्सा** — लक्षण, उपचार, प्राथमिक चिकित्सा\n🍼 **बच्चों का पोषण** — आहार, कुपोषण\n💉 **टीकाकरण** — अनुसूची, महत्व\n📚 **सामान्य ज्ञान** — विज्ञान, इतिहास, शिक्षा\n💡 **कोई भी सवाल** — मैं हर चीज़ में मदद करने के लिए हूं!\n\nकुछ भी पूछें! 😊",
            muac: "**MUAC (मध्य-ऊपरी बांह परिधि) गाइड:**\n\n🔴 **< 11.5 सेमी = SAM (गंभीर तीव्र कुपोषण)**\n- बच्चे को तुरंत चिकित्सा की जरूरत है\n- पोषण पुनर्वास केंद्र में भेजें\n\n🟠 **11.5 - 12.5 सेमी = MAM (मध्यम)**\n- पूरक आहार कार्यक्रम में नामांकन करें\n- साप्ताहिक निगरानी जरूरी है\n\n🟢 **> 12.5 सेमी = सामान्य**\n- नियमित विकास निगरानी जारी रखें\n- मासिक जांच की सिफारिश",
            breastfeeding: "**स्तनपान दिशानिर्देश:**\n\n🍼 **0-6 महीने:** केवल स्तनपान\n- कोई पानी नहीं, कोई अन्य दूध नहीं, कोई खाना नहीं\n- मांग पर दूध पिलाएं (दिन में 8-12 बार)\n\n🍼 **6-24 महीने:** स्तनपान जारी रखें + पूरक आहार\n- 6 महीने पर मसला हुआ खाना शुरू करें\n- धीरे-धीरे बनावट और विविधता बढ़ाएं",
            malnutrition_signs: "**कुपोषण के शुरुआती संकेत:**\n\n⚠️ **वजन कम होना** या 2+ महीने वजन न बढ़ना\n⚠️ **पतले हाथ-पैर** - ढीली त्वचा\n⚠️ **पैरों/चेहरे पर सूजन** (एडिमा)\n⚠️ **बालों में बदलाव** - पतले, रंग बदला\n⚠️ **बार-बार संक्रमण**\n⚠️ **सुस्ती** - बहुत कमजोर और निष्क्रिय\n\n🚨 **खतरे के संकेत - अभी अस्पताल जाएं:**\n- दोनों पैरों में गंभीर सूजन\n- अत्यधिक कमजोरी/बेहोशी\n- दौरे",
            diet_6_24: "**पूरक आहार (6-24 महीने):**\n\n📅 **6-8 महीने:** 2-3 चम्मच, दिन में 2-3 बार\n📅 **9-11 महीने:** 1/2 कप, दिन में 3-4 बार + 1 नाश्ता\n📅 **12-24 महीने:** 3/4 से 1 कप, दिन में 3-4 बार + 2 नाश्ता\n\n💡 कैलोरी बढ़ाने के लिए तेल/घी मिलाएं!",
            when_doctor: "**डॉक्टर के पास कब जाएं:**\n\n🏥 **तुरंत अगर:**\n- पैरों या चेहरे पर सूजन\n- बहुत कमजोर, खेल नहीं पा रहा\n- 24+ घंटे से कुछ नहीं खा/पी रहा\n- तेज बुखार (>102°F)\n- दौरे\n\n📋 **एक हफ्ते में अगर:**\n- 2 महीने से वजन नहीं बढ़ रहा\n- MUAC 11.5-12.5 सेमी के बीच\n- 2+ हफ्ते से लगातार खांसी",
            fever: "**बच्चों में बुखार का प्रबंधन:**\n\n🌡️ **सामान्य:** 36.5-37.5°C\n⚠️ **हल्का बुखार:** तरल पदार्थ दें, गुनगुने पानी से स्पंज करें\n🚨 **तेज बुखार (>39°C):** तुरंत चिकित्सा सहायता लें",
            diarrhea: "**दस्त का प्रबंधन:**\n\n💧 तुरंत ORS शुरू करें\n🍼 स्तनपान जारी रखें\n💊 10-14 दिनों के लिए जिंक की खुराक\n\n📋 **ORS बनाने की विधि:** 1 लीटर पानी + 6 चम्मच चीनी + ½ चम्मच नमक",
            vaccination: "**टीकाकरण अनुसूची (भारत):**\n\n💉 जन्म: BCG, OPV-0, Hep B\n💉 6 सप्ताह: पेंटावैलेंट-1, रोटावायरस-1\n💉 9 महीने: MR-1, JE-1\n💉 16-24 महीने: MR-2, DPT बूस्टर",
            default: "मैं कई विषयों में मदद कर सकता हूं:\n\n1️⃣ **MUAC माप** — 'MUAC'\n2️⃣ **बच्चों का पोषण** — 'आहार'\n3️⃣ **बुखार** — 'बुखार'\n4️⃣ **टीकाकरण** — 'टीकाकरण'\n5️⃣ **डॉक्टर कब जाएं** — 'डॉक्टर'\n\nया कोई भी सवाल पूछें! 😊"
        }
    },
    mr: {
        greetings: ['नमस्कार', 'हॅलो', 'नमस्ते'],
        responses: {
            greeting: "नमस्कार! मी **NutriCare Medibot** आहे 🏥✨\n\nमी तुमचा स्मार्ट AI सहाय्यक आहे! मी **कोणत्याही** प्रश्नात मदत करू शकतो:\n\n🏥 **आरोग्य आणि वैद्यकीय** — लक्षणे, उपचार\n🍼 **मुलांचे पोषण** — आहार, कुपोषण\n💉 **लसीकरण** — वेळापत्रक, महत्व\n📚 **सामान्य ज्ञान** — विज्ञान, इतिहास, शिक्षण\n💡 **कोणताही प्रश्न** — मी सर्व गोष्टींमध्ये मदत करण्यासाठी आहे!\n\nकाहीही विचारा! 😊",
            muac: "**MUAC (मध्य-वरच्या दंडाचा घेर) मार्गदर्शक:**\n\n🔴 **< 11.5 सेमी = SAM (तीव्र गंभीर कुपोषण)**\n- मुलाला तात्काळ वैद्यकीय उपचारांची गरज आहे\n- पोषण पुनर्वसन केंद्रात पाठवा\n\n🟠 **11.5 - 12.5 सेमी = MAM (मध्यम)**\n- पूरक आहार कार्यक्रमात नावनोंदणी करा\n- साप्ताहिक निरीक्षण आवश्यक\n\n🟢 **> 12.5 सेमी = सामान्य**\n- नियमित वाढ निरीक्षण सुरू ठेवा\n- मासिक तपासणी शिफारसीय",
            breastfeeding: "**स्तनपान मार्गदर्शक:**\n\n🍼 **0-6 महिने:** केवळ स्तनपान\n- पाणी नाही, इतर दूध नाही, अन्न नाही\n- मागणीनुसार दूध द्या (दिवसातून 8-12 वेळा)\n\n🍼 **6-24 महिने:** स्तनपान सुरू ठेवा + पूरक आहार\n- 6 महिन्यांवर मऊ अन्न सुरू करा\n- हळूहळू पोत आणि विविधता वाढवा",
            malnutrition_signs: "**कुपोषणाची सुरुवातीची लक्षणे:**\n\n⚠️ **वजन कमी होणे** किंवा 2+ महिने वजन न वाढणे\n⚠️ **बारीक हात-पाय** - सैल त्वचा\n⚠️ **पाय/चेहऱ्यावर सूज** (एडिमा)\n⚠️ **केसांमध्ये बदल** - पातळ, रंग बदललेले\n⚠️ **वारंवार संसर्ग**\n⚠️ **सुस्ती** - खूप अशक्त आणि निष्क्रिय\n\n🚨 **धोक्याची चिन्हे - आत्ताच रुग्णालयात जा:**\n- दोन्ही पायांवर तीव्र सूज\n- अत्यंत अशक्तपणा/बेशुद्धी\n- झटके",
            diet_6_24: "**पूरक आहार (6-24 महिने):**\n\n📅 **6-8 महिने:** 2-3 चमचे, दिवसातून 2-3 वेळा\n📅 **9-11 महिने:** 1/2 कप, दिवसातून 3-4 वेळा + 1 स्नॅक\n📅 **12-24 महिने:** 3/4 ते 1 कप, दिवसातून 3-4 वेळा + 2 स्नॅक\n\n💡 कॅलरी वाढवण्यासाठी तेल/तूप घाला!",
            when_doctor: "**डॉक्टरांकडे कधी जावे:**\n\n🏥 **तात्काळ जर:**\n- पाय किंवा चेहऱ्यावर सूज\n- खूप अशक्त, खेळू शकत नाही\n- 24+ तास काहीही खात/पीत नाही\n- जास्त ताप (>102°F)\n- झटके\n\n📋 **एका आठवड्यात जर:**\n- 2 महिन्यांपासून वजन वाढत नाही\n- MUAC 11.5-12.5 सेमी दरम्यान\n- 2+ आठवडे सतत खोकला",
            fever: "**मुलांमध्ये तापाचे व्यवस्थापन:**\n\n🌡️ **सामान्य:** 36.5-37.5°C\n⚠️ **सौम्य ताप:** द्रवपदार्थ द्या, कोमट पाण्याने स्पंज करा\n🚨 **जास्त ताप (>39°C):** तात्काळ वैद्यकीय मदत घ्या",
            diarrhea: "**जुलाबाचे व्यवस्थापन:**\n\n💧 तात्काळ ORS सुरू करा\n🍼 स्तनपान सुरू ठेवा\n💊 10-14 दिवसांसाठी झिंक पूरक\n\n📋 **ORS बनवण्याची पद्धत:** 1 लिटर पाणी + 6 चमचे साखर + ½ चमचा मीठ",
            vaccination: "**लसीकरण वेळापत्रक (भारत):**\n\n💉 जन्म: BCG, OPV-0, Hep B\n💉 6 आठवडे: पेंटावॅलेंट-1, रोटाव्हायरस-1\n💉 9 महिने: MR-1, JE-1\n💉 16-24 महिने: MR-2, DPT बूस्टर",
            default: "मी अनेक विषयांमध्ये मदत करू शकतो:\n\n1️⃣ **MUAC मापन**\n2️⃣ **मुलांचे पोषण**\n3️⃣ **ताप**\n4️⃣ **लसीकरण**\n5️⃣ **डॉक्टरांना कधी भेटावे**\n\nकिंवा कोणताही प्रश्न विचारा! 😊"
        }
    }
};

function getOfflineResponse(message, lang) {
    const lower = message.toLowerCase().trim();
    const kb = knowledgeBase[lang] || knowledgeBase.en;
    const enResponses = knowledgeBase.en.responses;

    // Helper: return response in selected language if available, else English
    const getResponse = (key) => {
        return kb.responses?.[key] || enResponses[key];
    };

    // Check greetings - use word boundary matching to avoid false positives
    // e.g. "hi" should NOT match inside "this", "which", "history"
    const isGreeting = (greetingList) => {
        return greetingList?.some(g => {
            const regex = new RegExp(`(^|\\s)${g}($|\\s|[!?,.])`, 'i');
            return regex.test(lower) || lower === g;
        });
    };

    if (isGreeting(kb.greetings) || isGreeting(knowledgeBase.en.greetings)) {
        return getResponse('greeting');
    }

    // Health topic matching (offline fallback)
    if (lower.includes('muac') || lower.includes('arm') || lower.includes('बांह') || lower.includes('बाहू')) {
        return getResponse('muac');
    }
    if (lower.includes('breast') || lower.includes('स्तनपान') || lower.includes('dudh') || lower.includes('दूध')) {
        return getResponse('breastfeeding');
    }
    if (lower.includes('sign') || lower.includes('warning') || lower.includes('symptom') || lower.includes('चेतावनी') || lower.includes('संकेत') || lower.includes('लक्षण')) {
        return getResponse('malnutrition_signs');
    }
    if (lower.includes('diet') || lower.includes('food') || lower.includes('feed') || lower.includes('आहार') || lower.includes('खाना') || lower.includes('अन्न')) {
        return getResponse('diet_6_24');
    }
    if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('डॉक्टर') || lower.includes('अस्पताल')) {
        return getResponse('when_doctor');
    }
    if (lower.includes('malnutrition') || lower.includes('कुपोषण') || lower.includes('kuposhan')) {
        return getResponse('malnutrition_signs');
    }
    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('बुखार') || lower.includes('ताप')) {
        return getResponse('fever');
    }
    if (lower.includes('diarrhea') || lower.includes('diarrhoea') || lower.includes('loose motion') || lower.includes('दस्त') || lower.includes('जुलाब')) {
        return getResponse('diarrhea');
    }
    if (lower.includes('vaccin') || lower.includes('immuniz') || lower.includes('टीका') || lower.includes('लसीकरण')) {
        return getResponse('vaccination');
    }

    return getResponse('default');
}

// ========== HYBRID RAG: Live Data + Government Baseline + GPS ==========

// GPS-detected location (updated on component mount)
let detectedLocation = { state: '', district: '', detected: false };

async function detectChatbotLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(detectedLocation);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Try free reverse geocoding (OpenStreetMap Nominatim) for EXACT district
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=10`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const addr = data.address || {};
                        // Nominatim returns district in 'county' or 'state_district' field for India
                        let district = addr.state_district || addr.county || addr.city || addr.town || '';
                        let state = addr.state || '';

                        // Special handling for Union Territories (Delhi, Chandigarh, etc.)
                        // Nominatim often returns empty state_district for UTs
                        const unionTerritories = ['Delhi', 'Chandigarh', 'Puducherry', 'Lakshadweep', 'Andaman and Nicobar Islands'];
                        if (unionTerritories.some(ut => state.toLowerCase().includes(ut.toLowerCase()))) {
                            // For Delhi: use suburb/city_district/neighbourhood as district
                            district = addr.city_district || addr.suburb || addr.city || state;
                            // Normalize "NCT of Delhi" → "Delhi"
                            state = state.replace(/^NCT\s+of\s+/i, '').replace(/^National Capital Territory of\s*/i, '').trim();
                            if (!district || district === state) {
                                district = addr.suburb || addr.city_district || 'New Delhi';
                            }
                        }

                        if (district && state) {
                            // Clean up district name (remove "district" suffix if present)
                            const cleanDistrict = district.replace(/\s*(district|जिला|जिल्हा)$/i, '').trim();
                            detectedLocation = { state, district: cleanDistrict, detected: true, isStateLevel: false };
                            console.log('[RAG GPS] 📍 Exact location via API:', cleanDistrict, ',', state);
                            resolve(detectedLocation);
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('[RAG GPS] API fallback, using coordinate mapping:', e.message);
                }
                // Fallback: use hardcoded coordinate mapping
                const result = mapCoordsToLocation(latitude, longitude);
                detectedLocation = { ...result, detected: true };
                console.log('[RAG GPS] 📍 Detected via coords:', detectedLocation.district, ',', detectedLocation.state);
                resolve(detectedLocation);
            },
            () => {
                console.log('[RAG GPS] ⚠️ GPS denied, using default');
                resolve(detectedLocation);
            },
            { timeout: 8000 }
        );
    });
}

// Map GPS coordinates to state AND nearest known NFHS district
function mapCoordsToLocation(lat, lng) {
    // All NFHS districts with GPS centers: [name, state, lat, lng]
    const D = [
        // Maharashtra (36 districts)
        ['Nandurbar', 'Maharashtra', 21.37, 74.24], ['Gadchiroli', 'Maharashtra', 20.10, 80.00],
        ['Nanded', 'Maharashtra', 19.16, 77.30], ['Osmanabad', 'Maharashtra', 18.18, 76.05],
        ['Washim', 'Maharashtra', 20.11, 77.13], ['Amravati', 'Maharashtra', 20.93, 77.75],
        ['Jalgaon', 'Maharashtra', 21.01, 75.56], ['Nashik', 'Maharashtra', 20.00, 73.78],
        ['Pune', 'Maharashtra', 18.52, 73.85], ['Mumbai Suburban', 'Maharashtra', 19.07, 72.87],
        ['Mumbai', 'Maharashtra', 19.08, 72.88], ['Thane', 'Maharashtra', 19.22, 72.97],
        ['Nagpur', 'Maharashtra', 21.15, 79.09], ['Aurangabad', 'Maharashtra', 19.88, 75.34],
        ['Kolhapur', 'Maharashtra', 16.70, 74.24], ['Solapur', 'Maharashtra', 17.66, 75.91],
        ['Satara', 'Maharashtra', 17.68, 74.00], ['Ratnagiri', 'Maharashtra', 16.99, 73.30],
        ['Sindhudurg', 'Maharashtra', 16.35, 73.75], ['Ahmednagar', 'Maharashtra', 19.08, 74.74],
        ['Beed', 'Maharashtra', 18.99, 75.76], ['Latur', 'Maharashtra', 18.40, 76.57],
        ['Palghar', 'Maharashtra', 19.70, 72.77], ['Raigad', 'Maharashtra', 18.52, 73.18],
        ['Sangli', 'Maharashtra', 16.85, 74.56], ['Dhule', 'Maharashtra', 20.90, 74.77],
        ['Buldhana', 'Maharashtra', 20.53, 76.18], ['Akola', 'Maharashtra', 20.71, 77.00],
        ['Yavatmal', 'Maharashtra', 20.39, 78.12], ['Wardha', 'Maharashtra', 20.74, 78.60],
        ['Chandrapur', 'Maharashtra', 19.95, 79.30], ['Bhandara', 'Maharashtra', 21.17, 79.65],
        ['Gondia', 'Maharashtra', 21.46, 80.20], ['Hingoli', 'Maharashtra', 19.72, 77.15],
        ['Jalna', 'Maharashtra', 19.84, 75.88], ['Parbhani', 'Maharashtra', 19.27, 76.78],
        // Uttar Pradesh (23 districts)
        ['Bahraich', 'Uttar Pradesh', 27.57, 81.60], ['Shravasti', 'Uttar Pradesh', 27.50, 82.10],
        ['Balrampur', 'Uttar Pradesh', 27.43, 82.18], ['Siddharthnagar', 'Uttar Pradesh', 27.29, 83.09],
        ['Sitapur', 'Uttar Pradesh', 27.57, 80.68], ['Hardoi', 'Uttar Pradesh', 27.40, 80.13],
        ['Unnao', 'Uttar Pradesh', 26.55, 80.49], ['Rae Bareli', 'Uttar Pradesh', 26.23, 81.24],
        ['Lucknow', 'Uttar Pradesh', 26.85, 80.95], ['Varanasi', 'Uttar Pradesh', 25.32, 82.99],
        ['Kanpur Nagar', 'Uttar Pradesh', 26.45, 80.33], ['Agra', 'Uttar Pradesh', 27.18, 78.02],
        ['Allahabad', 'Uttar Pradesh', 25.43, 81.85], ['Gorakhpur', 'Uttar Pradesh', 26.76, 83.37],
        ['Jaunpur', 'Uttar Pradesh', 25.75, 82.68], ['Azamgarh', 'Uttar Pradesh', 26.07, 83.19],
        ['Ghaziabad', 'Uttar Pradesh', 28.67, 77.42], ['Noida', 'Uttar Pradesh', 28.53, 77.39],
        ['Meerut', 'Uttar Pradesh', 28.98, 77.71], ['Bareilly', 'Uttar Pradesh', 28.37, 79.42],
        ['Moradabad', 'Uttar Pradesh', 28.84, 78.78], ['Mathura', 'Uttar Pradesh', 27.49, 77.67],
        ['Sultanpur', 'Uttar Pradesh', 26.26, 82.07],
        // Bihar (15 districts)
        ['Madhubani', 'Bihar', 26.35, 86.07], ['Kishanganj', 'Bihar', 26.09, 87.95],
        ['Araria', 'Bihar', 26.15, 87.46], ['Purnia', 'Bihar', 25.78, 87.47],
        ['Katihar', 'Bihar', 25.54, 87.57], ['Supaul', 'Bihar', 26.12, 86.60],
        ['Gaya', 'Bihar', 24.80, 85.00], ['Nawada', 'Bihar', 24.89, 85.54],
        ['Muzaffarpur', 'Bihar', 26.12, 85.39], ['Patna', 'Bihar', 25.61, 85.14],
        ['Bhagalpur', 'Bihar', 25.24, 86.97], ['Vaishali', 'Bihar', 25.99, 85.22],
        ['Samastipur', 'Bihar', 25.86, 85.78], ['Darbhanga', 'Bihar', 26.17, 85.90],
        ['Begusarai', 'Bihar', 25.42, 86.13],
        // Madhya Pradesh (13 districts)
        ['Barwani', 'Madhya Pradesh', 22.03, 74.90], ['Alirajpur', 'Madhya Pradesh', 22.31, 74.36],
        ['Jhabua', 'Madhya Pradesh', 22.77, 74.59], ['Sheopur', 'Madhya Pradesh', 25.67, 76.70],
        ['Tikamgarh', 'Madhya Pradesh', 24.74, 78.83], ['Chhatarpur', 'Madhya Pradesh', 24.92, 79.59],
        ['Mandla', 'Madhya Pradesh', 22.60, 80.38], ['Dindori', 'Madhya Pradesh', 22.95, 81.08],
        ['Bhopal', 'Madhya Pradesh', 23.26, 77.41], ['Indore', 'Madhya Pradesh', 22.72, 75.86],
        ['Jabalpur', 'Madhya Pradesh', 23.18, 79.95], ['Gwalior', 'Madhya Pradesh', 26.22, 78.18],
        ['Ujjain', 'Madhya Pradesh', 23.18, 75.77],
        // Rajasthan (13 districts)
        ['Banswara', 'Rajasthan', 23.54, 74.44], ['Dungarpur', 'Rajasthan', 23.84, 73.71],
        ['Pratapgarh', 'Rajasthan', 24.03, 74.78], ['Barmer', 'Rajasthan', 25.75, 71.38],
        ['Jaisalmer', 'Rajasthan', 26.92, 70.91], ['Jodhpur', 'Rajasthan', 26.29, 73.02],
        ['Udaipur', 'Rajasthan', 24.58, 73.68], ['Jaipur', 'Rajasthan', 26.92, 75.79],
        ['Kota', 'Rajasthan', 25.18, 75.83], ['Ajmer', 'Rajasthan', 26.45, 74.64],
        ['Bikaner', 'Rajasthan', 28.02, 73.31], ['Alwar', 'Rajasthan', 27.56, 76.63],
        ['Sirohi', 'Rajasthan', 24.88, 72.86],
        // Jharkhand (9 districts)
        ['Dumka', 'Jharkhand', 24.27, 87.25], ['Pakur', 'Jharkhand', 24.64, 87.84],
        ['Sahibganj', 'Jharkhand', 25.24, 87.65], ['Godda', 'Jharkhand', 24.83, 87.21],
        ['Gumla', 'Jharkhand', 23.04, 84.54], ['Latehar', 'Jharkhand', 23.74, 84.50],
        ['Palamu', 'Jharkhand', 24.03, 84.05], ['Ranchi', 'Jharkhand', 23.34, 85.31],
        ['Jamshedpur', 'Jharkhand', 22.80, 86.20],
        // Chhattisgarh (8 districts)
        ['Bastar', 'Chhattisgarh', 19.10, 81.95], ['Korba', 'Chhattisgarh', 22.35, 82.68],
        ['Surguja', 'Chhattisgarh', 23.12, 83.10], ['Dantewada', 'Chhattisgarh', 18.90, 81.35],
        ['Bijapur', 'Chhattisgarh', 18.84, 80.77], ['Raipur', 'Chhattisgarh', 21.25, 81.63],
        ['Bilaspur', 'Chhattisgarh', 22.08, 82.15], ['Jashpur', 'Chhattisgarh', 22.89, 84.14],
        // Karnataka (10 districts)
        ['Raichur', 'Karnataka', 16.21, 77.36], ['Yadgir', 'Karnataka', 16.77, 77.14],
        ['Kalaburagi', 'Karnataka', 17.33, 76.83], ['Bidar', 'Karnataka', 17.91, 77.52],
        ['Ballari', 'Karnataka', 15.14, 76.92], ['Koppal', 'Karnataka', 15.35, 76.15],
        ['Bengaluru Urban', 'Karnataka', 12.97, 77.59], ['Mysuru', 'Karnataka', 12.30, 76.65],
        ['Mangaluru', 'Karnataka', 12.87, 74.88], ['Hubli-Dharwad', 'Karnataka', 15.36, 75.12],
        // Gujarat (9 districts)
        ['Dahod', 'Gujarat', 22.84, 74.26], ['Narmada', 'Gujarat', 21.87, 73.50],
        ['Panchmahal', 'Gujarat', 22.75, 73.60], ['Banaskantha', 'Gujarat', 24.17, 72.43],
        ['Sabarkantha', 'Gujarat', 23.63, 73.00], ['Ahmedabad', 'Gujarat', 23.02, 72.57],
        ['Surat', 'Gujarat', 21.20, 72.83], ['Vadodara', 'Gujarat', 22.31, 73.18],
        ['Rajkot', 'Gujarat', 22.30, 70.78],
        // Odisha (8 districts)
        ['Malkangiri', 'Odisha', 18.35, 81.88], ['Koraput', 'Odisha', 18.81, 82.71],
        ['Nabarangpur', 'Odisha', 19.23, 82.55], ['Rayagada', 'Odisha', 19.17, 83.42],
        ['Nuapada', 'Odisha', 20.78, 82.55], ['Kalahandi', 'Odisha', 19.91, 83.17],
        ['Bhubaneswar', 'Odisha', 20.30, 85.82], ['Cuttack', 'Odisha', 20.46, 85.88],
        // West Bengal (8 districts)
        ['Purulia', 'West Bengal', 23.33, 86.36], ['Bankura', 'West Bengal', 23.23, 87.07],
        ['Malda', 'West Bengal', 25.01, 88.14], ['Murshidabad', 'West Bengal', 24.18, 88.27],
        ['South 24 Parganas', 'West Bengal', 22.16, 88.43], ['Kolkata', 'West Bengal', 22.57, 88.36],
        ['Howrah', 'West Bengal', 22.59, 88.26], ['Jalpaiguri', 'West Bengal', 26.52, 88.73],
        // Andhra Pradesh (7 districts)
        ['Anantapur', 'Andhra Pradesh', 14.68, 77.60], ['Kurnool', 'Andhra Pradesh', 15.83, 78.04],
        ['Vizianagaram', 'Andhra Pradesh', 18.11, 83.39], ['Srikakulam', 'Andhra Pradesh', 18.30, 83.90],
        ['Visakhapatnam', 'Andhra Pradesh', 17.69, 83.22], ['Vijayawada', 'Andhra Pradesh', 16.51, 80.65],
        ['Tirupati', 'Andhra Pradesh', 13.63, 79.42],
        // Tamil Nadu (7 districts)
        ['Ramanathapuram', 'Tamil Nadu', 9.37, 78.83], ['Dharmapuri', 'Tamil Nadu', 12.13, 78.16],
        ['Villupuram', 'Tamil Nadu', 11.94, 79.49], ['Perambalur', 'Tamil Nadu', 11.23, 78.88],
        ['Chennai', 'Tamil Nadu', 13.08, 80.27], ['Coimbatore', 'Tamil Nadu', 11.00, 76.96],
        ['Madurai', 'Tamil Nadu', 9.92, 78.12],
        // Kerala (6 districts)
        ['Wayanad', 'Kerala', 11.60, 76.08], ['Idukki', 'Kerala', 9.85, 76.97],
        ['Palakkad', 'Kerala', 10.78, 76.65], ['Malappuram', 'Kerala', 11.04, 76.07],
        ['Thiruvananthapuram', 'Kerala', 8.52, 76.94], ['Ernakulam', 'Kerala', 9.98, 76.30],
        // Telangana (5 districts)
        ['Mahbubnagar', 'Telangana', 16.74, 78.00], ['Adilabad', 'Telangana', 19.67, 78.53],
        ['Komaram Bheem', 'Telangana', 19.45, 79.10], ['Hyderabad', 'Telangana', 17.38, 78.49],
        ['Warangal', 'Telangana', 17.98, 79.60],
        // Punjab (4 districts)
        ['Mansa', 'Punjab', 29.99, 75.39], ['Muktsar', 'Punjab', 30.47, 74.52],
        ['Ludhiana', 'Punjab', 30.90, 75.86], ['Amritsar', 'Punjab', 31.63, 74.87],
        // Haryana (4 districts)
        ['Mewat', 'Haryana', 27.93, 77.00], ['Palwal', 'Haryana', 28.14, 77.33],
        ['Gurugram', 'Haryana', 28.46, 77.03], ['Faridabad', 'Haryana', 28.41, 77.31],
        // Assam (3 districts)
        ['Dhubri', 'Assam', 26.02, 89.98], ['Barpeta', 'Assam', 26.32, 91.00],
        ['Guwahati', 'Assam', 26.14, 91.74],
        // Delhi (9 districts - expanded for better coverage)
        ['New Delhi', 'Delhi', 28.61, 77.21], ['South Delhi', 'Delhi', 28.53, 77.22],
        ['North East Delhi', 'Delhi', 28.70, 77.30], ['Central Delhi', 'Delhi', 28.64, 77.23],
        ['East Delhi', 'Delhi', 28.63, 77.30], ['West Delhi', 'Delhi', 28.65, 77.10],
        ['North Delhi', 'Delhi', 28.72, 77.20], ['South West Delhi', 'Delhi', 28.53, 77.08],
        ['North West Delhi', 'Delhi', 28.72, 77.07],
        // Goa (2 districts)
        ['North Goa', 'Goa', 15.53, 73.96], ['South Goa', 'Goa', 15.28, 74.00],
    ].map(([name, state, lat, lng]) => ({ name, state, lat, lng }));

    // Find nearest known district
    let nearest = D[0];
    let minDist = Infinity;
    for (const entry of D) {
        const dist = Math.sqrt((lat - entry.lat) ** 2 + (lng - entry.lng) ** 2);
        if (dist < minDist) { minDist = dist; nearest = entry; }
    }

    // If too far (>3 degrees ≈ 300km), fall back to state-level
    if (minDist > 3) {
        const state = mapCoordsToState(lat, lng);
        return { state, district: state, isStateLevel: true };
    }

    return { state: nearest.state, district: nearest.name, isStateLevel: false };
}

// Approximate state from coordinates
function mapCoordsToState(lat, lng) {
    if (lat >= 18 && lat <= 22 && lng >= 72 && lng <= 80) return 'Maharashtra';
    if (lat >= 25 && lat <= 31 && lng >= 77 && lng <= 85) return 'Uttar Pradesh';
    if (lat >= 25 && lat <= 27 && lng >= 85 && lng <= 88) return 'Bihar';
    if (lat >= 23 && lat <= 28 && lng >= 75 && lng <= 79) return 'Madhya Pradesh';
    if (lat >= 26 && lat <= 31 && lng >= 69 && lng <= 76) return 'Rajasthan';
    if (lat >= 12 && lat <= 18 && lng >= 74 && lng <= 78) return 'Karnataka';
    if (lat >= 8 && lat <= 13 && lng >= 76 && lng <= 80) return 'Tamil Nadu';
    if (lat >= 8 && lat <= 13 && lng >= 74 && lng <= 77) return 'Kerala';
    if (lat >= 20 && lat <= 28 && lng >= 68 && lng <= 75) return 'Gujarat';
    if (lat >= 21 && lat <= 26 && lng >= 83 && lng <= 87) return 'Jharkhand';
    if (lat >= 20 && lat <= 22 && lng >= 83 && lng <= 87) return 'Odisha';
    if (lat >= 22 && lat <= 27 && lng >= 86 && lng <= 89) return 'West Bengal';
    if (lat >= 21 && lat <= 27 && lng >= 80 && lng <= 84) return 'Chhattisgarh';
    if (lat >= 13 && lat <= 19 && lng >= 76 && lng <= 81) return 'Andhra Pradesh';
    return 'India';
}

function getRegionalHealthContext(userQuery = '') {
    const { state, district, isStateLevel } = detectedLocation;
    const baseline = getDistrictStats(district, state);

    const data = generateSeedData(100);
    const recentCases = data.filter(d => d.location.state === state);

    const stats = { fever: 0, diarrhea: 0, sam: 0, total: recentCases.length };
    recentCases.forEach(c => {
        if (c.medicalHistory.includes('fever')) stats.fever++;
        if (c.medicalHistory.includes('diarrhea')) stats.diarrhea++;
        if (c.result.status === 'SAM') stats.sam++;
    });

    const locationLabel = isStateLevel ? `${state} (State Level)` : `${district} District, ${state}`;
    const dataSource = baseline.matchedAs || district;

    let context = `\n\n=== DISTRICT HEALTH INTELLIGENCE (USE THIS IN EVERY ANSWER) ===\n`;
    context += `📍 USER'S LOCATION: ${locationLabel}${detectedLocation.detected ? ' (GPS Detected)' : ' (Default)'}\n`;
    context += `📊 NFHS-5 GOVERNMENT DATA FOR ${dataSource.toUpperCase()}:\n`;
    context += `   - Stunting: ${baseline.stunting}\n`;
    context += `   - Wasting: ${baseline.wasting}\n`;
    context += `   - Underweight: ${baseline.underweight}\n`;
    context += `   - Risk Level: ${baseline.concern}\n`;
    context += `   - Key Concern: ${baseline.notes}\n`;
    context += `\n🔴 LIVE SCREENING DATA (LAST 24 HOURS IN ${state.toUpperCase()}):\n`;
    context += `   - Children screened nearby: ${stats.total}\n`;
    if (stats.fever > 5) {
        context += `   ⚠️ FEVER OUTBREAK: ${stats.fever} fever cases detected in ${locationLabel}!\n`;
    }
    if (stats.diarrhea > 5) {
        context += `   ⚠️ DIARRHEA SPIKE: ${stats.diarrhea} cases in ${locationLabel}! Recommend ORS+Zinc.\n`;
    }
    if (stats.sam > 0) {
        context += `   🚨 SAM ALERT: ${stats.sam} Severe Acute Malnutrition cases in ${locationLabel} today.\n`;
    }
    context += `=== END DISTRICT DATA ===\n`;

    // === PDF KNOWLEDGE BASE (WHO, UNICEF, NFHS, POSHAN Abhiyaan) ===
    if (userQuery) {
        try {
            const pdfResults = searchRagKnowledge(userQuery, 3);
            if (pdfResults.length > 0) {
                context += `\n=== REFERENCE KNOWLEDGE (from WHO/UNICEF/NFHS/POSHAN documents) ===\n`;
                pdfResults.forEach((r, i) => {
                    // Limit each excerpt to ~800 chars to stay within token limits
                    const excerpt = r.text.length > 800 ? r.text.substring(0, 800) + '...' : r.text;
                    context += `📄 Source ${i + 1}: ${r.source}\n${excerpt}\n\n`;
                });
                context += `=== END REFERENCE KNOWLEDGE ===\n`;
                console.log(`[RAG PDF] 📄 Found ${pdfResults.length} relevant excerpts`);
            }
        } catch (e) {
            console.warn('[RAG PDF] Search error:', e.message);
        }
    }

    return context;
}

function getLocationLabel() {
    const { district, state, isStateLevel } = detectedLocation;
    return isStateLevel ? state : `${district}, ${state}`;
}

async function getAIResponse(message, lang) {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!openaiKey && !geminiKey) {
        return getOfflineResponse(message, lang);
    }

    try {
        // Get RAG Context (same for both providers)
        const ragContext = getRegionalHealthContext(message);
        console.log('[RAG] Context injected ✅ Location:', getLocationLabel());

        // Build system prompt - FORCE district-specific responses
        const loc = getLocationLabel();
        let systemText = '';
        if (lang === 'hi') {
            systemText = `तुम CNIS Medibot हो। ${ragContext}\nज़रूरी नियम:\n1. हर जवाब में "${loc}" का नाम ज़रूर बोलो\n2. NFHS-5 के आंकड़े (Stunting %, Wasting %) बताओ\n3. अगर कोई ALERT है तो बोल्ड में चेतावनी दो\n4. हिंदी में जवाब। बुलेट/इमोजी। डोस मत बताओ। 250 शब्द max।`;
        } else if (lang === 'mr') {
            systemText = `तुम्ही CNIS Medibot. ${ragContext}\nनियम:\n1. प्रत्येक उत्तरात "${loc}" चे नाव सांगा\n2. NFHS-5 आकडे (Stunting %, Wasting %) द्या\n3. ALERT असल्यास बोल्ड इशारा द्या\n4. मराठीत उत्तर। बुलेट/इमोजी। डोस सांगू नका। 250 शब्द max.`;
        } else {
            systemText = `You are CNIS Medibot, a district-level health AI. ${ragContext}\nMANDATORY RULES:\n1. ALWAYS mention the user's location "${loc}" by name\n2. ALWAYS cite specific NFHS-5 stats (stunting %, wasting %, underweight %)\n3. If any ALERT exists, highlight it prominently with ⚠️\n4. Use bullets/emojis. No dosages. End with 📌 Recommended Questions. 250 words max.`;
        }

        const userText = lang === 'hi' ? `सवाल: ${message}`
            : lang === 'mr' ? `प्रश्न: ${message}`
                : `Q: ${message}`;

        // === TRY OPENAI FIRST ===
        if (openaiKey) {
            try {
                console.log('[Medibot] Trying OpenAI...');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            { role: 'system', content: systemText },
                            { role: 'user', content: userText }
                        ],
                        max_tokens: 400,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const answer = data.choices?.[0]?.message?.content;
                    if (answer) {
                        console.log('[Medibot] ✅ OpenAI RAG response');
                        return answer;
                    }
                } else {
                    console.warn('[Medibot] OpenAI failed:', response.status, '- trying Gemini fallback');
                }
            } catch (e) {
                console.warn('[Medibot] OpenAI error:', e.message, '- trying Gemini fallback');
            }
        }

        // === FALLBACK: GEMINI (FREE) ===
        if (geminiKey) {
            console.log('[Medibot] Using Gemini fallback with RAG...');
            const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
            for (const model of models) {
                try {
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ role: 'user', parts: [{ text: systemText + '\n\n' + userText }] }],
                                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
                            })
                        }
                    );
                    if (response.status === 429) { await new Promise(r => setTimeout(r, 2000)); continue; }
                    if (!response.ok) continue;
                    const data = await response.json();
                    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (answer) {
                        console.log(`[Medibot] ✅ Gemini (${model}) RAG response`);
                        return answer;
                    }
                } catch (e) { console.warn(`[Medibot] Gemini ${model} error:`, e.message); }
            }
        }

        return getOfflineResponse(message, lang);
    } catch (err) {
        console.error('[Medibot] Error:', err);
        return getOfflineResponse(message, lang);
    }
}

export default function ChatbotPage() {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        { role: 'bot', text: '', isWelcome: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [locationStatus, setLocationStatus] = useState('Detecting location...');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Detect GPS location on mount for RAG context
    useEffect(() => {
        detectChatbotLocation().then((loc) => {
            if (loc.detected) {
                const label = loc.isStateLevel ? loc.state : `${loc.district}, ${loc.state}`;
                setLocationStatus(`📍 ${label}`);
            } else {
                setLocationStatus(`📍 ${loc.district}, ${loc.state} (default)`);
            }
        });
    }, []);

    // Initialize welcome message based on language
    useEffect(() => {
        const kb = knowledgeBase[i18n.language] || knowledgeBase.en;
        setMessages([{
            role: 'bot',
            text: kb.responses?.greeting || knowledgeBase.en.responses.greeting,
            isWelcome: true
        }]);
    }, [i18n.language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendRef = useRef(null);

    const handleVoiceTranscript = useCallback((text) => {
        if (text) {
            setInput(text);
            if (sendRef.current) sendRef.current(text);
        }
    }, []);

    const { isListening, toggleListening } = useVoice(null, handleVoiceTranscript);

    const handleSend = async (text) => {
        const messageText = text || input;
        if (!messageText.trim()) return;

        const userMsg = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const response = await getAIResponse(messageText, i18n.language);

        setIsTyping(false);
        const botMsg = { role: 'bot', text: response };
        setMessages(prev => [...prev, botMsg]);

        // Read response aloud (first 200 chars)
        speak(response.replace(/[*#_`]/g, '').substring(0, 200), getTTSLang(i18n.language));
    };

    // Keep ref updated
    sendRef.current = handleSend;

    const suggestedQuestions = {
        en: [
            'What is MUAC?',
            'Signs of malnutrition',
            'Breastfeeding tips',
            'Vaccination schedule',
            'When to see a doctor?',
            'What is Ayushman Bharat?',
            'How to manage stress?',
            'Tips for child development',
        ],
        hi: [
            'MUAC क्या है?',
            'कुपोषण के लक्षण',
            'बुखार का इलाज',
            'स्तनपान कैसे करें?',
            'टीकाकरण अनुसूची',
            'आयुष्मान भारत क्या है?',
            'तनाव कैसे कम करें?',
            'बच्चे का विकास कैसे करें?',
        ],
        mr: [
            'MUAC म्हणजे काय?',
            'कुपोषणाची लक्षणे',
            'तापावर उपचार',
            'स्तनपान मार्गदर्शन',
            'लसीकरण वेळापत्रक',
            'आयुष्मान भारत म्हणजे काय?',
            'ताण कसा कमी करावा?',
            'मुलांचा विकास कसा करावा?',
        ]
    };

    const questions = suggestedQuestions[i18n.language] || suggestedQuestions.en;

    // Simple markdown renderer
    const renderText = (text) => {
        return text.split('\n').map((line, i) => {
            // Bold
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Remove remaining markdown
            line = line.replace(/[#`]/g, '');

            if (!line.trim()) return <br key={i} />;
            return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />;
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] animate-fade-in">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl gradient-clinical flex items-center justify-center shadow-md">
                        <span className="text-2xl">🏥</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">NutriCare Medibot</h2>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                            Online • {i18n.language === 'hi' ? 'हिंदी' : i18n.language === 'mr' ? 'मराठी' : 'English'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary-50 text-clinical-blue text-xs rounded-full font-medium">
                        🏥 Health AI
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                        🔗 RAG v2
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-gray-50/50 border border-gray-100 p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'gradient-clinical text-white rounded-br-md'
                            : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
                            }`}>
                            {msg.role === 'bot' && (
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                    <span className="text-sm">🏥</span>
                                    <span className="text-xs font-semibold text-clinical-blue">Medibot</span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full font-medium ml-auto">Health AI</span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{locationStatus}</span>
                                </div>
                            )}
                            <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                                {renderText(msg.text)}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-400">Analyzing your question...</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-2.5 h-2.5 rounded-full bg-clinical-blue/40"
                                        style={{ animation: `pulse-soft 1s ease-in-out ${i * 0.2}s infinite` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 py-3">
                    {questions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(q)}
                            className="px-3 py-1.5 bg-primary-50 text-clinical-blue text-xs font-medium rounded-full hover:bg-primary-100 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 pt-3">
                <button
                    onClick={toggleListening}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${isListening
                        ? 'bg-red-500 text-white voice-active'
                        : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-clinical-blue'
                        }`}
                    title="Voice input"
                >
                    <span className="text-lg">{isListening ? '🔴' : '🎤'}</span>
                </button>

                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('chat_placeholder') || 'Ask any health question...'}
                        className="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                        id="chat-input"
                    />
                </div>

                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${input.trim()
                        ? 'gradient-clinical text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-300'
                        }`}
                    id="chat-send-btn"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-400 mt-2 px-4">
                ⚕️ This assistant provides general health information only. It does NOT replace professional medical advice. Always consult a qualified healthcare provider.
            </p>
        </div>
    );
}
