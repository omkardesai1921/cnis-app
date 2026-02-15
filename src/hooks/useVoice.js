import { useState, useEffect, useCallback, useRef } from 'react';
import { createSpeechRecognition, getRecognitionLang, matchCommand, parseSpokenNumber, parseFieldAssignment } from '../utils/voice';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for voice UI functionality
 * Supports multilingual speech recognition (EN/HI/MR)
 * Auto-switches recognition language when app language changes
 */
export function useVoice(onCommand, onTranscript) {
    const { i18n } = useTranslation();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef(null);
    const onCommandRef = useRef(onCommand);
    const onTranscriptRef = useRef(onTranscript);

    // Keep refs updated to avoid stale closures
    useEffect(() => {
        onCommandRef.current = onCommand;
    }, [onCommand]);

    useEffect(() => {
        onTranscriptRef.current = onTranscript;
    }, [onTranscript]);

    // Stop listening when language changes, so next listen uses new language
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsListening(false);
        }
    }, [i18n.language]);

    const startListening = useCallback(() => {
        // Stop any existing recognition
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch { /* ok */ }
            recognitionRef.current = null;
        }

        const lang = getRecognitionLang(i18n.language);
        console.log(`[Voice] Starting recognition in: ${lang}`);
        const recognition = createSpeechRecognition(lang);

        if (!recognition) {
            console.warn('Speech recognition not available');
            return;
        }

        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            setInterimTranscript('');
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
            }

            if (final) {
                final = final.trim();
                setTranscript(final);
                setInterimTranscript('');
                console.log(`[Voice] Final transcript (${lang}):`, final);

                // 1. Check for navigation/action commands
                const command = matchCommand(final);
                if (command && onCommandRef.current) {
                    console.log('[Voice] Command matched:', command);
                    onCommandRef.current(command);
                    return; // Don't pass to transcript handler if it's a command
                }

                // 2. Check for field assignment (e.g., "name Rohit", "weight 10")
                const fieldAssignment = parseFieldAssignment(final);
                if (fieldAssignment && onCommandRef.current) {
                    console.log('[Voice] Field assignment:', fieldAssignment);
                    onCommandRef.current({ action: 'setField', ...fieldAssignment });
                    return;
                }

                // 3. Pass raw transcript to callback (for single-field voice entry)
                if (onTranscriptRef.current) {
                    onTranscriptRef.current(final);
                }
            }
        };

        recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
            setIsListening(false);
        }
    }, [i18n.language]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch { /* ok */ }
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch { /* ok */ }
            }
        };
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        toggleListening,
        parseSpokenNumber,
        currentLang: i18n.language
    };
}
