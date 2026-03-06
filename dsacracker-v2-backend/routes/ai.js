const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dsa_cracker_super_secret_key_2026';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. No token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
};

router.post('/interview', authMiddleware, async (req, res) => {
    try {
        const { questionName, userCode, chatHistory = [] } = req.body;

        if (!questionName) {
            return res.status(400).json({ error: 'questionName is required' });
        }

        const systemInstruction = `You are a Senior Staff Software Engineer at a FAANG company conducting a technical interview. 
Your goal is to evaluate the candidate's code for the Data Structures & Algorithms problem: "${questionName}".

Strict Rules:
1. DO NOT give the candidate the direct code answer or solution under ANY circumstances. 
2. Critique their approach based on Time and Space Complexity. If it is brute force, push them towards a more optimal approach.
3. If their code has a bug (e.g., edge cases like empty arrays, integer overflow, or off-by-one errors), point it out indirectly by asking a probing question.
4. Keep your responses concise, professional, and slightly challenging—just like a real high-bar interview.
5. Format your response cleanly in Markdown (use \`backticks\` for variables).

Here is the code the candidate submitted:
\`\`\`
${userCode ? userCode : '(Candidate has not written any code yet)'}
\`\`\`
`;

        // Format history for the Gemini API
        // chatHistory from frontend should be array of { role: 'user' | 'model', parts: [{ text: '...' }] }
        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user', // Map frontend 'ai' role to 'model'
            parts: [{ text: msg.text }]
        }));

        const latestMessage = formattedHistory.length > 0 ? formattedHistory.pop() : { role: 'user', parts: [{ text: 'Can you review my code?' }] };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...formattedHistory,
                {
                    role: 'user',
                    parts: [{ text: latestMessage.parts[0].text }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, // Professional but slightly creative
            }
        });

        res.json({ text: response.text });

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate interview response' });
    }
});

router.post('/hint', authMiddleware, async (req, res) => {
    try {
        const { questionName, hintLevel } = req.body;

        if (!questionName || !hintLevel) {
            return res.status(400).json({ error: 'questionName and hintLevel are required' });
        }

        let hintPrompt = "";
        if (hintLevel === 1) {
            hintPrompt = "Provide a high-level semantic intuition or real-world analogy for how to approach this problem. Do not mention specific algorithms yet.";
        } else if (hintLevel === 2) {
            hintPrompt = "Suggest the algorithmic approach or pattern (e.g., sliding window, two-pointer, BFS) that best solves this problem. Explain briefly why it fits.";
        } else {
            hintPrompt = "Detail the target Time and Space complexity for the optimal solution, and explicitly state which Data Structures should be used.";
        }

        const systemInstruction = `You are an AI teaching assistant helping a student with the Data Structures & Algorithms problem: "${questionName}".
        
Strict Rules:
1. DO NOT write or provide any code. EVER.
2. Keep your response extremely concise (2-4 sentences maximum).
3. Directly answer the user's request for Hint Level ${hintLevel}.
4. Format using Markdown if necessary.

Student Request: ${hintPrompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: "Please give me the hint." }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4, // Lower temp for more direct answers
            }
        });

        res.json({ text: response.text });

    } catch (error) {
        console.error('Error generating AI hint:', error);
        res.status(500).json({ error: 'Failed to generate hint' });
    }
});

module.exports = router;
