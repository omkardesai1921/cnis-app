import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../hooks/useVoice';
import { performScreening } from '../utils/screening';
import { getDietRecommendations, getDangerSigns, detectLocation, detectSeason } from '../utils/diet';
import { validateChildPhoto } from '../utils/imageGuardrail';
import { speak, getTTSLang, parseSpokenNumber, getVoicePrompt } from '../utils/voice';

const medicalConditions = ['diarrhea', 'fever', 'cough', 'edema', 'lethargy'];

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function ScreeningPage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        childName: '',
        ageMonths: '',
        gender: 'female',
        heightCm: '',
        weightKg: '',
        muacCm: '',
        headCirc: '',
        medicalHistory: [],
        photo: null,
    });

    const [result, setResult] = useState(null);
    const [dietInfo, setDietInfo] = useState(null);
    const [dangerSigns, setDangerSigns] = useState([]);
    const [locationInfo, setLocationInfo] = useState({ state: '', detected: false });
    const [season, setSeason] = useState(detectSeason());
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoValidation, setPhotoValidation] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeVoiceField, setActiveVoiceField] = useState(null);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const activeFieldRef = useRef(null);

    // Keep ref in sync
    useEffect(() => {
        activeFieldRef.current = activeVoiceField;
    }, [activeVoiceField]);

    // Try auto-detect location on mount
    useEffect(() => {
        detectLocation().then(loc => {
            setLocationInfo(loc);
        });
    }, []);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // ===== VOICE HANDLERS =====

    // Handles all voice commands: navigate, submit, setField, setGender, camera
    const handleVoiceCommand = useCallback((command) => {
        if (!command) return;
        console.log('[ScreeningPage] Voice command:', command);

        switch (command.action) {
            case 'submit':
                handleSubmit();
                setVoiceStatus('✅ Submitting...');
                break;
            case 'setField':
                // Direct field assignment from voice (e.g., "name Rohit", "weight 10")
                if (command.field && command.value !== undefined) {
                    setFormData(prev => ({ ...prev, [command.field]: command.value }));
                    const fieldLabel = command.field === 'childName' ? 'Name'
                        : command.field === 'ageMonths' ? 'Age'
                            : command.field === 'heightCm' ? 'Height'
                                : command.field === 'weightKg' ? 'Weight'
                                    : command.field === 'muacCm' ? 'MUAC'
                                        : command.field === 'headCirc' ? 'Head'
                                            : command.field;
                    setVoiceStatus(`✅ ${fieldLabel}: ${command.value}`);
                    setActiveVoiceField(null);
                }
                break;
            case 'setGender':
                if (command.value) {
                    setFormData(prev => ({ ...prev, gender: command.value }));
                    setVoiceStatus(`✅ Gender: ${command.value}`);
                }
                break;
            case 'camera':
                startCamera();
                setVoiceStatus('📸 Opening camera...');
                break;
            case 'navigate':
                // Navigation handled by parent if needed
                break;
            default:
                break;
        }
    }, []);

    // Handles raw transcript for single-field voice entry (when a mic button next to a field is tapped)
    const handleVoiceTranscript = useCallback((text) => {
        const currentField = activeFieldRef.current;
        if (!currentField) return;

        console.log(`[Voice] Transcript for field "${currentField}":`, text);

        // Text field (child name)
        if (currentField === 'childName') {
            // Use the spoken text directly as the name
            const name = text.trim();
            if (name) {
                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                setFormData(prev => ({ ...prev, childName: capitalizedName }));
                setVoiceStatus(`✅ Name: ${capitalizedName}`);
                setActiveVoiceField(null);
            }
            return;
        }

        // Numeric fields
        const parsed = parseSpokenNumber(text);
        if (parsed && parsed.value !== undefined) {
            let value = parsed.value;

            // Auto-convert years to months for age field
            if (currentField === 'ageMonths' && parsed.unit === 'years') {
                value = value * 12;
            }

            setFormData(prev => ({
                ...prev,
                [currentField]: String(value)
            }));
            setVoiceStatus(`✅ ${currentField}: ${value}`);
            setActiveVoiceField(null);
        } else {
            // Couldn't parse — try direct number
            const directNum = parseFloat(text.replace(/[^\d.]/g, ''));
            if (!isNaN(directNum)) {
                setFormData(prev => ({
                    ...prev,
                    [currentField]: String(directNum)
                }));
                setVoiceStatus(`✅ ${currentField}: ${directNum}`);
                setActiveVoiceField(null);
            } else {
                setVoiceStatus(`❌ Could not understand: "${text}"`);
            }
        }
    }, []);

    const { isListening, toggleListening, transcript, interimTranscript, currentLang } = useVoice(handleVoiceCommand, handleVoiceTranscript);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleMedical = (condition) => {
        setFormData(prev => ({
            ...prev,
            medicalHistory: prev.medicalHistory.includes(condition)
                ? prev.medicalHistory.filter(c => c !== condition)
                : [...prev.medicalHistory, condition]
        }));
    };

    // ===== CAMERA FUNCTIONS =====
    const startCamera = async () => {
        setCameraError(null);
        setCameraReady(false);
        try {
            // Try rear camera first, fallback to any camera
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
                    audio: false
                });
            } catch {
                // Fallback: any available camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }

            streamRef.current = stream;
            setCameraActive(true);

            // Wait for next render then attach stream
            setTimeout(() => {
                if (videoRef.current && stream.active) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().then(() => {
                            setCameraReady(true);
                        }).catch(() => setCameraReady(true));
                    };
                }
            }, 100);
        } catch (err) {
            console.error('Camera error:', err);
            setCameraActive(false);
            setCameraError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permission in your browser settings.'
                    : err.name === 'NotFoundError'
                        ? 'No camera found on this device. Please connect a camera.'
                        : `Camera error: ${err.message || 'Please try again.'}`
            );
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setCameraReady(false);
    };

    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
            // Video not ready yet
            setCameraError('Camera not ready. Please wait a moment and try again.');
            return;
        }

        const canvas = canvasRef.current;
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;
        canvas.width = vw;
        canvas.height = vh;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, vw, vh);

        // Get data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPhotoPreview(dataUrl);
        setPhotoValidation(null);
        setIsValidating(true);
        stopCamera();

        // Save photo blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `child-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                setFormData(prev => ({ ...prev, photo: file }));
            }
        }, 'image/jpeg', 0.9);

        // Validate with Gemini Vision — pass selected gender
        try {
            const validation = await validateChildPhoto(dataUrl, formData.gender);
            setPhotoValidation(validation);

            if (!validation.valid) {
                const cleanMsg = validation.message.replace(/[✅⚠️❌]/g, '').trim();
                speak(cleanMsg, getTTSLang(i18n.language));
            }
        } catch (err) {
            console.error('Photo validation error:', err);
            setPhotoValidation({ valid: true, message: '⚠️ Validation skipped', confidence: 0 });
        } finally {
            setIsValidating(false);
        }
    };

    const retakePhoto = () => {
        setPhotoPreview(null);
        setPhotoValidation(null);
        setFormData(prev => ({ ...prev, photo: null }));
        startCamera();
    };

    // File upload fallback (when camera fails)
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setPhotoValidation(null);
        setIsValidating(true);

        // Create preview
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result;
            setPhotoPreview(dataUrl);
            setFormData(prev => ({ ...prev, photo: file }));

            // Validate with Gemini Vision
            try {
                const validation = await validateChildPhoto(dataUrl, formData.gender);
                setPhotoValidation(validation);
                if (!validation.valid) {
                    const cleanMsg = validation.message.replace(/[\u2705\u26a0\ufe0f\u274c]/g, '').trim();
                    speak(cleanMsg, getTTSLang(i18n.language));
                }
            } catch (err) {
                console.error('Validation error:', err);
                setPhotoValidation({ valid: true, message: '\u26a0\ufe0f Validation skipped', confidence: 0 });
            } finally {
                setIsValidating(false);
            }
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be re-selected
        event.target.value = '';
    };

    // Start voice input for a specific field — speaks a prompt in user's language
    const startVoiceForField = (fieldName) => {
        // If already listening for this field, stop
        if (activeVoiceField === fieldName && isListening) {
            setActiveVoiceField(null);
            toggleListening();
            setVoiceStatus('');
            return;
        }
        // Set the active field first
        setActiveVoiceField(fieldName);
        setVoiceStatus(`🎤 Listening for ${fieldName}...`);

        // Speak the prompt in the user's language
        const prompt = getVoicePrompt(fieldName, i18n.language);
        speak(prompt, getTTSLang(i18n.language));

        // Start listening after a brief delay (let TTS finish)
        setTimeout(() => {
            if (!isListening) toggleListening();
        }, 1200);
    };

    // Submit screening
    const handleSubmit = () => {
        const screeningData = {
            gender: formData.gender,
            ageMonths: formData.ageMonths,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            muacCm: formData.muacCm,
            medicalHistory: formData.medicalHistory,
        };

        const screeningResult = performScreening(screeningData);
        setResult(screeningResult);

        const diet = getDietRecommendations(
            locationInfo.state,
            season,
            screeningResult.overallStatus
        );
        setDietInfo(diet);

        const signs = getDangerSigns(formData.medicalHistory);
        setDangerSigns(signs);

        const statusText = t(screeningResult.muacResult?.label || 'normal');
        const zoneText = t(screeningResult.muacResult?.zoneLabel || 'green_zone');
        speak(`${t('result')}: ${statusText}. ${zoneText}`, getTTSLang(i18n.language));
    };

    // Save
    const handleSave = async () => {
        setIsSaving(true);

        const record = {
            id: Date.now().toString(),
            childName: formData.childName,
            ageMonths: formData.ageMonths,
            gender: formData.gender,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            muacCm: formData.muacCm,
            headCirc: formData.headCirc,
            medicalHistory: formData.medicalHistory,
            result: result,
            location: locationInfo,
            season: season,
            userId: user?.uid || 'anonymous',
            createdAt: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem('cnis_screenings') || '[]');
        existing.push(record);
        localStorage.setItem('cnis_screenings', JSON.stringify(existing));

        try {
            const { collection, addDoc } = await import('firebase/firestore');
            const { db } = await import('../config/firebase');
            await addDoc(collection(db, 'screenings'), record);
        } catch (err) {
            console.log('Firestore save skipped:', err.message);
        }

        setIsSaving(false);
        setSaved(true);
        speak(t('success'), getTTSLang(i18n.language));
    };

    const VoiceButton = ({ field }) => {
        const isActive = activeVoiceField === field && isListening;
        return (
            <button
                type="button"
                onClick={() => startVoiceForField(field)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive
                    ? 'bg-red-500 text-white shadow-md scale-110 voice-active'
                    : 'bg-gray-100 text-gray-400 hover:bg-primary-100 hover:text-clinical-blue'
                    }`}
                title={isActive ? 'Stop listening' : getVoicePrompt(field, i18n.language)}
            >
                {isActive ? '🔴' : '🎤'}
            </button>
        );
    };

    const isFormValid = formData.childName && formData.ageMonths && formData.muacCm;

    return (
        <div className="space-y-6 animate-fade-in pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('screening')}</h2>
                    <p className="text-sm text-gray-500">Fill in child's measurements for nutrition assessment</p>
                </div>
                <button
                    onClick={() => {
                        setActiveVoiceField(null);
                        toggleListening();
                        if (isListening) setVoiceStatus('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isListening
                        ? 'bg-red-100 text-red-600 voice-active'
                        : 'bg-primary-50 text-clinical-blue hover:bg-primary-100'
                        }`}
                    title={isListening ? 'Stop listening' : 'Start voice commands'}
                >
                    <span>{isListening ? '🔴' : '🎤'}</span>
                    <span className="text-sm font-medium hidden sm:inline">
                        {isListening
                            ? (activeVoiceField
                                ? `Listening: ${activeVoiceField}`
                                : t('voice_listening') || 'Listening...')
                            : 'Voice'}
                    </span>
                </button>
            </div>

            {/* Voice Status Bar */}
            {(voiceStatus || isListening || interimTranscript) && (
                <div className={`rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 transition-all ${voiceStatus.startsWith('❌') ? 'bg-red-50 text-red-600 border border-red-200' :
                    voiceStatus.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-primary-50 text-clinical-blue border border-primary-200'
                    }`}>
                    {isListening && (
                        <div className="flex gap-1 items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-medium">
                                {i18n.language === 'hi' ? 'सुन रहा हूं...' : i18n.language === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
                            </span>
                        </div>
                    )}
                    {interimTranscript && (
                        <span className="text-gray-400 italic">"{interimTranscript}"</span>
                    )}
                    {transcript && !interimTranscript && (
                        <span>🗣️ "{transcript}"</span>
                    )}
                    {voiceStatus && !isListening && (
                        <span>{voiceStatus}</span>
                    )}
                    {activeVoiceField && isListening && (
                        <span className="ml-auto text-xs bg-white/70 px-2 py-0.5 rounded-full font-medium">
                            📝 {activeVoiceField === 'childName' ? 'Name'
                                : activeVoiceField === 'ageMonths' ? 'Age'
                                    : activeVoiceField === 'heightCm' ? 'Height'
                                        : activeVoiceField === 'weightKg' ? 'Weight'
                                            : activeVoiceField === 'muacCm' ? 'MUAC'
                                                : activeVoiceField === 'headCirc' ? 'Head'
                                                    : activeVoiceField}
                        </span>
                    )}
                </div>
            )}

            {/* Form */}
            {!result ? (
                <div className="space-y-5">
                    {/* Child Info */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-lg">👶</span> Child Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('child_name')}</label>
                                <input
                                    type="text"
                                    value={formData.childName}
                                    onChange={(e) => updateField('childName', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                                    placeholder="Enter child's name"
                                    id="input-child-name"
                                />
                                <VoiceButton field="childName" />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('child_age')}</label>
                                <input
                                    type="number"
                                    value={formData.ageMonths}
                                    onChange={(e) => updateField('ageMonths', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                                    placeholder="e.g. 36"
                                    id="input-age"
                                />
                                <VoiceButton field="ageMonths" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('child_gender')}</label>
                                <div className="flex gap-3">
                                    {['male', 'female'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => updateField('gender', g)}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.gender === g
                                                ? 'bg-clinical-blue text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {g === 'male' ? '👦 ' : '👧 '}{t(g)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-lg">📏</span> Measurements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { field: 'heightCm', label: 'height', placeholder: 'e.g. 88' },
                                { field: 'weightKg', label: 'weight', placeholder: 'e.g. 10' },
                                { field: 'muacCm', label: 'muac', placeholder: 'e.g. 12', important: true },
                                { field: 'headCirc', label: 'head_circ', placeholder: 'e.g. 48' },
                            ].map(input => (
                                <div key={input.field} className="relative">
                                    <label className={`block text-sm font-medium mb-1 ${input.important ? 'text-clinical-blue' : 'text-gray-600'}`}>
                                        {t(input.label)}
                                        {input.important && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData[input.field]}
                                        onChange={(e) => updateField(input.field, e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 outline-none transition-all bg-white ${input.important
                                            ? 'border-primary-200 focus:border-clinical-blue focus:ring-primary-100'
                                            : 'border-gray-200 focus:border-clinical-blue focus:ring-primary-100'
                                            }`}
                                        placeholder={input.placeholder}
                                        id={`input-${input.field}`}
                                    />
                                    <VoiceButton field={input.field} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Selector */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-lg">📍</span> Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">State / Region</label>
                                <select
                                    value={locationInfo.state}
                                    onChange={(e) => setLocationInfo(prev => ({ ...prev, state: e.target.value, detected: false }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white appearance-none cursor-pointer"
                                    id="select-location"
                                >
                                    {INDIAN_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                {locationInfo.detected && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        ✅ Auto-detected via GPS
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Season</label>
                                <select
                                    value={season}
                                    onChange={(e) => setSeason(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white appearance-none cursor-pointer"
                                    id="select-season"
                                >
                                    <option value="summer">☀️ Summer (Mar-May)</option>
                                    <option value="monsoon">🌧️ Monsoon (Jun-Sep)</option>
                                    <option value="autumn">🍂 Autumn (Oct-Nov)</option>
                                    <option value="winter">❄️ Winter (Dec-Feb)</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">Auto-detected: {detectSeason() === season ? 'Yes' : 'Manually changed'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-lg">🩺</span> {t('medical_history')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {medicalConditions.map(condition => (
                                <button
                                    key={condition}
                                    onClick={() => toggleMedical(condition)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.medicalHistory.includes(condition)
                                        ? condition === 'edema' || condition === 'lethargy'
                                            ? 'bg-red-500 text-white shadow-md'
                                            : 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    id={`medical-${condition}`}
                                >
                                    {formData.medicalHistory.includes(condition) && '✓ '}
                                    {t(condition)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Camera Capture */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="text-lg">📸</span> Child Photo
                        </h3>

                        {/* Hidden file input for fallback */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="photo-file-input"
                        />

                        {!cameraActive && !photoPreview && (
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {/* Camera button */}
                                    <button
                                        onClick={startCamera}
                                        className="inline-flex items-center gap-3 px-5 py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-clinical-blue hover:bg-primary-50 transition-all group flex-1"
                                        id="start-camera-btn"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                            <span className="text-2xl">📷</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-700 text-sm">Open Camera</p>
                                            <p className="text-xs text-gray-400">Live camera capture</p>
                                        </div>
                                    </button>
                                    {/* Upload fallback */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-3 px-5 py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all group flex-1"
                                        id="upload-photo-btn"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <span className="text-2xl">📁</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-700 text-sm">Upload Photo</p>
                                            <p className="text-xs text-gray-400">From gallery / files</p>
                                        </div>
                                    </button>
                                </div>
                                {cameraError && (
                                    <div className="bg-red-50 px-4 py-3 rounded-xl">
                                        <p className="text-sm text-red-600 font-medium">❌ {cameraError}</p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-2 text-sm text-clinical-blue font-medium hover:underline"
                                        >
                                            📁 Upload a photo instead →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Live Camera Preview */}
                        {cameraActive && (
                            <div className="space-y-3">
                                <div className="relative rounded-2xl overflow-hidden bg-black" style={{ minHeight: '200px' }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full max-h-72 object-cover"
                                        style={{ display: cameraReady ? 'block' : 'none' }}
                                    />
                                    {/* Loading indicator while camera initializes */}
                                    {!cameraReady && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-3" />
                                            <p className="text-sm">Starting camera...</p>
                                        </div>
                                    )}
                                    {/* Camera overlay guides */}
                                    {cameraReady && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute inset-6 border-2 border-white/40 rounded-2xl" />
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> Camera Ready
                                            </div>
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                                                Position the child's face clearly in the frame
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {cameraError && (
                                    <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">❌ {cameraError}</p>
                                )}
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={capturePhoto}
                                        disabled={!cameraReady}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-md transition-all active:scale-95 ${cameraReady
                                            ? 'gradient-clinical text-white hover:shadow-lg'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        id="capture-btn"
                                    >
                                        📸 {cameraReady ? 'Capture Photo' : 'Loading...'}
                                    </button>
                                    <button
                                        onClick={stopCamera}
                                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Captured Photo Preview + Validation Results */}
                        {photoPreview && !cameraActive && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-4">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={photoPreview}
                                            alt="Captured"
                                            className={`w-32 h-32 rounded-2xl object-cover border-3 ${photoValidation
                                                ? photoValidation.valid
                                                    ? 'border-green-400'
                                                    : 'border-red-400'
                                                : 'border-gray-200'
                                                }`}
                                        />
                                        {isValidating && (
                                            <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center">
                                                <div className="w-8 h-8 border-3 border-clinical-blue border-t-transparent rounded-full animate-spin" />
                                                <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Analyzing with AI...</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {photoValidation && (
                                            <div className={`p-3 rounded-xl ${photoValidation.valid
                                                ? photoValidation.genderMismatch
                                                    ? 'bg-amber-50 border border-amber-300'
                                                    : 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200'
                                                }`}>
                                                <p className={`text-sm font-medium ${photoValidation.valid
                                                    ? photoValidation.genderMismatch ? 'text-amber-700' : 'text-green-700'
                                                    : 'text-red-700'
                                                    }`}>
                                                    {photoValidation.message}
                                                </p>

                                                {/* Detailed AI analysis results */}
                                                {photoValidation.details && (
                                                    <div className="mt-2 space-y-1">
                                                        {photoValidation.details.estimatedAge && (
                                                            <p className="text-xs text-gray-600">
                                                                👶 Age: <span className="font-medium">{photoValidation.details.estimatedAge}</span>
                                                            </p>
                                                        )}
                                                        {photoValidation.details.detectedGender && photoValidation.details.detectedGender !== 'unknown' && (
                                                            <p className="text-xs text-gray-600">
                                                                {photoValidation.details.detectedGender === 'male' ? '👦' : '👧'} Gender: <span className="font-medium">{photoValidation.details.detectedGender}</span>
                                                                {photoValidation.details.genderMatch ? ' ✅' : ' ⚠️ mismatch'}
                                                            </p>
                                                        )}
                                                        {photoValidation.details.photoQuality && (
                                                            <p className="text-xs text-gray-600">
                                                                📷 Quality: <span className={`font-medium ${photoValidation.details.photoQuality === 'good' ? 'text-green-600' :
                                                                    photoValidation.details.photoQuality === 'fair' ? 'text-amber-600' : 'text-red-600'
                                                                    }`}>{photoValidation.details.photoQuality}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            onClick={retakePhoto}
                                            className="mt-2 text-sm text-clinical-blue hover:text-clinical-dark font-medium flex items-center gap-1 transition-colors"
                                        >
                                            🔄 Retake Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hidden canvas for capture */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isFormValid
                            ? 'gradient-clinical text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        id="submit-screening"
                    >
                        {t('start_screening')}
                    </button>
                </div>
            ) : (
                /* Results Section */
                <div className="space-y-5 animate-scale-in">
                    {/* Status Banner */}
                    <div className={`rounded-3xl p-6 text-white ${result.zone === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500' :
                        result.zone === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                            'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                <span className="text-4xl">
                                    {result.zone === 'red' ? '🚨' : result.zone === 'orange' ? '⚠️' : '✅'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{t(result.muacResult?.label || 'normal')}</h3>
                                <p className="text-white/90">{t(result.muacResult?.zoneLabel || 'green_zone')}</p>
                                {result.muacResult && (
                                    <p className="text-white/70 text-sm mt-1">
                                        MUAC: {formData.muacCm} cm | {result.overallStatus}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danger Signs */}
                    {dangerSigns.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                <span className="text-xl">🚨</span> {t('danger_signs')}
                            </h3>
                            <div className="space-y-2">
                                {dangerSigns.map((sign, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${sign.severity === 'critical' ? 'bg-red-100' : 'bg-orange-50'
                                        }`}>
                                        <span className="text-lg mt-0.5">{sign.icon}</span>
                                        <div>
                                            <p className="font-semibold text-sm text-red-800">{sign.sign}</p>
                                            <p className="text-xs text-red-600">{sign.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-red-600 bg-red-100 rounded-lg px-3 py-2">
                                🏥 {t('seek_medical')}
                            </p>
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && (
                        <div className="glass rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="text-lg">📋</span> Action Plan
                            </h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-primary-50 rounded-xl">
                                    <p className="font-medium text-clinical-dark text-sm">{result.recommendations.action}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600"><span className="font-medium">Feeding:</span> {result.recommendations.feeding}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600"><span className="font-medium">Follow-up:</span> {result.recommendations.followUp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Diet Recommendations */}
                    {dietInfo && (
                        <div className="glass rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-lg">🍽️</span> {t('diet_recommendations')}
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary-50 text-clinical-blue text-xs font-medium rounded-full">
                                    📍 {locationInfo.state || 'Maharashtra'}
                                </span>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                    {season === 'summer' ? '☀️' : season === 'winter' ? '❄️' : season === 'monsoon' ? '🌧️' : '🍂'} {t(season)}
                                </span>
                            </div>

                            {dietInfo.urgentAdvice && (
                                <div className="mb-4 space-y-1">
                                    {dietInfo.urgentAdvice.map((advice, i) => (
                                        <p key={i} className="text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">{advice}</p>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {dietInfo.foods?.map((food, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                                        <span className="text-2xl">{food.emoji}</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{food.name}</p>
                                            <p className="text-xs text-gray-500">{food.benefit}</p>
                                            <p className="text-xs text-clinical-blue mt-0.5">{food.nutrients}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {dietInfo.tips && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">💡 Tips:</p>
                                    <ul className="space-y-1">
                                        {dietInfo.tips.map((tip, i) => (
                                            <li key={i} className="text-xs text-gray-500 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-clinical-blue">
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || saved}
                            className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-500 text-white'
                                : 'gradient-clinical text-white hover:shadow-lg active:scale-[0.99]'
                                }`}
                            id="save-screening"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : saved ? (
                                <>✅ Saved</>
                            ) : (
                                <>💾 {t('save_data')}</>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setResult(null);
                                setDietInfo(null);
                                setDangerSigns([]);
                                setPhotoPreview(null);
                                setPhotoValidation(null);
                                setSaved(false);
                                setFormData({
                                    childName: '', ageMonths: '', gender: 'female',
                                    heightCm: '', weightKg: '', muacCm: '', headCirc: '',
                                    medicalHistory: [], photo: null,
                                });
                            }}
                            className="px-6 py-3 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        >
                            New
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
