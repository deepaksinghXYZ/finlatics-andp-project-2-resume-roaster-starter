// Add a fallback check to cleanly extract the default function matching how Next.js bundles it
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;

/**
 * Extracts all plain text from a binary PDF file buffer.
 * @param {Buffer} fileBuffer - The binary buffer data of the uploaded PDF file.
 * @returns {Promise<string>} The raw text extracted from the PDF pages.
 */
async function parsePDF(fileBuffer) {
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

module.exports = { parsePDF };