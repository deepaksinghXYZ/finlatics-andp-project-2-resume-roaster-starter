module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/gemini.js [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { GoogleGenAI } = __turbopack_context__.r("[externals]/@google/genai [external] (@google/genai, cjs, [project]/node_modules/@google/genai)");
/**
 * Sends resume text to Gemini AI and requests a structured JSON roast.
 * @param {string} resumeText - The plain text extracted from the PDF resume.
 * @returns {Promise<object>} The parsed JSON roast response from Gemini.
 */ async function roastResume(resumeText) {
    try {
        // INITIALIZE AT RUNTIME: This guarantees Next.js has loaded your process.env keys first!
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                responseMimeType: 'application/json',
                systemInstruction: `You are a brutal, hilarious, and deeply honest tech recruiter. 
Your job is to roast the user's resume text. 

You must respond ONLY with a valid JSON object matching this schema layout. Do not add conversational text or intro greetings.

JSON Schema layout:
{
  "score": 75,
  "issues": ["string description of what is wrong"],
  "improvements": ["string description of how to fix it"]
}`
            },
            contents: `Here is the resume text to roast:\n\n${resumeText}`
        });
        const textResponse = response.text;
        if (!textResponse) {
            throw new Error("Empty response payload received from the model.");
        }
        const jsonRoast = JSON.parse(textResponse.trim());
        return jsonRoast;
    } catch (error) {
        console.error("Error communicating with Gemini or parsing JSON:", error);
        throw new Error(`Failed to generate resume roast: ${error.message}`);
    }
}
module.exports = roastResume;
}),
"[project]/pages/api/roast.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
const { parsePDF } = __turbopack_context__.r("[project]/pdfParser.js [api] (ecmascript)");
const roastResume = __turbopack_context__.r("[project]/gemini.js [api] (ecmascript)");
const config = {
    api: {
        bodyParser: false
    }
};
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method Not Allowed. Use POST.'
        });
    }
    try {
        // Read raw incoming file data stream
        const chunks = [];
        for await (const chunk of req){
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);
        if (!fileBuffer || fileBuffer.length === 0) {
            return res.status(400).json({
                error: 'No file uploaded or file is empty.'
            });
        }
        // 1. Parse text from the file buffer
        const resumeText = await parsePDF(fileBuffer);
        if (!resumeText || resumeText.trim() === '') {
            return res.status(400).json({
                error: 'Could not extract any readable text from this PDF.'
            });
        }
        // 2. Generate the AI Roast object
        const aiRoastResult = await roastResume(resumeText);
        // 3. Return the clean JSON back to the client UI
        return res.status(200).json(aiRoastResult);
    } catch (error) {
        console.error("Critical failure in Roast API handler:", error);
        return res.status(500).json({
            error: 'Internal Server Error during processing.',
            details: error.message
        });
    }
}
}),
"[project]/pdfParser.js [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Add a fallback check to cleanly extract the default function matching how Next.js bundles it
const pdfParseModule = __turbopack_context__.r("[externals]/pdf-parse [external] (pdf-parse, cjs, [project]/node_modules/pdf-parse)");
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;
/**
 * Extracts all plain text from a binary PDF file buffer.
 * @param {Buffer} fileBuffer - The binary buffer data of the uploaded PDF file.
 * @returns {Promise<string>} The raw text extracted from the PDF pages.
 */ async function parsePDF(fileBuffer) {
    try {
        // Call the verified isolated function module
        const data = await pdfParse(fileBuffer);
        // Return just the extracted plain text string
        return data.text;
    } catch (error) {
        console.error("Error reading or parsing the PDF file:", error);
        throw new Error("Failed to extract text from the PDF. Ensure the file is not corrupted.");
    }
}
module.exports = {
    parsePDF
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0r73nb8._.js.map