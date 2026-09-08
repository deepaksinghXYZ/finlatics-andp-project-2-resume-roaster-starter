import React from 'react';

/**
 * Renders the structured resume roast analysis received from Claude AI.
 * @param {object} props.feedback - The JSON roast object containing score, issues, and improvements.
 */
const FeedbackCard = ({ feedback }) => {
  // If the server hasn't sent any feedback data yet, don't show the card
  if (!feedback) return null;

  const { score, issues, improvements } = feedback;

  // Dynamically change color based on how good or bad the score is
  const getScoreColor = (num) => {
    if (num >= 80) return 'text-green-600 border-green-500';
    if (num >= 50) return 'text-yellow-600 border-yellow-500';
    return 'text-red-600 border-red-500';
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 bg-white border border-gray-200 rounded-xl shadow-md space-y-6">
      
      {/* 📊 Score Header Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">🔥 The Resume Roast</h2>
          <p className="text-sm text-gray-500 mt-1">Here is what the recruiter really thinks of your profile.</p>
        </div>
        <div className={`flex flex-col items-center justify-center w-20 h-20 border-4 rounded-full font-black text-2xl ${getScoreColor(score)}`}>
          {score}
          <span className="text-[10px] font-normal uppercase text-gray-400 -mt-1">/ 100</span>
        </div>
      </div>

      {/* ⚠️ Issues Section */}
      <div>
        <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
          ❌ What's Wrong (Issues)
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm pl-2">
          {issues && issues.map((issue, index) => (
            <li key={`issue-${index}`} className="leading-relaxed">{issue}</li>
          ))}
        </ul>
      </div>

      {/* 💡 Improvements Section */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
          ✅ How to Fix It (Improvements)
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm pl-2">
          {improvements && improvements.map((imp, index) => (
            <li key={`imp-${index}`} className="leading-relaxed">{imp}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default FeedbackCard;
