'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Share,
  Settings,
  Users,
  FileText,
  Monitor,
  Maximize,
  Minimize,
  Circle,
  Upload,
  Download,
  User,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'client' | 'lawyer' | 'notary';
  avatar?: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface ConsultationDetails {
  id: string;
  title: string;
  scheduledTime: Date;
  duration: number; // in minutes
  participants: Participant[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  recordingEnabled: boolean;
  documentSharing: boolean;
}

const mockConsultation: ConsultationDetails = {
  id: 'CONS001',
  title: 'Property Sale Agreement Review',
  scheduledTime: new Date(),
  duration: 60,
  participants: [
    {
      id: 'client1',
      name: 'Rajesh Kumar',
      role: 'client',
      isVideoOn: true,
      isAudioOn: true,
      isOnline: true
    },
    {
      id: 'lawyer1',
      name: 'Advocate Priya Sharma',
      role: 'lawyer',
      isVideoOn: true,
      isAudioOn: true,
      isOnline: true
    },
    {
      id: 'notary1',
      name: 'Notary Suresh Gupta',
      role: 'notary',
      isVideoOn: false,
      isAudioOn: true,
      isOnline: true
    }
  ],
  status: 'ongoing',
  recordingEnabled: true,
  documentSharing: true
};

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'system',
    senderName: 'System',
    message: 'Consultation started',
    timestamp: new Date(Date.now() - 300000),
    type: 'system'
  },
  {
    id: '2',
    senderId: 'lawyer1',
    senderName: 'Advocate Priya Sharma',
    message: 'Good morning everyone. I have reviewed the property documents.',
    timestamp: new Date(Date.now() - 240000),
    type: 'text'
  },
  {
    id: '3',
    senderId: 'client1',
    senderName: 'Rajesh Kumar',
    message: 'Thank you. Are there any issues we need to address?',
    timestamp: new Date(Date.now() - 180000),
    type: 'text'
  }
];

export default function VideoConsultation() {
  const [consultation] = useState<ConsultationDetails>(mockConsultation);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeView, setActiveView] = useState<'grid' | 'speaker' | 'screen'>('grid');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'client1', // Current user
        senderName: 'You',
        message: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const endCall = () => {
    // Handle call ending logic
    alert('Call ended');
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getParticipantVideo = (participant: Participant) => (
    <div key={participant.id} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {participant.isVideoOn ? (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <VideoOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Camera Off</p>
          </div>
        </div>
      )}
      
      {/* Participant Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">{participant.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              participant.role === 'lawyer' ? 'bg-blue-600 text-white' :
              participant.role === 'notary' ? 'bg-green-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {participant.role}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {!participant.isAudioOn && <MicOff className="w-4 h-4 text-red-400" />}
            <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold">{consultation.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-400">
                  Duration: {formatTime(elapsedTime)}
                </span>
                <span className={`text-sm ${getConnectionColor()}`}>
                  {connectionQuality} connection
                </span>
                {isRecording && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Recording</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{consultation.participants.length}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            {activeView === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {consultation.participants.map(participant => getParticipantVideo(participant))}
              </div>
            )}
            
            {activeView === 'speaker' && (
              <div className="grid grid-cols-4 gap-4 h-full">
                <div className="col-span-3">
                  {getParticipantVideo(consultation.participants[0])}
                </div>
                <div className="space-y-4">
                  {consultation.participants.slice(1).map(participant => getParticipantVideo(participant))}
                </div>
              </div>
            )}
            
            {activeView === 'screen' && isScreenSharing && (
              <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Screen sharing active</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* View Options */}
                <div className="flex bg-gray-700 rounded-lg p-1">
                  {[
                    { id: 'grid', icon: Users, label: 'Grid' },
                    { id: 'speaker', icon: User, label: 'Speaker' },
                    { id: 'screen', icon: Monitor, label: 'Screen' }
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setActiveView(view.id as 'grid' | 'speaker' | 'screen')}
                      className={`p-2 rounded-md transition-colors ${
                        activeView === view.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={view.label}
                    >
                      <view.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                >
                  <Share className="w-5 h-5" />
                </button>

                {consultation.recordingEnabled && (
                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-full transition-colors ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors relative"
                  title="Toggle chat"
                >
                  <MessageSquare className="w-5 h-5" />
                  {messages.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">{messages.length}</span>
                    </div>
                  )}
                </button>

                <button
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>

                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="End call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Chat</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`${
                    message.type === 'system' 
                      ? 'text-center text-gray-400 text-sm' 
                      : message.senderId === 'client1' 
                        ? 'text-right' 
                        : 'text-left'
                  }`}>
                    {message.type === 'system' ? (
                      <span>{message.message}</span>
                    ) : (
                      <div className={`inline-block max-w-xs p-3 rounded-lg ${
                        message.senderId === 'client1'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}>
                        {message.senderId !== 'client1' && (
                          <div className="text-xs text-gray-300 mb-1">{message.senderName}</div>
                        )}
                        <div>{message.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2 mb-3">
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors" title="Upload file">
                    <Upload className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors" title="Send document">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connection Status Toast */}
      <AnimatePresence>
        {connectionQuality === 'poor' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <div className="font-medium">Poor Connection</div>
                <div className="text-sm opacity-90">Video quality may be reduced</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Sharing Modal */}
      {consultation.documentSharing && (
        <div className="fixed bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-sm">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Documents</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-700 rounded p-2">
              <span className="text-sm">Property Agreement.pdf</span>
              <Download className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center justify-between bg-gray-700 rounded p-2">
              <span className="text-sm">ID Verification.jpg</span>
              <Download className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
