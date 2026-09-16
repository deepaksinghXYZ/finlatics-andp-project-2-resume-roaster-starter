// Demo code for upload.js (API)
export default function handler(req, res) {
  res.status(200).json({ message: 'Demo upload API' });
}
import { parsePDF } from './pdfParser';
import roastResume from './gemini';

// Tell Next.js not to parse the body so we can handle binary/form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to read the incoming file buffer
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Read binary buffer from request
    const buffer = await getRawBody(req);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or empty file.' });
    }

    // 2. Extract text using pdfParser.js
    const resumeText = await parsePDF(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the PDF. Ensure it is not an image scan.' });
    }

    // 3. Call Gemini AI to roast the resume
    const roastResult = await roastResume(resumeText);

    // 4. Return the structured JSON roast back to the frontend
    return res.status(200).json(roastResult);
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ 
      error: 'Failed to process resume', 
      details: error.message 
    });
  }
}

