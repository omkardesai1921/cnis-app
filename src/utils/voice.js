/**
 * Voice UI Utility - Web Speech API Integration
 * Supports English, Hindi, and Marathi commands & field inputs
 */

// ===== FIELD NAME MAPPINGS (multilingual) =====
// Maps spoken field names to form field keys
const fieldNameMappings = {
    // English
    'name': 'childName', 'child name': 'childName', 'baby name': 'childName',
    'age': 'ageMonths', 'child age': 'ageMonths', 'age in months': 'ageMonths', 'months': 'ageMonths',
    'height': 'heightCm', 'child height': 'heightCm',
    'weight': 'weightKg', 'child weight': 'weightKg',
    'muac': 'muacCm', 'arm': 'muacCm', 'mid arm': 'muacCm', 'arm circumference': 'muacCm',
    'head': 'headCirc', 'head circumference': 'headCirc',
    'gender': 'gender', 'sex': 'gender',

    // Hindi
    'नाम': 'childName', 'बच्चे का नाम': 'childName', 'naam': 'childName',
    'उम्र': 'ageMonths', 'आयु': 'ageMonths', 'umar': 'ageMonths', 'umra': 'ageMonths',
    'ऊंचाई': 'heightCm', 'लंबाई': 'heightCm', 'lambai': 'heightCm',
    'वजन': 'weightKg', 'भार': 'weightKg', 'wajan': 'weightKg', 'vazan': 'weightKg',
    'बांह': 'muacCm', 'बाहू': 'muacCm', 'baahu': 'muacCm',
    'सिर': 'headCirc', 'sir': 'headCirc',
    'लिंग': 'gender', 'ling': 'gender',

    // Marathi
    'नाव': 'childName', 'मुलाचे नाव': 'childName', 'naav': 'childName',
    'वय': 'ageMonths', 'vay': 'ageMonths',
    'उंची': 'heightCm', 'unchi': 'heightCm',
    'वजन': 'weightKg', 'vazan': 'weightKg',
    'दंड': 'muacCm', 'बाहू': 'muacCm', 'dand': 'muacCm',
    'डोके': 'headCirc', 'doke': 'headCirc',
};

// ===== VOICE COMMAND MAPPINGS (multilingual) =====
const commandMappings = {
    // === ENGLISH COMMANDS ===
    'start screening': { action: 'navigate', target: '/screening' },
    'new screening': { action: 'navigate', target: '/screening' },
    'screening': { action: 'navigate', target: '/screening' },
    'save': { action: 'submit' },
    'save data': { action: 'submit' },
    'submit': { action: 'submit' },
    'help': { action: 'navigate', target: '/chatbot' },
    'go home': { action: 'navigate', target: '/' },
    'home': { action: 'navigate', target: '/' },
    'reports': { action: 'navigate', target: '/reports' },
    'open chatbot': { action: 'navigate', target: '/chatbot' },
    'chatbot': { action: 'navigate', target: '/chatbot' },
    'boy': { action: 'setGender', value: 'male' },
    'male': { action: 'setGender', value: 'male' },
    'girl': { action: 'setGender', value: 'female' },
    'female': { action: 'setGender', value: 'female' },
    'take photo': { action: 'camera' },
    'capture': { action: 'camera' },
    'open camera': { action: 'camera' },

    // === HINDI COMMANDS ===
    'जांच शुरू करो': { action: 'navigate', target: '/screening' },
    'जाँच शुरू करो': { action: 'navigate', target: '/screening' },
    'shuru karo': { action: 'navigate', target: '/screening' },
    'jaanch shuru karo': { action: 'navigate', target: '/screening' },
    'शुरू करो': { action: 'navigate', target: '/screening' },
    'नई जाँच': { action: 'navigate', target: '/screening' },
    'सेव करो': { action: 'submit' },
    'save karo': { action: 'submit' },
    'जमा करो': { action: 'submit' },
    'data save karo': { action: 'submit' },
    'डेटा सेव करो': { action: 'submit' },
    'मदद': { action: 'navigate', target: '/chatbot' },
    'madad': { action: 'navigate', target: '/chatbot' },
    'सहायता': { action: 'navigate', target: '/chatbot' },
    'घर': { action: 'navigate', target: '/' },
    'ghar': { action: 'navigate', target: '/' },
    'रिपोर्ट': { action: 'navigate', target: '/reports' },
    'report': { action: 'navigate', target: '/reports' },
    'लड़का': { action: 'setGender', value: 'male' },
    'ladka': { action: 'setGender', value: 'male' },
    'लड़की': { action: 'setGender', value: 'female' },
    'ladki': { action: 'setGender', value: 'female' },
    'फोटो लो': { action: 'camera' },
    'photo lo': { action: 'camera' },
    'कैमरा खोलो': { action: 'camera' },
    'camera kholo': { action: 'camera' },

    // === MARATHI COMMANDS ===
    'तपासणी सुरू करा': { action: 'navigate', target: '/screening' },
    'tapasni suru kara': { action: 'navigate', target: '/screening' },
    'सुरू करा': { action: 'navigate', target: '/screening' },
    'suru kara': { action: 'navigate', target: '/screening' },
    'नवीन तपासणी': { action: 'navigate', target: '/screening' },
    'सेव्ह करा': { action: 'submit' },
    'save kara': { action: 'submit' },
    'जतन करा': { action: 'submit' },
    'data save kara': { action: 'submit' },
    'डेटा सेव्ह करा': { action: 'submit' },
    'मदत करा': { action: 'navigate', target: '/chatbot' },
    'madat kara': { action: 'navigate', target: '/chatbot' },
    'मदत': { action: 'navigate', target: '/chatbot' },
    'मुख्यपृष्ठ': { action: 'navigate', target: '/' },
    'mukhyaprushtha': { action: 'navigate', target: '/' },
    'अहवाल': { action: 'navigate', target: '/reports' },
    'मुलगा': { action: 'setGender', value: 'male' },
    'mulga': { action: 'setGender', value: 'male' },
    'मुलगी': { action: 'setGender', value: 'female' },
    'mulgi': { action: 'setGender', value: 'female' },
    'फोटो घ्या': { action: 'camera' },
    'photo ghya': { action: 'camera' },
    'कॅमेरा उघडा': { action: 'camera' },
};

// ===== NUMBER MAPPINGS (multilingual) =====
const numberMappings = {
    // English
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
    'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
    'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
    'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
    'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'twenty one': 21,
    'twenty two': 22, 'twenty three': 23, 'twenty four': 24, 'twenty five': 25,
    'thirty': 30, 'thirty five': 35, 'thirty six': 36,
    'forty': 40, 'forty eight': 48, 'fifty': 50, 'sixty': 60,

    // Hindi
    'शून्य': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4,
    'पाँच': 5, 'पांच': 5, 'छह': 6, 'छे': 6, 'सात': 7, 'आठ': 8, 'नौ': 9,
    'दस': 10, 'ग्यारह': 11, 'बारह': 12, 'तेरह': 13,
    'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16, 'सत्रह': 17,
    'अठारह': 18, 'उन्नीस': 19, 'बीस': 20, 'इक्कीस': 21,
    'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25,
    'छब्बीस': 26, 'सत्ताईस': 27, 'अट्ठाईस': 28, 'उनतीस': 29,
    'तीस': 30, 'चालीस': 40, 'पचास': 50, 'साठ': 60,
    'shunya': 0, 'ek': 1, 'do': 2, 'teen': 3, 'char': 4,
    'paanch': 5, 'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9,
    'das': 10, 'gyarah': 11, 'barah': 12, 'terah': 13,
    'chaudah': 14, 'pandrah': 15, 'solah': 16, 'satrah': 17,
    'athaarah': 18, 'unees': 19, 'bees': 20,
    'tees': 30, 'chalis': 40, 'pachaas': 50,

    // Marathi
    'शून्य': 0, 'एक': 1, 'दोन': 2, 'तीन': 3, 'चार': 4,
    'पाच': 5, 'सहा': 6, 'सात': 7, 'आठ': 8, 'नऊ': 9,
    'दहा': 10, 'अकरा': 11, 'बारा': 12, 'तेरा': 13,
    'चौदा': 14, 'पंधरा': 15, 'सोळा': 16, 'सतरा': 17,
    'अठरा': 18, 'एकोणीस': 19, 'वीस': 20,
    'तीस': 30, 'चाळीस': 40, 'पन्नास': 50,
    'don': 2, 'tin': 3, 'chaar': 4,
    'paach': 5, 'saha': 6,
};

// Unit mappings for voice data entry
const unitMappings = {
    'kilos': 'kg', 'kilo': 'kg', 'kilogram': 'kg', 'kilograms': 'kg', 'kg': 'kg',
    'centimeters': 'cm', 'centimeter': 'cm', 'cm': 'cm', 'senti': 'cm',
    'months': 'months', 'month': 'months', 'महीने': 'months', 'महीना': 'months',
    'mahine': 'months', 'mahina': 'months',
    'years': 'years', 'year': 'years', 'साल': 'years', 'वर्ष': 'years',
    'saal': 'years', 'varsha': 'years', 'वर्षे': 'years',
    'किलो': 'kg', 'किलोग्राम': 'kg',
    'सेंटीमीटर': 'cm', 'सेमी': 'cm',
};

// ===== FIELD DETECTION FROM SPOKEN TEXT =====
// Detects "field value" patterns in spoken text
// e.g., "name is Rohit", "naam Rahul", "weight 10", "उम्र 24 महीने"

/**
 * Try to extract a field assignment from spoken text
 * Returns { field, value } or null
 */
export function parseFieldAssignment(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    // Try each known field name
    for (const [spokenName, fieldKey] of Object.entries(fieldNameMappings)) {
        // Check patterns: "fieldName is value", "fieldName value", "fieldName: value"
        const patterns = [
            new RegExp(`${escapeRegex(spokenName)}\\s+(?:is|equals|=|:)?\\s*(.+)`, 'i'),
            new RegExp(`(?:set|enter|type|fill|put|लिखो|भरो|लिहा|भरा)\\s+${escapeRegex(spokenName)}\\s+(?:to|as|=)?\\s*(.+)`, 'i'),
        ];

        for (const pattern of patterns) {
            const match = lower.match(pattern);
            if (match && match[1]) {
                const rawValue = match[1].trim();

                // For numeric fields, parse the number
                if (['ageMonths', 'heightCm', 'weightKg', 'muacCm', 'headCirc'].includes(fieldKey)) {
                    const parsed = parseSpokenNumber(rawValue);
                    if (parsed) {
                        // Handle "age 2 years" → convert to months
                        let val = parsed.value;
                        if (fieldKey === 'ageMonths' && parsed.unit === 'years') {
                            val = val * 12;
                        }
                        return { field: fieldKey, value: String(val) };
                    }
                }

                // For gender field
                if (fieldKey === 'gender') {
                    const genderVal = parseGender(rawValue);
                    if (genderVal) return { field: 'gender', value: genderVal };
                }

                // For text fields (like name)
                if (fieldKey === 'childName') {
                    // Capitalize first letter
                    const name = rawValue.charAt(0).toUpperCase() + rawValue.slice(1);
                    return { field: fieldKey, value: name };
                }

                return { field: fieldKey, value: rawValue };
            }
        }
    }

    return null;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseGender(text) {
    const l = text.toLowerCase();
    if (['male', 'boy', 'लड़का', 'ladka', 'मुलगा', 'mulga'].some(w => l.includes(w))) return 'male';
    if (['female', 'girl', 'लड़की', 'ladki', 'मुलगी', 'mulgi'].some(w => l.includes(w))) return 'female';
    return null;
}

/**
 * Parse spoken number from text
 * e.g., "ten kilos" -> { value: 10, unit: 'kg' }
 * e.g., "बारह" -> { value: 12, unit: null }
 * e.g., "10.5 cm" -> { value: 10.5, unit: 'cm' }
 */
export function parseSpokenNumber(text) {
    if (!text) return null;

    const lower = text.toLowerCase().trim();

    // Try direct number parse first (e.g., "10", "10.5", "10.5 cm")
    const directMatch = lower.match(/(\d+\.?\d*)\s*(kilos?|kg|centimeters?|cm|months?|years?|saal|varsha|mahine?|senti|किलो|सेमी|महीने?|साल|वर्ष|वर्षे)?/i);
    if (directMatch) {
        const value = parseFloat(directMatch[1]);
        const rawUnit = directMatch[2]?.toLowerCase();
        const unit = rawUnit ? (unitMappings[rawUnit] || rawUnit) : null;
        return { value, unit };
    }

    // Try word-based number parsing (e.g., "twelve", "बारह", "बीस")
    // First check multi-word numbers
    for (const [word, num] of Object.entries(numberMappings)) {
        if (lower.includes(word)) {
            // Find unit after the number word
            let unit = null;
            const afterNum = lower.substring(lower.indexOf(word) + word.length).trim();
            for (const [u, mapped] of Object.entries(unitMappings)) {
                if (afterNum.includes(u)) {
                    unit = mapped;
                    break;
                }
            }
            return { value: num, unit };
        }
    }

    // Just a plain number?
    const plainNum = parseFloat(lower);
    if (!isNaN(plainNum)) {
        return { value: plainNum, unit: null };
    }

    return null;
}

/**
 * Match spoken text to a command
 * Supports English, Hindi, Marathi
 */
export function matchCommand(spokenText) {
    if (!spokenText) return null;

    const lower = spokenText.toLowerCase().trim();

    // Exact match
    if (commandMappings[lower]) {
        return commandMappings[lower];
    }

    // Check if spoken text contains a command keyword
    for (const [cmd, action] of Object.entries(commandMappings)) {
        if (lower.includes(cmd)) {
            return action;
        }
    }

    // Check for field assignment pattern
    const fieldAssignment = parseFieldAssignment(spokenText);
    if (fieldAssignment) {
        return { action: 'setField', ...fieldAssignment };
    }

    return null;
}

/**
 * Initialize Speech Recognition
 */
export function createSpeechRecognition(lang = 'en-IN') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported in this browser');
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 3;

    return recognition;
}

/**
 * Get language code for Speech Recognition
 */
export function getRecognitionLang(appLang) {
    const langMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN'
    };
    return langMap[appLang] || 'en-IN';
}

/**
 * Text-to-Speech utility
 */
export function speak(text, lang = 'en-IN') {
    if (!window.speechSynthesis) {
        console.warn('Speech Synthesis not supported');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
}

/**
 * Get TTS language from app language
 */
export function getTTSLang(appLang) {
    const langMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN'
    };
    return langMap[appLang] || 'en-IN';
}

/**
 * Get voice prompt text for a field in current language
 */
export function getVoicePrompt(fieldName, lang = 'en') {
    const prompts = {
        en: {
            childName: 'Say the child\'s name',
            ageMonths: 'Say the age in months',
            heightCm: 'Say the height in centimeters',
            weightKg: 'Say the weight in kilograms',
            muacCm: 'Say the MUAC in centimeters',
            headCirc: 'Say the head circumference',
        },
        hi: {
            childName: 'बच्चे का नाम बोलें',
            ageMonths: 'महीनों में उम्र बोलें',
            heightCm: 'सेंटीमीटर में ऊंचाई बोलें',
            weightKg: 'किलोग्राम में वजन बोलें',
            muacCm: 'सेंटीमीटर में बांह की माप बोलें',
            headCirc: 'सिर की माप बोलें',
        },
        mr: {
            childName: 'मुलाचे नाव सांगा',
            ageMonths: 'महिन्यांमध्ये वय सांगा',
            heightCm: 'सेंटीमीटरमध्ये उंची सांगा',
            weightKg: 'किलोग्राममध्ये वजन सांगा',
            muacCm: 'सेंटीमीटरमध्ये बाहूची माप सांगा',
            headCirc: 'डोक्याची माप सांगा',
        }
    };

    return prompts[lang]?.[fieldName] || prompts.en[fieldName] || `Say the ${fieldName}`;
}
