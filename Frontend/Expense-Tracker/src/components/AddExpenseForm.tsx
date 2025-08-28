import React, { useState ,useRef, useEffect} from 'react';
import { Plus, Mic, Camera,Square } from 'lucide-react';

interface AddExpenseFormProps {
  onAddExpense: (expense: any) => void;
}
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    merchant: '',
    location: '',
    description: '',
    paymentMethod: 'Credit Card'
  });

  const [isListening,setIsListening]= useState(false)
  const [detectedField,setDetectedField]=useState<string | null>(null);
  const recognitionRef=useRef<any>(null);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Utilities',
    'Travel',
    'Other'
  ];

  const paymentMethods = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Digital Wallet', label: 'Digital Wallet' },
    { value: 'Other', label: 'Other' }
  ];

  // Function to intelligently parse speech and fill multiple fields
  const parseSpeechInput = (transcript: string): Partial<typeof formData> => {
    const lowerTranscript = transcript.toLowerCase().trim();
    const updates: Partial<typeof formData> = {};
    
    // Extract amount (numbers, currency words)
    if (/\d+\.?\d*/g.test(transcript)) {
      const numbers = transcript.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        let amount = numbers[0];
        // Handle common currency patterns
        if (lowerTranscript.includes('dollar') || lowerTranscript.includes('dollars') || lowerTranscript.includes('buck') || lowerTranscript.includes('bucks')) {
          amount = numbers[0];
        } else if (lowerTranscript.includes('cent') || lowerTranscript.includes('cents')) {
          // Convert cents to dollars
          amount = (parseFloat(numbers[0]) / 100).toString();
        }
        
        // Clean up the amount
        if (amount.endsWith('.')) {
          amount = amount.slice(0, -1);
        }
        
        if (amount && !isNaN(parseFloat(amount))) {
          updates.amount = amount;
        }
      }
    }
    
    // Handle natural language for categories with more flexible matching
    const categoryPatterns = {
      'Food & Dining': [
        'food', 'dining', 'restaurant', 'meal', 'lunch', 'dinner', 'breakfast', 'snack', 'coffee', 'tea', 'drink', 'beverage',
        'pizza', 'burger', 'sandwich', 'salad', 'sushi', 'chinese', 'italian', 'mexican', 'indian', 'fast food', 'takeout',
        'cafe', 'bakery', 'bar', 'pub', 'grill', 'steakhouse', 'seafood', 'bbq', 'barbecue', 'deli', 'food truck'
      ],
      'Transportation': [
        'transport', 'transportation', 'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'subway', 'metro', 'gas', 'fuel', 'parking',
        'toll', 'maintenance', 'repair', 'car', 'vehicle', 'drive', 'driving', 'commute'
      ],
      'Shopping': [
        'shopping', 'shop', 'store', 'mall', 'clothes', 'clothing', 'shoes', 'accessories', 'electronics', 'gadgets', 'books',
        'amazon', 'walmart', 'target', 'costco', 'online', 'purchase', 'buy', 'bought'
      ],
      'Entertainment': [
        'entertainment', 'movie', 'cinema', 'theater', 'concert', 'show', 'game', 'gaming', 'netflix', 'spotify', 'hulu',
        'disney', 'youtube', 'music', 'streaming', 'subscription', 'fun', 'leisure'
      ],
      'Healthcare': [
        'health', 'healthcare', 'medical', 'doctor', 'dentist', 'pharmacy', 'medicine', 'prescription', 'hospital', 'clinic',
        'therapy', 'treatment', 'insurance', 'wellness', 'fitness', 'gym', 'exercise'
      ],
      'Utilities': [
        'utility', 'utilities', 'electricity', 'electric', 'gas', 'water', 'internet', 'wifi', 'phone', 'mobile', 'cable',
        'tv', 'television', 'bill', 'monthly', 'rent', 'mortgage', 'home', 'house'
      ],
      'Travel': [
        'travel', 'trip', 'vacation', 'holiday', 'flight', 'airplane', 'hotel', 'lodging', 'accommodation', 'tourism',
        'tour', 'sightseeing', 'adventure', 'explore', 'visit', 'destination'
      ]
    };
    
    // Check for categories first (priority over merchant detection)
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => lowerTranscript.includes(pattern))) {
        updates.category = category;
        break;
      }
    }
    
    // Handle payment methods with natural language
    const paymentPatterns = {
      'Credit Card': ['credit', 'credit card', 'visa', 'mastercard', 'amex', 'american express'],
      'Debit Card': ['debit', 'debit card', 'checking', 'bank card'],
      'Cash': ['cash', 'money', 'bills', 'physical money'],
      'Bank Transfer': ['bank', 'transfer', 'wire', 'ach', 'direct deposit', 'banking'],
      'Digital Wallet': ['wallet', 'digital wallet', 'paypal', 'venmo', 'apple pay', 'google pay', 'zelle']
    };
    
    for (const [method, patterns] of Object.entries(paymentPatterns)) {
      if (patterns.some(pattern => lowerTranscript.includes(pattern))) {
        updates.paymentMethod = method;
        break;
      }
    }
    
    // Handle location with natural language patterns
    const locationIndicators = [
      'location', 'place', 'city', 'town', 'street', 'avenue', 'road', 'address', 'area', 'neighborhood',
      'new york', 'los angeles', 'chicago', 'miami', 'boston', 'seattle', 'denver', 'atlanta', 'dallas',
      'san francisco', 'philadelphia', 'phoenix', 'san antonio', 'san diego', 'austin', 'jacksonville'
    ];
    
    for (const indicator of locationIndicators) {
      if (lowerTranscript.includes(indicator)) {
        updates.location = indicator;
        break;
      }
    }
    
    // Handle merchant/store names with natural language
    const merchantPatterns = [
      'starbucks', 'mcdonalds', 'walmart', 'target', 'amazon', 'costco', 'best buy', 'home depot', 'lowes',
      'cvs', 'walgreens', 'rite aid', 'dollar general', 'dollar tree', 'kroger', 'safeway', 'whole foods',
      'trader joes', 'aldi', 'lidl', 'ikea', 'h&m', 'zara', 'gap', 'old navy', 'nike', 'adidas'
    ];
    
    for (const merchant of merchantPatterns) {
      if (lowerTranscript.includes(merchant)) {
        updates.merchant = merchant;
        break;
      }
    }
    
    // Handle natural language descriptions
    if (lowerTranscript.includes('for') || lowerTranscript.includes('because') || lowerTranscript.includes('reason') || 
        lowerTranscript.includes('note') || lowerTranscript.includes('memo') || lowerTranscript.includes('comment')) {
      updates.description = transcript.trim();
    }
    
    // Smart field detection based on transcript characteristics
    // Only set merchant if category is already detected and no specific merchant was found
    if (!updates.merchant && !updates.category && transcript.length < 15 && !/\d/.test(transcript)) {
      // Short text without numbers is likely a merchant name
      updates.merchant = transcript.trim();
    } else if (!updates.description && (transcript.length > 20 || lowerTranscript.includes('because') || lowerTranscript.includes('for'))) {
      // Longer text or explanatory text is likely a description
      updates.description = transcript.trim();
    }
    
    // Default fallback - try to intelligently assign merchant if not already set
    if (!updates.merchant && (lowerTranscript.includes('store') || lowerTranscript.includes('shop') || lowerTranscript.includes('place'))) {
      updates.merchant = transcript.trim();
    }
    
    return updates;
  };

  // Function to detect which field the speech should go to (kept for backward compatibility)
  const detectField = (transcript: string): { field: string; value: string } | null => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Handle natural language patterns for amounts
    if (/\d+\.?\d*/g.test(transcript)) {
      // Extract all numbers from transcript
      const numbers = transcript.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        let amount = numbers[0];
        // Handle common currency patterns
        if (lowerTranscript.includes('dollar') || lowerTranscript.includes('dollars') || lowerTranscript.includes('buck') || lowerTranscript.includes('bucks')) {
          amount = numbers[0];
        } else if (lowerTranscript.includes('cent') || lowerTranscript.includes('cents')) {
          // Convert cents to dollars
          amount = (parseFloat(numbers[0]) / 100).toString();
        }
        
        // Clean up the amount
        if (amount.endsWith('.')) {
          amount = amount.slice(0, -1);
        }
        
        if (amount && !isNaN(parseFloat(amount))) {
          return { field: 'amount', value: amount };
        }
      }
    }
    
    // Handle natural language for categories with more flexible matching
    const categoryPatterns = {
      'Food & Dining': [
        'food', 'dining', 'restaurant', 'meal', 'lunch', 'dinner', 'breakfast', 'snack', 'coffee', 'tea', 'drink', 'beverage',
        'pizza', 'burger', 'sandwich', 'salad', 'sushi', 'chinese', 'italian', 'mexican', 'indian', 'fast food', 'takeout'
      ],
      'Transportation': [
        'transport', 'transportation', 'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'subway', 'metro', 'gas', 'fuel', 'parking',
        'toll', 'maintenance', 'repair', 'car', 'vehicle', 'drive', 'driving', 'commute'
      ],
      'Shopping': [
        'shopping', 'shop', 'store', 'mall', 'clothes', 'clothing', 'shoes', 'accessories', 'electronics', 'gadgets', 'books',
        'amazon', 'walmart', 'target', 'costco', 'online', 'purchase', 'buy', 'bought'
      ],
      'Entertainment': [
        'entertainment', 'movie', 'cinema', 'theater', 'concert', 'show', 'game', 'gaming', 'netflix', 'spotify', 'hulu',
        'disney', 'youtube', 'music', 'streaming', 'subscription', 'fun', 'leisure'
      ],
      'Healthcare': [
        'health', 'healthcare', 'medical', 'doctor', 'dentist', 'pharmacy', 'medicine', 'prescription', 'hospital', 'clinic',
        'therapy', 'treatment', 'insurance', 'wellness', 'fitness', 'gym', 'exercise'
      ],
      'Utilities': [
        'utility', 'utilities', 'electricity', 'electric', 'gas', 'water', 'internet', 'wifi', 'phone', 'mobile', 'cable',
        'tv', 'television', 'bill', 'monthly', 'rent', 'mortgage', 'home', 'house'
      ],
      'Travel': [
        'travel', 'trip', 'vacation', 'holiday', 'flight', 'airplane', 'hotel', 'lodging', 'accommodation', 'tourism',
        'tour', 'sightseeing', 'adventure', 'explore', 'visit', 'destination'
      ]
    };
    
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => lowerTranscript.includes(pattern))) {
        return { field: 'category', value: category };
      }
    }
    
    // Handle payment methods with natural language
    const paymentPatterns = {
      'Credit Card': ['credit', 'credit card', 'visa', 'mastercard', 'amex', 'american express'],
      'Debit Card': ['debit', 'debit card', 'checking', 'bank card'],
      'Cash': ['cash', 'money', 'bills', 'physical money'],
      'Bank Transfer': ['bank', 'transfer', 'wire', 'ach', 'direct deposit', 'banking'],
      'Digital Wallet': ['wallet', 'digital wallet', 'paypal', 'venmo', 'apple pay', 'google pay', 'zelle']
    };
    
    for (const [method, patterns] of Object.entries(paymentPatterns)) {
      if (patterns.some(pattern => lowerTranscript.includes(pattern))) {
        return { field: 'paymentMethod', value: method };
      }
    }
    
    // Handle location with natural language patterns
    const locationIndicators = [
      'location', 'place', 'city', 'town', 'street', 'avenue', 'road', 'address', 'area', 'neighborhood',
      'new york', 'los angeles', 'chicago', 'miami', 'boston', 'seattle', 'denver', 'atlanta', 'dallas',
      'san francisco', 'philadelphia', 'phoenix', 'san antonio', 'san diego', 'austin', 'jacksonville'
    ];
    
    if (locationIndicators.some(indicator => lowerTranscript.includes(indicator))) {
      // Extract the location part
      const locationMatch = locationIndicators.find(indicator => lowerTranscript.includes(indicator));
      if (locationMatch) {
        return { field: 'location', value: locationMatch };
      }
      return { field: 'location', value: transcript.trim() };
    }
    
    // Handle merchant/store names with natural language
    const merchantPatterns = [
      'starbucks', 'mcdonalds', 'walmart', 'target', 'amazon', 'costco', 'best buy', 'home depot', 'lowes',
      'cvs', 'walgreens', 'rite aid', 'dollar general', 'dollar tree', 'kroger', 'safeway', 'whole foods',
      'trader joes', 'aldi', 'lidl', 'ikea', 'h&m', 'zara', 'gap', 'old navy', 'nike', 'adidas'
    ];
    
    for (const merchant of merchantPatterns) {
      if (lowerTranscript.includes(merchant)) {
        return { field: 'merchant', value: merchant };
      }
    }
    
    // Handle natural language descriptions
    if (lowerTranscript.includes('for') || lowerTranscript.includes('because') || lowerTranscript.includes('reason') || 
        lowerTranscript.includes('note') || lowerTranscript.includes('memo') || lowerTranscript.includes('comment')) {
      return { field: 'description', value: transcript.trim() };
    }
    
    // Smart field detection based on transcript characteristics
    if (transcript.length < 15 && !/\d/.test(transcript)) {
      // Short text without numbers is likely a merchant name
      return { field: 'merchant', value: transcript.trim() };
    } else if (transcript.length > 20 || lowerTranscript.includes('because') || lowerTranscript.includes('for')) {
      // Longer text or explanatory text is likely a description
      return { field: 'description', value: transcript.trim() };
    } else if (/\d/.test(transcript) && transcript.length < 10) {
      // Short text with numbers might be amount
      const numberMatch = transcript.match(/\d+\.?\d*/);
      if (numberMatch) {
        return { field: 'amount', value: numberMatch[0] };
      }
    }
    
    // Default fallback - try to intelligently assign
    if (lowerTranscript.includes('store') || lowerTranscript.includes('shop') || lowerTranscript.includes('place')) {
      return { field: 'merchant', value: transcript.trim() };
    }
    
    // If still unclear, default to merchant for short text, description for long text
    return transcript.length < 20 ? 
      { field: 'merchant', value: transcript.trim() } : 
      { field: 'description', value: transcript.trim() };
  };

  useEffect(()=>{
    if ('webkitSpeechRecognition' in window ||'SpeechRecognition' in window){
      const SpeechReconition=window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current=new SpeechReconition()
      recognitionRef.current.continuous=true;
      recognitionRef.current.interimResults=true;
      recognitionRef.current.lang='en-US';
      recognitionRef.current.onresult=(event:any)=>{
        let transcript="";
        for(let i=event.resultIndex;i<event.results.length;i++){
          if(event.results[i].isFinal){
            transcript+=event.results[i][0].transcript;
          }
        }
        if(transcript!==''){
          // Use the new intelligent parsing function to fill multiple fields
          const updates = parseSpeechInput(transcript);
          console.log('Speech transcript:', transcript);
          console.log('Detected updates:', updates);
          if (Object.keys(updates).length > 0) {
            setFormData(prev => ({
              ...prev,
              ...updates
            }));
            
            // Show which fields were detected
            const detectedFields = Object.keys(updates);
            if (detectedFields.length === 1) {
              setDetectedField(detectedFields[0]);
            } else {
              setDetectedField(`Multiple fields: ${detectedFields.join(', ')}`);
            }
          }
        }
      };
      recognitionRef.current.onerror=(event:any)=>{
        console.log('Speech recognition error',event.error);
        if(event.error=='not-allowed'){
          alert('Microphone access is not allowed.Please enable the permission');
        }
        stopListening();
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setDetectedField(null);
      };
    }
    return()=>{
      if(recognitionRef.current){
        recognitionRef.current.stop();
      }
    }
  },[])

const startListening=()=>{
  if (isListening){
    stopListening();
    return;
  }
  try{
    if(recognitionRef.current){
      recognitionRef.current.start();
      setIsListening(true);
    }
  }catch(error){
    console.log("Speech Recognition failed",error);
  }
};

const stopListening=()=>{
  if (recognitionRef.current){
    recognitionRef.current.stop();
  }
  setIsListening(false);
  setDetectedField(null);
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.merchant) {
      onAddExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        amount: '',
        category: '',
        merchant: '',
        location: '',
        description: '',
        paymentMethod: 'Credit Card'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <Plus className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Add New Expense</h3>
      </div>
      <p className="text-slate-400 text-sm mb-6">Track your spending with AI-powered fraud detection</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Merchant
            </label>
            <input
              type="text"
              name="merchant"
              placeholder="e.g., Starbucks"
              value={formData.merchant}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., New York, NY"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Optional description..."
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Add Expense
          </button>
          
          {/* Single Microphone Button */}
          <button
            type="button"
            onClick={startListening}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title="Voice input - Just speak naturally!"
          >
            {isListening ? (
              <Square className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-slate-300" />
            )}
          </button>

          <button
            type="button"
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Input Status */}
        {isListening && (
          <div className="text-center p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 text-sm">
              🎤 Listening... Speak naturally!
              <br />
              <span className="text-xs">
                Examples: "25 dollars for lunch at Starbucks", "Coffee shop 5 bucks", "Uber ride 15 dollars", "Netflix subscription"
                <br />
                <strong>💡 Tip: Say everything at once to fill multiple fields automatically!</strong>
              </span>
            </p>
          </div>
        )}

        {/* Show which field was detected */}
        {detectedField && !isListening && (
          <div className="text-center p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              ✅ Detected: <span className="font-semibold">{detectedField}</span> field
            </p>
          </div>
        )}
      </form>
    </div>
  );
}