import React, { useState } from 'react';

const GymChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const N8N_WEBHOOK = 'https://n8n.banja.co.ke/webhook/website-chatbot';

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const botMessage = { 
        role: 'bot', 
        text: data.output || 'No response.' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Connection failed: ${err.message}` 
      }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // === MINIMIZED BUBBLE WITH AI STARS ===
  if (isMinimized) {
    return (
      <div
        onClick={toggleMinimize}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 8px rgba(118, 75, 162, 0.2)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 4s infinite',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Twinkling Stars */}
        <div style={{ position: 'absolute', fontSize: '10px', animation: 'twinkle 3s infinite' }}>✨</div>
        <div style={{ position: 'absolute', fontSize: '8px', top: 10, left: 12, animation: 'twinkle 2.5s infinite 0.5s' }}>⭐</div>
        <div style={{ position: 'absolute', fontSize: '9px', bottom: 14, right: 10, animation: 'twinkle 3.5s infinite 1s' }}>✨</div>
        
        {/* AI Badge */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          color: '#764ba2',
          fontWeight: 'bold',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          AI
        </div>

        {/* Pulse Glow */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118,75,162,0.3) 0%, transparent 70%)',
          animation: 'glow 4s infinite',
        }} />
      </div>
    );
  }

  // === FULL CHAT VIEW (unchanged but cleaner) ===
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 380,
      height: 540,
      background: 'white',
      borderRadius: 16,
      boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
      fontFamily: 'system-ui, sans-serif',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    }}>
      {/* Header */}
      <div
        onClick={toggleMinimize}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '16px 16px 0 0',
          fontWeight: '600',
          fontSize: '17px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span> Gym Assistant ✨</span>
        <span style={{ fontSize: '24px', fontWeight: '300' }}>−</span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        background: '#f8f9fa',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '60px', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💪</div>
            <p style={{ fontSize: '15px' }}>Ask about hours, classes, or pricing!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: '12px 0',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div style={{
              display: 'inline-block',
              maxWidth: '82%',
              background: msg.role === 'user' ? '#667eea' : 'white',
              color: msg.role === 'user' ? 'white' : '#2d3748',
              padding: '12px 16px',
              borderRadius: '20px',
              fontSize: '15px',
              lineHeight: '1.5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: msg.role === 'bot' ? '1px solid #e2e8f0' : 'none',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'left', color: '#667eea', fontSize: '14px', fontWeight: '500' }}>
            Thinking
            <span style={{ animation: 'dots 1.5s infinite' }}>...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '12px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #cbd5e0',
            borderRadius: '24px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#cbd5e0'}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#764ba2'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
        >
          {loading ? '⏳' : 'Send'}
        </button>
      </div>
    </div>
  );
};

// === CSS ANIMATIONS (Add to your <head> or global CSS) ===
const style = document.createElement('style');
style.innerHTML = `
@keyframes pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 8px rgba(118, 75, 162, 0.2); }
  50% { box-shadow: 0 12px 48px rgba(102, 126, 234, 0.6), 0 0 0 12px rgba(118, 75, 162, 0.3); }
}
@keyframes glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80%, 100% { content: ''; }
}
`;
document.head.appendChild(style);

export default GymChatWidget;