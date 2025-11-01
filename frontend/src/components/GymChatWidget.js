import React, { useState } from 'react';

const GymChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const N8N_WEBHOOK = 'https://n8n.banja.co.ke/webhook/website-chatbot';  // Your production URL

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Network error');
      }

      const data = await res.json();
      const botMsg = { role: 'bot', text: data.answer || 'No answer received.' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { role: 'bot', text: `Error: ${err.message}. Try again or contact support.` };
      setMessages(prev => [...prev, errMsg]);
    }

    setInput('');
    setLoading(false);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  if (isMinimized) {
    return (
      <div style={{
        position: 'fixed', bottom: 20, right: 20,
        background: '#007bff', color: 'white', padding: '10px 15px',
        borderRadius: 25, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000, fontSize: 14, fontWeight: 'bold'
      }} onClick={toggleMinimize}>
        💬 Gym Assistant
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      width: 380, height: 520,
      background: 'white', border: '1px solid #ddd',
      borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif', zIndex: 1000
    }}>
      <div style={{
        background: '#007bff', color: 'white', padding: 12,
        borderRadius: '12px 12px 0 0', fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }} onClick={toggleMinimize}>
        <span>Gym Assistant</span>
        <span style={{ fontSize: 18 }}>-</span>  {/* Minimize icon */}
      </div>

      <div style={{
        height: 380, overflowY: 'auto', padding: 10,
        background: '#f9f9f9'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#666', fontSize: 14, textAlign: 'center', marginTop: 50 }}>
            Ask about hours, pricing, classes...
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block',
              maxWidth: '80%',
              background: m.role === 'user' ? '#007bff' : '#e9ecef',
              color: m.role === 'user' ? 'white' : 'black',
              padding: '10px 14px',
              borderRadius: 18,
              fontSize: 14
            }}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: '#007bff', textAlign: 'center' }}>Thinking...</div>}
      </div>

      <div style={{ padding: 10, borderTop: '1px solid #eee', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '10px 12px',
            border: '1px solid #ddd', borderRadius: 20,
            fontSize: 14
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: 8, padding: '10px 16px',
            background: '#007bff', color: 'white',
            border: 'none', borderRadius: 20,
            cursor: 'pointer'
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default GymChatWidget;