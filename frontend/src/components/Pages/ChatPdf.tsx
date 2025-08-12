import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, DragEvent } from 'react';
import { Send, Upload, FileText, MessageSquare, Loader2, X, Paperclip, Bot, User, AlertCircle } from 'lucide-react';

type MessageType = 'user' | 'bot' | 'system' | 'error';

interface Message {
  id: number;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface DocumentInfo {
  docId: string;
  filename: string;
  size: number;
  pages: number;
  textLength: number;
}

const ChatPdf: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  
  const API_BASE =`${import.meta.env.VITE_API_BASE_URL}`;

  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Welcome! Upload a PDF document to start chatting with it. I can help you analyze, summarize, and answer questions about your document.',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: MessageType, content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum allowed size is 10MB.');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadedFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/pdf/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.success) {
        setDocumentInfo(data.data);
        addMessage('system', `📄 Document uploaded successfully: ${file.name} (${data.data.pages} pages, ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        addMessage('bot', `Great! I've processed your document "${file.name}". You can now ask me questions about it, request summaries, or explore specific topics. What would you like to know?`);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload PDF');
      setUploadedFile(null);
      setDocumentInfo(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileUpload(file);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !documentInfo || isLoading) return;

    const userMessage = addMessage('user', inputMessage);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/pdf/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          docId: documentInfo.docId,
          message: currentMessage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }

      if (data.success) {
        addMessage('bot', data.data.message);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      addMessage('error', `Sorry, I encountered an error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setDocumentInfo(null);
    setError('');
    setMessages(prev => prev.filter(msg => msg.type === 'bot' && msg.id === 1));
  };

  const handleQuickAction = (action: string) => {
    if (documentInfo) {
      setInputMessage(action);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Chat PDF</h1>
              <p className="text-sm text-gray-500">AI-powered document assistant</p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        <div className="p-6">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop your PDF here
              </p>
              <p className="text-xs text-gray-400 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-2">Max size: 10MB</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {documentInfo ? `${documentInfo.pages} pages • ` : ''}
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {isUploading && (
                <div className="mt-3 flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500 mr-2" />
                  <span className="text-sm text-blue-600">Processing document...</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {[
              'Summarize this document',
              'Extract key points',
              'What is this document about?',
              'List the main topics covered'
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={!documentInfo}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">
              {uploadedFile ? `Chatting with ${uploadedFile.name}` : 'Upload a PDF to start chatting'}
            </h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl flex space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-blue-600'
                      : message.type === 'bot'
                      ? 'bg-gray-600'
                      : message.type === 'error'
                      ? 'bg-red-600'
                      : 'bg-green-600'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : message.type === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Paperclip className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'system'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user'
                        ? 'text-blue-100'
                        : message.type === 'system'
                        ? 'text-green-600'
                        : message.type === 'error'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl flex space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Analyzing document...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  documentInfo
                    ? "Ask me anything about your document..."
                    : "Upload a PDF document first to start chatting"
                }
                disabled={!documentInfo}
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                rows={2}
                maxLength={1000}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !documentInfo || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>{inputMessage.length}/1000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPdf;