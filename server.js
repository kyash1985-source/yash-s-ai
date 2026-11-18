require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // Try models in order - best to worst
        const modelNames = [
            "gemini-2.0-flash-exp",
            "gemini-2.0-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        let lastError;
        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(req.body.message);
                const response = await result.response;
                const text = response.text();
                console.log(`✅ Using model: ${modelName}`);
                return res.json({ reply: text });
            } catch (err) {
                console.warn(`❌ Model ${modelName} failed: ${err.message}`);
                lastError = err;
                continue;
            }
        }

        // All models failed
        console.error("All models failed. Last error:", lastError);
        res.status(500).json({ error: lastError.message });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
