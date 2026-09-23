import React, { useState, useEffect, useRef } from 'react';
import { BorderBeam } from 'border-beam';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Building2, 
  Store, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Volume2, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const BuyerMessagesPage: React.FC = () => {
  const { currentCompany, currentUser, role } = useAuth();
  const { messages, rfqs, sendMessage } = useAppData();

  const [activeRFQId, setActiveRFQId] = useState<string>(rfqs[0]?.id || '');
  const [inputText, setInputText] = useState('');

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback State
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const playbackTimerRef = useRef<any>(null);

  const rfqList = rfqs.slice(0, 5);
  const activeRFQ = rfqs.find(r => r.id === activeRFQId) || rfqs[0];
  const rfqMessages = messages.filter(m => m.rfqId === activeRFQ?.id || m.rfqNumber === activeRFQ?.rfqNumber);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            handleStopAndSendRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Handle Voice Note Playback Simulation
  const handleTogglePlayVoiceNote = (messageId: string, durationSec = 12) => {
    if (playingMessageId === messageId) {
      // Pause
      setPlayingMessageId(null);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    } else {
      // Play
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      setPlayingMessageId(messageId);
      setPlaybackProgress(0);

      const intervalMs = (100 / (durationSec * 10)) / playbackSpeed;
      playbackTimerRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            clearInterval(playbackTimerRef.current);
            setPlayingMessageId(null);
            return 0;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleStopAndSendRecording = () => {
    if (!activeRFQ) return;
    const finalDuration = Math.max(1, recordingSeconds);

    sendMessage({
      rfqId: activeRFQ.id,
      rfqNumber: activeRFQ.rfqNumber,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      senderRole: role,
      recipientCompanyId: role === 'buyer' ? 'comp-supp-fm-1' : activeRFQ.buyerCompanyId,
      recipientCompanyName: role === 'buyer' ? 'CleanPro Emirates Trading LLC' : activeRFQ.buyerCompanyName,
      messageText: 'Voice message (' + finalDuration + 's)',
      voiceNoteUrl: 'recorded-audio-note',
      voiceDurationSeconds: finalDuration,
    });

    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRFQ) return;

    sendMessage({
      rfqId: activeRFQ.id,
      rfqNumber: activeRFQ.rfqNumber,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      senderRole: role,
      recipientCompanyId: role === 'buyer' ? 'comp-supp-fm-1' : activeRFQ.buyerCompanyId,
      recipientCompanyName: role === 'buyer' ? 'CleanPro Emirates Trading LLC' : activeRFQ.buyerCompanyName,
      messageText: inputText.trim(),
    });

    setInputText('');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return mins + ':' + (remaining < 10 ? '0' : '') + remaining;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Procurement Messaging & Voice Desk</h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Real-time text & voice notes directly connected to RFQs, chemical specs, and purchase order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[540px]">
        {/* RFQ Threads Sidebar */}
        <Card className="md:col-span-1 p-0 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Active RFQ Channels</h3>
            <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
              {rfqList.length} Active
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800 flex-1 overflow-y-auto">
            {rfqList.map((rfq) => {
              const isActive = rfq.id === activeRFQId;
              return (
                <button
                  key={rfq.id}
                  onClick={() => setActiveRFQId(rfq.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-brand-50/80 dark:bg-brand-950/40 border-l-4 border-brand-600' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0">
                    <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-brand-700 dark:text-brand-400">{rfq.rfqNumber}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{rfq.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{rfq.projectName}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 p-0 flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-brand-200 dark:border-zinc-700">
                  {activeRFQ?.rfqNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeRFQ?.title}</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Channel: <strong>{activeRFQ?.buyerCompanyName}</strong> ↔ <strong>Verified Quoting Suppliers</strong>
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Enabled</span>
            </div>
          </div>

          {/* Message List */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px] bg-slate-50/40 dark:bg-[#0c0c0e]">
            {rfqMessages.length > 0 ? (
              rfqMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id || msg.senderRole === role;
                const isVoiceNote = !!msg.voiceNoteUrl;
                const isPlaying = playingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 mb-1 px-1">
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{msg.senderName}</span>
                      <span>({msg.senderCompanyName})</span>
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>

                    {/* Voice Message Bubble */}
                    {isVoiceNote ? (
                      <div
                        className={`p-3.5 rounded-2xl max-w-sm w-full shadow-subtle border ${
                          isMe
                            ? 'bg-brand-600 text-white border-brand-700 rounded-br-none'
                            : 'bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-800 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleTogglePlayVoiceNote(msg.id, msg.voiceDurationSeconds || 14)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
                              isMe
                                ? 'bg-white text-brand-600 shadow-sm hover:scale-105'
                                : 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                          </button>

                          {/* Soundwave animation */}
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-1 h-6">
                              {[40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 30, 65, 90, 40, 75, 55].map((h, i) => (
                                <span
                                  key={i}
                                  style={{ height: isPlaying ? `${Math.max(20, Math.sin(Date.now() / 100 + i) * 80 + 20)}%` : `${h}%` }}
                                  className={`w-1 rounded-full transition-all duration-150 ${
                                    isMe
                                      ? isPlaying ? 'bg-amber-300' : 'bg-white/70'
                                      : isPlaying ? 'bg-brand-600' : 'bg-slate-300 dark:bg-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-semibold opacity-90">
                              <span>Voice Note ({msg.voiceDurationSeconds || 14}s)</span>
                              <span className="font-mono">{formatSeconds(msg.voiceDurationSeconds || 14)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Text summary below voice note */}
                        <p className={`text-[11px] mt-2 pt-2 border-t font-medium ${
                          isMe ? 'border-brand-500/60 text-brand-100' : 'border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}>
                          🎤 {msg.messageText}
                        </p>
                      </div>
                    ) : (
                      /* Standard Text Message Bubble */
                      <div
                        className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed shadow-subtle ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 rounded-bl-none'
                        }`}
                      >
                        {msg.messageText}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 dark:text-zinc-500 text-xs">
                No messages yet for this RFQ. Start the conversation or send a voice note below.
              </div>
            )}
          </div>

          {/* Bottom Chat Bar with Voice Note Recorder */}
          <div className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e]">
            {isRecording ? (
              /* LIVE RECORDING STATE */
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Recording Voice Note:</span>
                    <span className="font-mono text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800">
                      {formatSeconds(recordingSeconds)} / 1:00
                    </span>
                  </div>

                  {/* Pulsing visualizer bars */}
                  <div className="hidden sm:flex items-center gap-1 h-5 ml-2">
                    {[60, 90, 40, 100, 70, 80, 50, 90, 40, 70].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-rose-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelRecording}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Cancel</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStopAndSendRecording}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    Send Voice Note
                  </Button>
                </div>
              </div>
            ) : (
              /* STANDARD INPUT BAR WITH MIC BUTTON */
              <form onSubmit={handleSendText} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  title="Record Voice Note"
                  className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-sm"
                >
                  <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="hidden sm:inline">Voice Note</span>
                </button>

                <BorderBeam size="line" theme="light" className="flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type message or click Voice Note to record..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </BorderBeam>

                <Button variant="primary" size="sm" type="submit" leftIcon={<Send className="w-4 h-4" />}>
                  Send
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};