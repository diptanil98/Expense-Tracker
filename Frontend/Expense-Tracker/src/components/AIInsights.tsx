import  { useState } from 'react';
import { Brain, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';

export function AIInsights() {
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState<Array<{id: string, question: string, answer: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAskAI = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5678/webhook/8ea9acbb-c1f5-4b58-ba22-1e2e0da46f3b/chat', {
  chatInput: question.trim(),  
  sessionId: `${user?.id || "guest"}`, 
  timestamp: new Date().toISOString()
}, {
  headers: {
    'Content-Type': 'application/json',
  }
});

console.log("AI Service Response:", response.data);

    const aiAnswer =
  response.data?.output || // case 1
  response.data?.generations?.[0]?.[0]?.text || // case 2
  response.data?.answer ||
  response.data?.insight ||
  "Received response from AI service";


const newConversation = {
  id: Date.now().toString(),
  question: question,
  answer: aiAnswer
};


      setConversations([...conversations, newConversation]);
      setQuestion('');

    } catch (err) {
      console.error('Error calling AI service:', err);
      setError('Failed to get AI insights. Please try again.');

      
      const newConversation = {
        id: Date.now().toString(),
        question: question,
        answer: "Based on your spending patterns, I can provide insights about your financial habits. This is a demo response - the AI service is currently unavailable."
      };

      setConversations([...conversations, newConversation]);
      setQuestion('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAskAI();
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Financial Advisor</h3>
      </div>
      
      <p className="text-slate-400 text-sm mb-6">Get personalized insights about your spending habits</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

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
          onKeyPress={handleKeyPress}
          placeholder="Ask about your spending... e.g., 'How much did I spend on food this month?'" 
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          disabled={isLoading}
        />
        <button 
          onClick={handleAskAI} 
          disabled={isLoading || !question.trim()}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2" 
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}