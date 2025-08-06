import React, { useState } from 'react';
import { Brain, Send } from 'lucide-react';

export function AIInsights() {
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState<Array<{id: string, question: string, answer: string}>>([]);

  const handleAskAI = () => {
    if (question.trim()) {
      const newConversation = {
        id: Date.now().toString(),
        question: question,
        answer: "Based on your spending patterns, I can provide insights about your financial habits. This is a demo response - in a real application, this would connect to an AI service to analyze your expense data and provide personalized recommendations."
      };
      
      setConversations([...conversations, newConversation]);
      setQuestion('');
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Financial Advisor</h3>
      </div>
      <p className="text-slate-400 text-sm mb-6">Get personalized insights about your spending habits</p>

      {conversations.length > 0 && (
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {conversations.map((conv) => (
            <div key={conv.id} className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 font-medium">You asked:</p>
                <p className="text-white mt-1">{conv.question}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-300 font-medium">AI Advisor:</p>
                <p className="text-slate-300 mt-1">{conv.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex space-x-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
          placeholder="Ask about your spending... e.g., 'How much did I spend on food this month?'"
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
        />
        <button
          onClick={handleAskAI}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Ask AI</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}