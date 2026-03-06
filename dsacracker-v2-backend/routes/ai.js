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

router.post('/roast', authMiddleware, async (req, res) => {
    try {
        const { questionName, userCode } = req.body;

        if (!questionName || !userCode) {
            return res.status(400).json({ error: 'questionName and userCode are required' });
        }

        const systemInstruction = `You are a hilariously savage "Gordon Ramsay of Software Engineering". 
Your job is to absolutely ROAST the user's provided code for the problem: "${questionName}".

Strict Rules:
1. BE BRUTAL, sarcastic, and funny. Tear apart their variable names, their formatting, their brute-force loops, and their overall life choices.
2. DO NOT just insult them blindly—your roast MUST be technically accurate based on the actual code they wrote (e.g., if it's O(N^2), roast them for melting the CPU).
3. At the very end, drop the act for exactly ONE sentence and give them a genuine, useful tip on how it should actually be solved optimally.
4. Format your response cleanly in Markdown (use \`backticks\` for code snippets, maybe some 🔥 emojis).

Here is the "meal" (code) the candidate served you:
\`\`\`
${userCode}
\`\`\`
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: "Chef, I have prepared my code. Please review it." }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.9, // Higher temp for more creative/savage roasts
            }
        });

        res.json({ text: response.text });

    } catch (error) {
        console.error('Error generating AI roast:', error);
        res.status(500).json({ error: 'Failed to generate roast' });
    }
});

router.post('/syllabus', authMiddleware, async (req, res) => {
    try {
        const { progressSummary } = req.body;

        if (!progressSummary) {
            return res.status(400).json({ error: 'progressSummary is required' });
        }

        const systemInstruction = `You are an elite Data Structures & Algorithms (DSA) Mentor and Staff Engineer. 
The user is providing you with a summary of their current progress across various DSA topics. 
Your goal is to generate a highly personalized, actionable "Smart Syllabus" or "Study Masterplan" for them.

Strict Rules:
1. Analyze their provided progress. Point out their specific strengths (topics they've completed mostly/fully) and their weak points (topics they haven't touched or have bookmarked heavily).
2. Recommend exactly WHICH 2-3 topics they should focus on next, and provide a 1-sentence explanation of WHY (e.g., "You need to master Trees before tackling Graphs"). 
3. Maintain an encouraging, mentorship-oriented, and professional tone.
4. Format your response cleanly and beautifully in Markdown using headers (##), bullet points, and bold text for emphasis. Do not use raw HTML.
5. Keep the entire masterplan concise, to the point, and under 300 words.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `Here is my current DSA progress summary:\n${progressSummary}\n\nPlease generate my personalized study masterplan.` }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5, // Balanced for structured but slightly creative advice
            }
        });

        res.json({ text: response.text });

    } catch (error) {
        console.error('Error generating AI syllabus:', error);
        res.status(500).json({ error: 'Failed to generate syllabus' });
    }
});

router.post('/search', authMiddleware, async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'query is required' });
        }

        const systemInstruction = `You are a Semantic Search Engine for LeetCode Data Structures and Algorithms problems.
The user will provide a vague, natural language description of a problem they are trying to find.
Your ONLY job is to return the exact, canonical name of the closest matching standard LeetCode problem.

Strict Rules:
1. Output ONLY the problem name. No preamble, no explanation, no quotes. (e.g., "Two Sum", "Trapping Rain Water", "Longest Common Subsequence").
2. If the user's query is too vague to match a specific problem, return your best guess of the most famous problem that fits the description.
3. Ignore typos or poor phrasing. Focus on the core algorithmic concept being described.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `Find the DSA problem matching this description: "${query}"` }]
                }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1, // Low temp for deterministic, factual matching
            }
        });

        // Clean up the response just in case (remove quotes, newlines, etc.)
        const problemName = response.text.replace(/["'\n\r]/g, '').trim();

        res.json({ problemName });

    } catch (error) {
        console.error('Error generating AI search result:', error);
        res.status(500).json({ error: 'Failed to perform semantic search' });
    }
});

module.exports = router;
