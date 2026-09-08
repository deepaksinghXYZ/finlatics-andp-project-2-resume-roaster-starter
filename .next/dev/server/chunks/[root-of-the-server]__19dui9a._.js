module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/roast.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
(()=>{
    const e = new Error("Cannot find module './pdfParser'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './gemini'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const config = {
    api: {
        bodyParser: false
    }
};
async function handler(req, res) {
    // 1. Only allow POST requests (since the user is sending/uploading data)
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method Not Allowed. Use POST.'
        });
    }
    try {
        // 2. Read the uploaded incoming binary chunks from the request stream
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
        // 3. Relay Step A: Pass the file data to your parser to extract text words
        const resumeText = await parsePDF(fileBuffer);
        if (!resumeText || resumeText.trim() === '') {
            return res.status(400).json({
                error: 'Could not extract any readable text from this PDF.'
            });
        }
        // 4. Relay Step B: Send the extracted text to Claude AI and wait for the object response
        const aiRoastResult = await roastResume(resumeText);
        // 5. Success! Return the perfectly formatted JSON feedback object to the user's interface
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19dui9a._.js.map