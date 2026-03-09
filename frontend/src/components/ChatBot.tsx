import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  translationKey?: string;
}

interface ChatBotProps {
  currentLanguage?: string;
}

const ChatBot: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbotGreeting'),
      translationKey: 'chatbotGreeting',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    t('quickTopics'),
    t('cropSuggestions') || 'Crop suggestions',
    t('diseaseIdentification') || 'Disease identification',
    t('weatherForecast') || 'Weather forecast',
    t('marketPrices') || 'Market prices',
    t('fertilizerRecommendations') || 'Fertilizer recommendations'
  ];

  // Update the initial greeting message when language changes
  useEffect(() => {
    setMessages(prev => {
      // update any bot messages that have translationKey set
      return prev.map(m => {
        if (m.sender === 'bot' && m.translationKey) {
          return { ...m, text: t(m.translationKey) };
        }
        return m;
      });
    });
  }, [currentLanguage]);

  const scrollToBottom = () => {
    // Prefer scrolling the container for better control, fall back to end ref
    if (messagesContainerRef.current) {
      try {
        messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
        return;
      } catch {
        // fallback
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // small timeout helps when content/layout changes
    const id = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(id);
  }, [messages]);

  const generateBotResponse = (userMessage: string): { key: string; text: string } => {
    const lowerMessage = userMessage.toLowerCase();

    let key = 'botResponses.default';
    if (lowerMessage.includes('crop') || lowerMessage.includes('suggest')) {
      key = 'botResponses.cropSuggestions';
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('pest')) {
      key = 'botResponses.diseaseIdentification';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      key = 'botResponses.weatherForecast';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      key = 'botResponses.marketPrices';
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      key = 'botResponses.fertilizerRecommendations';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      key = 'botResponses.greeting';
    } else if (lowerMessage.includes('thank')) {
      key = 'botResponses.thanks';
    }

    return { key, text: t(key) };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const response = generateBotResponse(inputMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        translationKey: response.key,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open chat"
        title="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -left-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white p-2 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 p-1 rounded-full">
                <Bot className="w-3 h-3" />
              </div>
              <h3 className="text-sm font-medium">AgriSmart Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30 transition-colors"
              aria-label="Close chat"
              title="Close chat"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-3 pb-2">
              <div className="text-xs text-gray-500 mb-2">{t('quickTopics')}</div>
              <div className="flex flex-wrap gap-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full hover:bg-green-200 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('askPlaceholder')}
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '80px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
                title="Send message"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;