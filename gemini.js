const { GoogleGenAI } = require('@google/genai');

/**
 * Sends resume text to Gemini AI and requests a structured JSON roast.
 * @param {string} resumeText - The plain text extracted from the PDF resume.
 * @returns {Promise<object>} The parsed JSON roast response from Gemini.
 */
async function roastResume(resumeText) {
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
      contents: `Here is the resume text to roast:\n\n${resumeText}`,
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
