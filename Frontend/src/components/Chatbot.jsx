import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 I'm your Smart Library assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInput("");

    // Bot response logic (Real AI)
    setMessages(prev => [...prev, { sender: "bot", text: "..." }]); // Loading state
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: messages.map(m => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.text })) })
      });
      const data = await response.json();
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // remove loading
        return [...newMessages, { sender: "bot", text: data.reply }];
      });
    } catch (e) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // remove loading
        return [...newMessages, { sender: "bot", text: "Sorry, I lost connection to the server." }];
      });
    }
  };

  const options = ["How to book?", "What books are available?", "Library rules"];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-[0_4px_20px_rgba(5,150,105,0.4)] flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 group"
      >
        {isOpen ? (
          <span className="text-2xl font-bold">✕</span>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              Library Assistant
            </h3>
            <p className="text-emerald-100 text-xs mt-1">Ask me anything about the library!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === "user" ? "bg-emerald-600 text-white self-end rounded-br-none" : "bg-white text-gray-800 border border-gray-100 shadow-sm self-start rounded-bl-none whitespace-pre-line"}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          <div className="px-3 pb-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt)}
                className="whitespace-nowrap bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button
              onClick={() => handleSend()}
              className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
