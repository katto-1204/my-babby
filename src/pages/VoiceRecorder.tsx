import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
  waveform?: number[];
}

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>(() => {
    const saved = localStorage.getItem('voiceMessages');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) })) : [];
  });
  const [currentMessage, setCurrentMessage] = useState<VoiceMessage | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playSound } = useSound();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const message: VoiceMessage = {
          id: Date.now().toString(),
          audioUrl,
          duration: recordingTime,
          createdAt: new Date(),
        };

        setMessages([...messages, message]);
        localStorage.setItem('voiceMessages', JSON.stringify([...messages, message]));
        setRecordingTime(0);
        playSound('success');
        
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      playSound('buttonClick');

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record voice messages');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playMessage = (message: VoiceMessage) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(message.audioUrl);
    audioRef.current = audio;
    audio.play();
    setCurrentMessage(message);
    playSound('sparkle');

    audio.onended = () => {
      setCurrentMessage(null);
    };
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setCurrentMessage(null);
    }
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('voiceMessages', JSON.stringify(updated));
    playSound('buttonClick');
  };

  const downloadMessage = (message: VoiceMessage) => {
    const a = document.createElement('a');
    a.href = message.audioUrl;
    a.download = `voice-message-${message.id}.wav`;
    a.click();
    playSound('success');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Voice Message Recorder
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Record and share your voice messages
          </p>
        </motion.div>

        {/* Recorder */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-elevated mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            {isRecording ? (
              <motion.div
                className="w-24 h-24 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-12 h-12 bg-white rounded-full" />
              </motion.div>
            ) : (
              <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            )}
            {isRecording && (
              <p className="text-2xl font-medium text-primary mb-2">
                {formatTime(recordingTime)}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 btn-romantic text-lg"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-red-500 text-white rounded-full text-lg hover:bg-red-600"
              >
                Stop Recording
              </button>
            )}
          </div>
        </motion.div>

        {/* Messages List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-medium mb-4">Your Voice Messages</h2>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No voice messages yet. Start recording to create your first message!
            </p>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-elevated"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        currentMessage?.id === message.id ? stopPlayback() : playMessage(message)
                      }
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentMessage?.id === message.id
                          ? 'bg-red-500 text-white'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {currentMessage?.id === message.id ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <p className="font-medium">{formatTime(message.duration)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadMessage(message)}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
