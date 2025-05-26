import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Send, User, Bot, Download, FileText, Upload } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { cvAPI } from "../../services/api";

const Message = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? "ml-2 bg-primary" : "mr-2 bg-accent"
          }`}
        >
          {isUser ? (
            <User size={16} className='text-white' />
          ) : (
            <Bot size={16} className='text-white' />
          )}
        </div>

        <div
          className={`p-3 rounded-2xl border-2 border-black ${
            isUser ? "bg-primary/10" : "bg-accent/10"
          } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
        >
          <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired,
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
};

const AIChat = ({ cvText, className = "" }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your CV AI assistant. I can help you improve your CV, prepare for interviews, or give career advice. What would you like help with today?",
      isUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedCV, setUploadedCV] = useState(cvText || null);
  const [fileName, setFileName] = useState(null);
  const [language, setLanguage] = useState("id");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await cvAPI.aiChat({
        message: newMessage,
        cvText: uploadedCV,
        fileName: fileName,
        language: language,
      });

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text:
          response.data.data.message ||
          "Maaf, AI tidak bisa memproses permintaan Anda.",
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("AI chat error:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi error. Silakan coba lagi nanti.",
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);

      const response = await cvAPI.analyzeUploadedCV(file);
      if (response.data && response.data.data && response.data.data.text) {
        setUploadedCV(response.data.data.text);
        setFileName(file.name);

        const aiResponse = {
          id: Date.now().toString(),
          text: "CV Anda berhasil dianalisis! Sekarang Anda bisa konsultasi dengan AI.",
          isUser: false,
        };

        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }
    } catch (error) {
      console.error("CV upload error:", error);

      const errorMessage = {
        id: Date.now().toString(),
        text: "CV gagal diproses. Pastikan format PDF/DOCX dan coba lagi.",
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionMessages = [
    "How can I improve my CV?",
    "What skills should I highlight for a developer role?",
    "Help me prepare for an interview",
    "What career paths can I explore with my background?",
  ];

  return (
    <Card className={`${className}`}>
      <h2 className='text-2xl font-heading font-bold mb-6'>
        AI Career Assistant
      </h2>

      <div className='flex flex-col h-[500px]'>
        {/* Messages container */}
        <div className='flex-1 overflow-y-auto mb-4 px-2'>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Message message={message} isUser={message.isUser} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className='flex justify-start mb-4'>
              <div className='flex'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center bg-accent mr-2'>
                  <Bot size={16} className='text-white' />
                </div>

                <div className='p-3 rounded-2xl border-2 border-black bg-accent/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]'>
                  <div className='flex space-x-2'>
                    <div
                      className='w-2 h-2 bg-accent rounded-full animate-bounce'
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-accent rounded-full animate-bounce'
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-accent rounded-full animate-bounce'
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CV status indicator */}
        {!uploadedCV && (
          <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 flex items-center justify-between'>
            <div className='flex items-center'>
              <FileText size={18} className='text-gray-500 mr-2' />
              <span className='text-sm text-gray-600'>
                Upload your CV for personalized advice
              </span>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,.docx'
              onChange={handleFileChange}
              className='hidden'
            />

            <Button
              variant='outline'
              onClick={handleFileUpload}
              className='text-xs px-3 py-1'
            >
              <Upload size={14} className='mr-1' />
              Upload
            </Button>
          </div>
        )}

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className='mb-3 flex flex-wrap gap-2'>
            {suggestionMessages.map((suggestion, index) => (
              <button
                key={index}
                className='bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-xl border border-gray-300'
                onClick={() => {
                  setNewMessage(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Message input */}
        <div className='relative'>
          <textarea
            className='w-full px-4 py-3 pr-12 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-accent focus:outline-none focus:shadow-none'
            placeholder='Type your message...'
            rows='2'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <Button
            variant='primary'
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            className='absolute right-2 bottom-2 p-2 min-w-0'
          >
            <Send size={20} />
          </Button>
        </div>

        {/* Language dropdown */}
        <div className='mb-2 flex gap-2 items-center'>
          <label htmlFor='language' className='text-xs text-gray-600'>
            Bahasa:
          </label>
          <select
            id='language'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='border rounded px-2 py-1 text-xs'
          >
            <option value='id'>Indonesia</option>
            <option value='en'>English</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

AIChat.propTypes = {
  cvText: PropTypes.string,
  className: PropTypes.string,
};

export default AIChat;
