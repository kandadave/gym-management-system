import React, { useState } from 'react';

const GymChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Your production webhook
  const N8N_WEBHOOK = 'https://n8n.banja.co.ke/webhook/website-chatbot';

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }), // ← KEY CHANGE: "prompt"
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { 
        role: 'bot', 
        text: data.output || data.answer || 'No response from bot.' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        role: 'bot', 
        text: `Connection failed: ${err.message}. Check internet or try later.` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // Minimized View
  if (isMinimized) {
    return (
      <div
        onClick={toggleMinimize}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#007bff',
          color: 'white',
          padding: '12px 18px',
          borderRadius: '50%',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}
      >
        
      </div>
    );
  }

  // Full Chat View
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        height: 540,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        fontFamily: 'system-ui, sans-serif',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        onClick={toggleMinimize}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '14px 16px',
          borderRadius: '16px 16px 0 0',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Gym Assistant</span>
        <span style={{ fontSize: '20px' }}>−</span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          overflowY: 'auto',
          background: '#f8f9fa',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#6c757d', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            Ask about hours, classes, pricing...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: '10px 0',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '80%',
                background: msg.role === 'user' ? '#007bff' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#212529',
                padding: '10px 14px',
                borderRadius: '18px',
                fontSize: '14.5px',
                lineHeight: '1.4',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'left', color: '#007bff', fontSize: '14px' }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ced4da',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default GymChatWidget;