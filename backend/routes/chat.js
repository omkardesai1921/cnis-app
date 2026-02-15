const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/chat
 * Secure proxy for OpenAI/Gemini chat completions
 * Protected by authentication and rate limiting
 */
router.post('/chat', aiLimiter, async (req, res) => {
    try {
        const { message, lang, systemPrompt } = req.body;

        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message' });
        }

        if (message.length > 1000) {
            return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
        }

        // Log request (anonymized)
        console.log(`[Chat API] User ${req.user.uid} | Lang: ${lang || 'en'} | Length: ${message.length}`);

        const openaiKey = process.env.OPENAI_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        if (!openaiKey && !geminiKey) {
            return res.status(503).json({
                error: 'Service unavailable',
                message: 'AI service configuration missing'
            });
        }

        // Try OpenAI first
        if (openaiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            { role: 'system', content: systemPrompt || 'You are a helpful health assistant.' },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 400,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const answer = data.choices?.[0]?.message?.content;

                    if (answer) {
                        console.log(`✅ OpenAI response sent to ${req.user.email || req.user.uid}`);
                        return res.json({
                            answer,
                            provider: 'openai',
                            usage: data.usage
                        });
                    }
                } else {
                    console.warn(`⚠️  OpenAI API error: ${response.status}`);
                }
            } catch (error) {
                console.error('OpenAI error:', error.message);
            }
        }

        // Fallback to Gemini
        if (geminiKey) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `${systemPrompt || 'You are a helpful health assistant.'}\n\nUser: ${message}`
                                }]
                            }]
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (answer) {
                        console.log(`✅ Gemini response sent to ${req.user.email || req.user.uid}`);
                        return res.json({
                            answer,
                            provider: 'gemini'
                        });
                    }
                }
            } catch (error) {
                console.error('Gemini error:', error.message);
            }
        }

        // Both failed
        return res.status(503).json({
            error: 'AI service unavailable',
            message: 'Both OpenAI and Gemini services failed. Please try again later.'
        });

    } catch (error) {
        console.error('❌ Chat API error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process chat request'
        });
    }
});

module.exports = router;
