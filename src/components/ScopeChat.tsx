'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './Button';
import { bookCallHref } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';
import styles from './ScopeChat.module.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ScopeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi. I'm RuleRev's AI project advisor (powered by Claude). What are you building, and what problem do you need help with?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Check if we should show CTA (if assistant mentions Founder Launch Pack, Compliance-Ready, or Cloud Architecture Advisory)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const content = lastMessage.content.toLowerCase();
      if (
        content.includes('founder launch pack') ||
        content.includes('compliance-ready website retrofit') ||
        content.includes('cloud architecture advisory') ||
        content.includes('book a 30-minute discovery call') ||
        content.includes('book a discovery call') ||
        content.includes('discovery call')
      ) {
        setShowCTA(true);
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      if (!res.body) {
        throw new Error('No response body');
      }

      // Add empty assistant message that will be streamed into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantContent += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantContent;
                  return updated;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data', e);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again or reach out directly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages_area}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.msg_user_wrapper : styles.msg_assistant_wrapper}>
            <div className={msg.role === 'user' ? styles.msg_user : styles.msg_assistant}>
              {msg.content.split('\\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: idx === msg.content.split('\\n').length - 1 ? 0 : '8px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={styles.msg_assistant_wrapper}>
            <div className={styles.msg_assistant}>
              <div className={styles.typing_indicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        {showCTA && !isLoading && (
          <div className={styles.cta_wrapper}>
            <p className={styles.cta_text}>Ready to take the next step?</p>
            <div className={styles.cta_actions}>
              <Button href={bookCallHref()} variant="accent" external>
                Book a discovery call
              </Button>
              <Button href={whatsappLink('scope_project')} variant="secondary" external>
                WhatsApp Nathi
              </Button>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles.input_area}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" disabled={!input.trim() || isLoading} className={styles.submit_btn} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
        <div className={styles.watermark}>
          Powered by Claude
        </div>
      </div>
    </div>
  );
}
