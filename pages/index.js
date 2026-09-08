import React from 'react';
import UploadDropzone from '../UploadDropzone';
import Header from '../Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">
      {/* 1. Global Navigation Header Banner */}
      <Header />
      
      {/* 2. Main Centered Workspace Canvas */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        
        {/* Marketing Hero Text Blocks */}
        <div className="text-center max-w-2xl mb-8 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Resume Roaster AI
          </h1>
          <p className="text-base text-gray-500 font-medium">
            Upload your resume PDF file below. Our brutally honest Gemini AI model will dissect your layout, grammar, and metrics metrics to give you a harsh score and explicit improvements.
          </p>
        </div>

        {/* 3. Dropzone Component (Handles upload stream -> passes results to FeedbackCard) */}
        <UploadDropzone />

      </main>

      {/* Footer Banner */}
      <footer className="w-full text-center py-6 text-xs text-gray-400 border-t border-gray-200 bg-white mt-auto">
        ⚡ Powered by Google Gemini Pro & Next.js Framework
      </footer>
    </div>
  );
}