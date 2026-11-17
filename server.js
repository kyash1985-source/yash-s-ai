require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

app.post('/chat', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}?key=${API_KEY}`, {
            contents: [{ parts: [{ text: req.body.message }] }]
        }, {
            headers: { 'content-type': 'application/json' }
        });
        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
