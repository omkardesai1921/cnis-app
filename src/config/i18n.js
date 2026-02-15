import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'Climate-Nutrition Intelligence System',
            tagline: 'Smart nutrition screening',
            login: 'Sign in with Google',
            logout: 'Logout',
            home: 'Home',
            screening: 'Screening',
            reports: 'Reports',
            chatbot: 'Medibot',
            profile: 'Profile',
            settings: 'Settings',

            // Role Selection
            select_role: 'Select Your Role',
            asha_worker: 'ASHA Worker',
            parent: 'Parent',
            other: 'Other',
            role_asha_desc: 'Community health worker conducting screenings',
            role_parent_desc: 'Parent or caregiver of a child',
            role_other_desc: 'Researcher, doctor, or other professional',

            // Screening Form
            child_name: 'Child Name',
            child_age: 'Age (months)',
            child_gender: 'Gender',
            male: 'Male',
            female: 'Female',
            height: 'Height (cm)',
            weight: 'Weight (kg)',
            muac: 'MUAC (cm)',
            head_circ: 'Head Circumference (cm)',
            medical_history: 'Medical History',
            diarrhea: 'Diarrhea',
            fever: 'Fever',
            cough: 'Cough',
            edema: 'Edema',
            lethargy: 'Severe Lethargy',
            upload_photo: 'Upload Child Photo',
            start_screening: 'Start Screening',
            save_data: 'Save Data',
            submit: 'Submit',

            // Results
            result: 'Result',
            status: 'Status',
            sam: 'Severe Acute Malnutrition (SAM)',
            mam: 'Moderate Acute Malnutrition (MAM)',
            normal: 'Normal',
            red_zone: 'Red Zone - Immediate Action Required',
            orange_zone: 'Orange Zone - Monitor Closely',
            green_zone: 'Green Zone - Healthy',

            // Diet
            diet_recommendations: 'Diet Recommendations',
            location_detected: 'Location Detected',
            season_detected: 'Season Detected',
            summer: 'Summer',
            winter: 'Winter',
            monsoon: 'Monsoon',
            autumn: 'Autumn',
            local_foods: 'Recommended Local Foods',

            // Warnings
            danger_signs: 'Danger Signs',
            warning_edema: '⚠️ Bilateral pitting edema detected',
            warning_lethargy: '⚠️ Severe lethargy - seek immediate medical attention',
            warning_muac: '⚠️ MUAC below critical threshold',
            seek_medical: 'Please visit the nearest health center immediately',

            // Voice
            voice_listening: 'Listening...',
            voice_command: 'Say a command',
            voice_start: 'Start Screening',
            voice_save: 'Save Data',
            voice_help: 'Help',

            // Chatbot
            chat_placeholder: 'Ask about child nutrition...',
            chat_welcome: 'Hello! I am the CNIS Nutrition Assistant. How can I help you today?',
            chat_send: 'Send',

            // Reports
            total_screenings: 'Total Screenings',
            sam_cases: 'SAM Cases',
            mam_cases: 'MAM Cases',
            normal_cases: 'Normal Cases',
            recent_reports: 'Recent Reports',
            no_reports: 'No reports yet. Start screening to see results.',

            // Photo validation
            invalid_photo: 'Invalid Photo: Please upload a photo of the child.',
            photo_validated: 'Photo validated successfully.',

            // General
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            back: 'Back',
            next: 'Next',
            language: 'Language',
        }
    },
    hi: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'जलवायु-पोषण बुद्धिमत्ता प्रणाली',
            tagline: 'स्मार्ट पोषण जाँच',
            login: 'Google से साइन इन करें',
            logout: 'लॉग आउट',
            home: 'होम',
            screening: 'जाँच',
            reports: 'रिपोर्ट',
            chatbot: 'मेडीबॉट',
            profile: 'प्रोफ़ाइल',
            settings: 'सेटिंग्स',

            select_role: 'अपनी भूमिका चुनें',
            asha_worker: 'आशा कार्यकर्ता',
            parent: 'अभिभावक',
            other: 'अन्य',
            role_asha_desc: 'सामुदायिक स्वास्थ्य कार्यकर्ता जाँच कर रही हैं',
            role_parent_desc: 'बच्चे के माता-पिता या देखभालकर्ता',
            role_other_desc: 'शोधकर्ता, डॉक्टर, या अन्य पेशेवर',

            child_name: 'बच्चे का नाम',
            child_age: 'आयु (महीने)',
            child_gender: 'लिंग',
            male: 'लड़का',
            female: 'लड़की',
            height: 'ऊंचाई (सेमी)',
            weight: 'वजन (किलो)',
            muac: 'MUAC (सेमी)',
            head_circ: 'सिर की परिधि (सेमी)',
            medical_history: 'चिकित्सा इतिहास',
            diarrhea: 'दस्त',
            fever: 'बुखार',
            cough: 'खांसी',
            edema: 'सूजन',
            lethargy: 'गंभीर सुस्ती',
            upload_photo: 'बच्चे की तस्वीर अपलोड करें',
            start_screening: 'जाँच शुरू करें',
            save_data: 'डेटा सेव करें',
            submit: 'जमा करें',

            result: 'परिणाम',
            status: 'स्थिति',
            sam: 'गंभीर तीव्र कुपोषण (SAM)',
            mam: 'मध्यम तीव्र कुपोषण (MAM)',
            normal: 'सामान्य',
            red_zone: 'लाल क्षेत्र - तुरंत कार्रवाई आवश्यक',
            orange_zone: 'नारंगी क्षेत्र - ध्यान से निगरानी करें',
            green_zone: 'हरा क्षेत्र - स्वस्थ',

            diet_recommendations: 'आहार सिफारिशें',
            location_detected: 'स्थान पता चला',
            season_detected: 'मौसम पता चला',
            summer: 'गर्मी',
            winter: 'सर्दी',
            monsoon: 'मानसून',
            autumn: 'पतझड़',
            local_foods: 'अनुशंसित स्थानीय खाद्य पदार्थ',

            danger_signs: 'खतरे के संकेत',
            warning_edema: '⚠️ द्विपक्षीय पिटिंग एडिमा पाई गई',
            warning_lethargy: '⚠️ गंभीर सुस्ती - तुरंत चिकित्सा सहायता लें',
            warning_muac: '⚠️ MUAC गंभीर सीमा से नीचे',
            seek_medical: 'कृपया तुरंत निकटतम स्वास्थ्य केंद्र पर जाएं',

            voice_listening: 'सुन रहे हैं...',
            voice_command: 'एक आदेश कहें',
            voice_start: 'जाँच शुरू करें',
            voice_save: 'डेटा सेव करें',
            voice_help: 'मदद',

            chat_placeholder: 'बच्चे के पोषण के बारे में पूछें...',
            chat_welcome: 'नमस्ते! मैं CNIS पोषण सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
            chat_send: 'भेजें',

            total_screenings: 'कुल जाँच',
            sam_cases: 'SAM मामले',
            mam_cases: 'MAM मामले',
            normal_cases: 'सामान्य मामले',
            recent_reports: 'हाल की रिपोर्ट',
            no_reports: 'अभी तक कोई रिपोर्ट नहीं। परिणाम देखने के लिए जाँच शुरू करें।',

            invalid_photo: 'अमान्य फोटो: कृपया बच्चे की फोटो अपलोड करें।',
            photo_validated: 'फोटो सफलतापूर्वक मान्य।',

            loading: 'लोड हो रहा है...',
            error: 'त्रुटि',
            success: 'सफल',
            cancel: 'रद्द करें',
            save: 'सेव करें',
            delete: 'हटाएं',
            back: 'वापस',
            next: 'आगे',
            language: 'भाषा',
        }
    },
    mr: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'हवामान-पोषण बुद्धिमत्ता प्रणाली',
            tagline: 'स्मार्ट पोषण तपासणी',
            login: 'Google ने साइन इन करा',
            logout: 'लॉग आउट',
            home: 'मुख्यपृष्ठ',
            screening: 'तपासणी',
            reports: 'अहवाल',
            chatbot: 'मेडीबॉट',
            profile: 'प्रोफाइल',
            settings: 'सेटिंग्ज',

            select_role: 'तुमची भूमिका निवडा',
            asha_worker: 'आशा कार्यकर्ती',
            parent: 'पालक',
            other: 'इतर',
            role_asha_desc: 'तपासणी करणारी सामुदायिक आरोग्य कार्यकर्ती',
            role_parent_desc: 'मुलाचे पालक किंवा काळजीवाहक',
            role_other_desc: 'संशोधक, डॉक्टर, किंवा इतर व्यावसायिक',

            child_name: 'मुलाचे नाव',
            child_age: 'वय (महिने)',
            child_gender: 'लिंग',
            male: 'मुलगा',
            female: 'मुलगी',
            height: 'उंची (सेमी)',
            weight: 'वजन (किलो)',
            muac: 'MUAC (सेमी)',
            head_circ: 'डोक्याचा घेर (सेमी)',
            medical_history: 'वैद्यकीय इतिहास',
            diarrhea: 'जुलाब',
            fever: 'ताप',
            cough: 'खोकला',
            edema: 'सूज',
            lethargy: 'तीव्र सुस्ती',
            upload_photo: 'मुलाचा फोटो अपलोड करा',
            start_screening: 'तपासणी सुरू करा',
            save_data: 'डेटा सेव्ह करा',
            submit: 'सबमिट करा',

            result: 'निकाल',
            status: 'स्थिती',
            sam: 'तीव्र गंभीर कुपोषण (SAM)',
            mam: 'मध्यम तीव्र कुपोषण (MAM)',
            normal: 'सामान्य',
            red_zone: 'लाल क्षेत्र - तात्काळ कारवाई आवश्यक',
            orange_zone: 'नारंगी क्षेत्र - बारकाईने निरीक्षण करा',
            green_zone: 'हिरवा क्षेत्र - निरोगी',

            diet_recommendations: 'आहार शिफारसी',
            location_detected: 'स्थान आढळले',
            season_detected: 'ऋतू आढळला',
            summer: 'उन्हाळा',
            winter: 'हिवाळा',
            monsoon: 'पावसाळा',
            autumn: 'शरद ऋतू',
            local_foods: 'शिफारस केलेले स्थानिक अन्न',

            danger_signs: 'धोक्याची चिन्हे',
            warning_edema: '⚠️ द्विपक्षीय पिटिंग एडिमा आढळली',
            warning_lethargy: '⚠️ तीव्र सुस्ती - तात्काळ वैद्यकीय मदत घ्या',
            warning_muac: '⚠️ MUAC गंभीर मर्यादेखाली',
            seek_medical: 'कृपया तात्काळ जवळच्या आरोग्य केंद्राला भेट द्या',

            voice_listening: 'ऐकत आहे...',
            voice_command: 'एक आदेश सांगा',
            voice_start: 'तपासणी सुरू करा',
            voice_save: 'डेटा सेव्ह करा',
            voice_help: 'मदत',

            chat_placeholder: 'मुलाच्या पोषणाबद्दल विचारा...',
            chat_welcome: 'नमस्कार! मी CNIS पोषण सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
            chat_send: 'पाठवा',

            total_screenings: 'एकूण तपासण्या',
            sam_cases: 'SAM प्रकरणे',
            mam_cases: 'MAM प्रकरणे',
            normal_cases: 'सामान्य प्रकरणे',
            recent_reports: 'अलीकडील अहवाल',
            no_reports: 'अजून कोणतेही अहवाल नाहीत. निकाल पाहण्यासाठी तपासणी सुरू करा.',

            invalid_photo: 'अवैध फोटो: कृपया मुलाचा फोटो अपलोड करा.',
            photo_validated: 'फोटो यशस्वीरित्या प्रमाणित.',

            loading: 'लोड होत आहे...',
            error: 'त्रुटी',
            success: 'यशस्वी',
            cancel: 'रद्द करा',
            save: 'सेव्ह करा',
            delete: 'हटवा',
            back: 'मागे',
            next: 'पुढे',
            language: 'भाषा',
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('cnis_language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Persist language changes
i18n.on('languageChanged', (lang) => {
    localStorage.setItem('cnis_language', lang);
    console.log('[i18n] Language changed to:', lang);
});

export default i18n;
