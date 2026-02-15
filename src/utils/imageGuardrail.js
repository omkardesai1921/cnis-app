/**
 * Image Validation Guardrail
 * Uses Gemini Vision API for accurate child/gender detection
 * Falls back to skin-tone + MobileNet if API unavailable
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Convert image element or data URL to base64 for OpenAI API
 */
function imageToBase64(imageSource) {
    return new Promise((resolve) => {
        if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
            // Already a data URL
            const base64 = imageSource.split(',')[1];
            resolve(base64);
            return;
        }

        // It's an image element - draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = imageSource.naturalWidth || imageSource.width || 640;
        canvas.height = imageSource.naturalHeight || imageSource.height || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
    });
}

/**
 * Validate photo using OpenAI Vision API
 * Checks: is person, is child, gender match
 */
async function validateWithOpenAI(imageSource, expectedGender) {
    if (!OPENAI_API_KEY) return null;

    try {
        const base64 = await imageToBase64(imageSource);

        const prompt = `Analyze this photo carefully and respond ONLY in valid JSON format. Do not include markdown formatting.

Check the following:
1. Is there a person visible in this photo?
2. If yes, is the person a child (approximately 0-5 years old)?
3. If yes, what appears to be the child's gender?
4. Is the photo clear enough for medical/health screening purposes?

The expected gender selected by the parent is: ${expectedGender}

Respond in this exact JSON format:
{
  "isPerson": true or false,
  "isChild": true or false,
  "estimatedAge": "baby/toddler/young child/older child/adult/unknown",
  "detectedGender": "male/female/unknown",
  "genderMatch": true or false,
  "photoQuality": "good/fair/poor",
  "confidence": 0.0 to 1.0,
  "description": "brief description of what you see"
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error:', response.status);
            return null;
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        // Parse JSON from response (handle markdown code blocks)
        let jsonStr = text;
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
        }

        // Clean and parse
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith('{')) {
            const result = JSON.parse(jsonStr);
            return result;
        }

        return null;
    } catch (error) {
        console.error('OpenAI validation error:', error);
        return null;
    }
}

/**
 * Detect skin tone pixels in image (fallback heuristic)
 */
function detectSkinTone(imageElement) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(imageElement, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        let skinPixels = 0;
        const total = size * size;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            if (
                r > 60 && g > 30 && b > 15 &&
                r > g && r > b &&
                (r - g) > 10 &&
                Math.abs(r - g) < 170 &&
                r < 255 && g < 230 && b < 200
            ) {
                skinPixels++;
            }
        }

        const ratio = skinPixels / total;
        return { hasSkin: ratio > 0.05, skinRatio: ratio };
    } catch {
        return { hasSkin: false, skinRatio: 0 };
    }
}

/**
 * Main validation function
 * Uses Gemini Vision API first, falls back to skin-tone heuristic
 *
 * @param {HTMLImageElement|string} imageSource - Image element or data URL
 * @param {string} expectedGender - 'male' or 'female'
 * @returns {Object} { valid, message, details }
 */
export async function validateChildPhoto(imageSource, expectedGender = 'unknown') {
    try {
        // Try OpenAI Vision API first (most accurate)
        const openAIResult = await validateWithOpenAI(imageSource, expectedGender);

        if (openAIResult) {
            console.log('OpenAI validation result:', openAIResult);

            // Not a person at all
            if (!openAIResult.isPerson) {
                return {
                    valid: false,
                    message: `❌ No person detected in the photo. ${openAIResult.description || 'Please take a clear photo of the child.'}`,
                    details: openAIResult,
                    confidence: openAIResult.confidence || 0
                };
            }

            // Person detected but not a child
            if (openAIResult.isPerson && !openAIResult.isChild) {
                return {
                    valid: false,
                    message: `❌ Adult detected — this appears to be an ${openAIResult.estimatedAge || 'adult'}. Please take a photo of the child (0-5 years).`,
                    details: openAIResult,
                    confidence: openAIResult.confidence || 0
                };
            }

            // Child detected but gender mismatch
            if (openAIResult.isChild && openAIResult.detectedGender !== 'unknown' &&
                expectedGender !== 'unknown' && !openAIResult.genderMatch) {
                return {
                    valid: false,
                    message: `⚠️ Gender mismatch — you selected "${expectedGender}" but the photo appears to show a ${openAIResult.detectedGender} child. Please verify or retake.`,
                    details: openAIResult,
                    confidence: openAIResult.confidence || 0,
                    genderMismatch: true
                };
            }

            // Child detected, gender matches
            if (openAIResult.isChild) {
                const qualityNote = openAIResult.photoQuality === 'poor'
                    ? ' (Photo quality is low — consider retaking in better lighting)'
                    : '';

                const genderNote = openAIResult.detectedGender !== 'unknown'
                    ? ` | Gender: ${openAIResult.detectedGender} ✓`
                    : '';

                const ageNote = openAIResult.estimatedAge
                    ? ` | Age: ${openAIResult.estimatedAge}`
                    : '';

                return {
                    valid: true,
                    message: `✅ Child detected (${Math.round((openAIResult.confidence || 0.8) * 100)}% confidence)${ageNote}${genderNote}${qualityNote}`,
                    details: openAIResult,
                    confidence: openAIResult.confidence || 0.8
                };
            }
        }

        // Fallback: skin-tone detection
        console.log('Falling back to skin-tone detection');
        let imgEl = imageSource;
        if (typeof imageSource === 'string') {
            imgEl = await createImageFromFile(imageSource);
        }

        const skinResult = detectSkinTone(imgEl);

        if (skinResult.hasSkin && skinResult.skinRatio > 0.08) {
            return {
                valid: true,
                message: '⚠️ AI validation unavailable — photo appears to contain a person. Please verify manually.',
                details: { skinRatio: skinResult.skinRatio },
                confidence: skinResult.skinRatio * 3
            };
        }

        if (skinResult.skinRatio < 0.03) {
            return {
                valid: false,
                message: '❌ No person detected. Please take a clear photo of the child.',
                details: {},
                confidence: 0
            };
        }

        return {
            valid: true,
            message: '⚠️ Could not fully validate — please ensure this is a photo of the child.',
            details: {},
            confidence: 0.3
        };

    } catch (error) {
        console.error('Validation error:', error);
        return {
            valid: true,
            message: '⚠️ Validation error — please ensure this is a photo of the child.',
            details: {},
            confidence: 0
        };
    }
}

/**
 * Create an image element from a File, Blob, or data URL
 */
export function createImageFromFile(fileOrDataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const url = typeof fileOrDataUrl === 'string'
            ? fileOrDataUrl
            : URL.createObjectURL(fileOrDataUrl);
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
