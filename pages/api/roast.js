const { parsePDF } = require('../../pdfParser');
const roastResume = require('../../gemini');

// Config required by Next.js to allow receiving large binary files (like PDFs)
export const config = {
  api: {
    bodyParser: false, 
  },
};

/**
 * Main API Route Handler
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // Read raw incoming file data stream
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or file is empty.' });
    }

    // 1. Parse text from the file buffer
    const resumeText = await parsePDF(fileBuffer);

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ error: 'Could not extract any readable text from this PDF.' });
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