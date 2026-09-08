import React, { useState } from 'react';
import FeedbackCard from './FeedbackCard';

const UploadDropzone = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roastData, setRoastData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Handle when a file is picked from the computer explorer
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  // 2. Send the binary file data to our custom backend endpoint (/api/roast)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a PDF file first!');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setRoastData(null);

    try {
      // Send the file over the wire directly as a data stream
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
        },
        body: file,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong during the roast.');
      }

      // Collect the JSON format bundle sent back by Claude
      const data = await response.json();
      setRoastData(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-4">
      {/* Upload Container Box */}
      <form 
        onSubmit={handleUploadSubmit}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-8 hover:border-blue-400 transition-colors cursor-pointer"
      >
        <div className="text-4xl mb-3">📄</div>
        <p className="text-gray-600 font-medium text-center">
          {file ? `Selected: ${file.name}` : 'Upload your resume PDF'}
        </p>
        <p className="text-xs text-gray-400 mt-1 mb-4">Only PDF files are supported</p>

        {/* Hidden input field triggered by custom look */}
        <input 
          type="file" 
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-2.5 px-4 font-bold rounded-xl text-white transition-all shadow ${
            loading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
          }`}
        >
          {loading ? '🔥 Roasting your career choices...' : 'Roast My Resume!'}
        </button>
      </form>

      {/* ⚠️ Dynamic Error Box */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium">
          {errorMessage}
        </div>
      )}

      {/* 🎯 Result Display Area */}
      {roastData && <FeedbackCard feedback={roastData} />}
    </div>
  );
};

export default UploadDropzone;
