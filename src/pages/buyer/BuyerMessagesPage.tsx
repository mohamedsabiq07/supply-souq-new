import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BorderBeam } from 'border-beam';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Mic,
  Play,
  Pause,
  Trash2,
  Volume2,
  Lock,
  Headphones,
} from 'lucide-react';

interface BuyerMessagesPageProps {
  onNavigate?: (view: string, params?: any) => void;
}

interface SupportChannel {
  id: string;
  rfqNumber: string;
  title: string;
  subtitle: string;
  isGeneralDesk?: boolean;
}

export const BuyerMessagesPage: React.FC<BuyerMessagesPageProps> = () => {
  const { currentCompany, currentUser, role } = useAuth();
  const { messages, rfqs, quotations, supplierInvitations, sendMessage } = useAppData();

  const isSupplier = role === 'supplier';
  const deskName = isSupplier
    ? 'ProcureSouq Supplier Operations Desk'
    : 'ProcureSouq Procurement & Customer Support Desk';

  // Build available channels: Always include the General Support Desk + user's relevant RFQ channels
  const channels = useMemo<SupportChannel[]>(() => {
    const generalChannel: SupportChannel = {
      id: 'procuresouq-general-support',
      rfqNumber: 'PS-SUPPORT',
      title: isSupplier
        ? 'ProcureSouq Supplier Support & Operations Desk'
        : 'ProcureSouq Customer Support & Procurement Desk',
      subtitle: isSupplier
        ? 'Ask quotation questions, report portal issues, or coordinate with ProcureSouq'
        : 'Report issues, request sourcing updates, or ask procurement questions',
      isGeneralDesk: true,
    };

    if (role === 'supplier') {
      const assignedRfqs = rfqs.filter(
        (r) =>
          supplierInvitations.some(
            (inv) => inv.rfqId === r.id && inv.supplierCompanyId === currentCompany?.id
          ) ||
          quotations.some(
            (q) =>
              (q.rfqId === r.id || q.rfqNumber === r.rfqNumber) &&
              q.supplierCompanyId === currentCompany?.id
          ) ||
          (r.matchedSupplierCompanyIds &&
            r.matchedSupplierCompanyIds.includes(currentCompany?.id || '')) ||
          messages.some(
            (m) =>
              (m.rfqId === r.id || m.rfqNumber === r.rfqNumber) &&
              (m.senderCompanyId === currentCompany?.id ||
                m.recipientCompanyId === currentCompany?.id)
          )
      );

      const rfqChannels: SupportChannel[] = assignedRfqs.map((r) => ({
        id: r.id,
        rfqNumber: r.rfqNumber,
        title: r.title,
        // Never expose buyer company name or buyer project name to supplier
        subtitle: `${r.category} • Delivery: ${r.deliveryEmirate} (Confidential End-Client)`,
      }));

      return [generalChannel, ...rfqChannels];
    }

    // Buyer role: strictly RFQs created by this buyer company
    const buyerRfqs = rfqs.filter((r) => r.buyerCompanyId === currentCompany?.id);
    const rfqChannels: SupportChannel[] = buyerRfqs.map((r) => ({
      id: r.id,
      rfqNumber: r.rfqNumber,
      title: r.title,
      subtitle: `${r.projectName || r.category} • Managed by ProcureSouq`,
    }));

    return [generalChannel, ...rfqChannels];
  }, [rfqs, quotations, supplierInvitations, messages, role, isSupplier, currentCompany?.id]);

  const [activeChannelId, setActiveChannelId] = useState<string>('procuresouq-general-support');
  const [inputText, setInputText] = useState('');

  // Ensure activeChannelId stays valid
  useEffect(() => {
    if (channels.length > 0 && !channels.some((c) => c.id === activeChannelId)) {
      setActiveChannelId(channels[0].id);
    }
  }, [channels, activeChannelId]);

  const activeChannel =
    channels.find((c) => c.id === activeChannelId) || channels[0];

  // Filter messages strictly between this user/company and ProcureSouq Admin Desk
  // Never expose Buyer <-> Supplier direct messages
  const channelMessages = useMemo(() => {
    if (!activeChannel || !currentCompany?.id) return [];
    return messages.filter((m) => {
      const isThisChannel =
        m.rfqId === activeChannel.id || m.rfqNumber === activeChannel.rfqNumber;
      if (!isThisChannel) return false;
      if (m.id === 'msg-1' || m.id === 'msg-2-voice') return false;

      // User sees ONLY messages they sent OR replies sent to their company by ProcureSouq Admin
      const sentByMyCompany =
        m.senderCompanyId === currentCompany.id ||
        (currentUser?.id && m.senderId === currentUser.id);
      const sentToMyCompanyByAdmin =
        m.recipientCompanyId === currentCompany.id &&
        (m.senderRole === 'admin' || m.senderCompanyId === 'procuresouq-admin');

      return sentByMyCompany || sentToMyCompanyByAdmin;
    });
  }, [messages, activeChannel, currentCompany?.id, currentUser?.id]);

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback State
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [, setPlaybackProgress] = useState(0);
  const [playbackSpeed] = useState<number>(1);
  const playbackTimerRef = useRef<any>(null);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
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
      setPlayingMessageId(null);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      setPlayingMessageId(messageId);
      setPlaybackProgress(0);

      const intervalMs = 100 / (durationSec * 10) / playbackSpeed;
      playbackTimerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
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
    if (!activeChannel) return;
    const finalDuration = Math.max(1, recordingSeconds);

    sendMessage({
      rfqId: activeChannel.id,
      rfqNumber: activeChannel.rfqNumber,
      senderId: currentUser?.id || 'user',
      senderName: currentUser?.fullName || currentCompany?.name || 'User',
      senderCompanyId: currentCompany?.id || '',
      senderCompanyName: currentCompany?.name || 'Company',
      senderRole: role,
      recipientCompanyId: 'procuresouq-admin',
      recipientCompanyName: deskName,
      messageText: 'Voice message (' + finalDuration + 's)',
      voiceNoteUrl: 'recorded-audio-note',
      voiceDurationSeconds: finalDuration,
    });

    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannel) return;

    sendMessage({
      rfqId: activeChannel.id,
      rfqNumber: activeChannel.rfqNumber,
      senderId: currentUser?.id || 'user',
      senderName: currentUser?.fullName || currentCompany?.name || 'User',
      senderCompanyId: currentCompany?.id || '',
      senderCompanyName: currentCompany?.name || 'Company',
      senderRole: role,
      recipientCompanyId: 'procuresouq-admin',
      recipientCompanyName: deskName,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Single Point of Contact: ProcureSouq Team
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Lock className="w-3 h-3 text-slate-500" />
              Counterparty Identity Protected
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSupplier
              ? 'ProcureSouq Supplier Support & Operations Desk'
              : 'ProcureSouq Procurement & Customer Support Desk'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {isSupplier
              ? 'Message ProcureSouq’s operations team directly regarding RFQ clarifications, quotation submissions, purchase orders, or general questions.'
              : 'Message ProcureSouq’s procurement specialists directly regarding your RFQs, technical clarifications, quotation comparisons, orders, or support issues.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[540px]">
        {/* Support & RFQ Channels Sidebar */}
        <Card className="md:col-span-1 p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              ProcureSouq Desk Channels
            </h3>
            <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
              {channels.length} {channels.length === 1 ? 'Channel' : 'Channels'}
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/[0.06] flex-1 overflow-y-auto max-h-[520px]">
            {channels.map((ch) => {
              const isActive = ch.id === activeChannel?.id;
              const unreadCount = messages.filter(
                (m) =>
                  (m.rfqId === ch.id || m.rfqNumber === ch.rfqNumber) &&
                  !m.isRead &&
                  m.recipientCompanyId === currentCompany?.id &&
                  m.senderRole === 'admin'
              ).length;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isActive
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 border-l-4 border-brand-600'
                      : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      ch.isGeneralDesk
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-[#cf2e46]'
                        : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {ch.isGeneralDesk ? (
                      <Headphones className="w-4 h-4 text-[#cf2e46]" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-brand-700 dark:text-brand-400">
                        {ch.rfqNumber}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-[#cf2e46] text-white">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {ch.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                      {ch.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Chat Area with ProcureSouq Team */}
        <Card className="md:col-span-2 p-0 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-white dark:bg-white/[0.08] px-2 py-0.5 rounded-lg border border-brand-200 dark:border-white/[0.1]">
                  {activeChannel?.rfqNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeChannel?.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Direct Managed Channel:{' '}
                <strong>{currentCompany?.name || 'Your Company'}</strong> ↔{' '}
                <strong className="text-[#9e1c2e] dark:text-rose-400">{deskName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Volume2 className="w-3.5 h-3.5" />
              <span>ProcureSouq Desk</span>
            </div>
          </div>

          {/* Message List */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px] bg-slate-50/40 dark:bg-[#0c0c0e]">
            {channelMessages.length > 0 ? (
              channelMessages.map((msg) => {
                const isMe =
                  msg.senderCompanyId === currentCompany?.id ||
                  (currentUser?.id && msg.senderId === currentUser.id);
                const isVoiceNote = !!msg.voiceNoteUrl;
                const isPlaying = playingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 mb-1 px-1">
                      <span className="font-bold text-slate-700 dark:text-zinc-300">
                        {isMe ? msg.senderName : 'ProcureSouq Team'}
                      </span>
                      <span>
                        ({isMe ? msg.senderCompanyName : deskName})
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>

                    {/* Voice Message Bubble */}
                    {isVoiceNote ? (
                      <div
                        className={`p-3.5 rounded-2xl max-w-sm w-full shadow-subtle border ${
                          isMe
                            ? 'bg-brand-600 text-white border-brand-700 rounded-br-none'
                            : 'bg-white dark:bg-white/[0.04] text-slate-800 dark:text-zinc-200 border-slate-200/80 dark:border-white/[0.08] rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleTogglePlayVoiceNote(
                                msg.id,
                                msg.voiceDurationSeconds || 12
                              )
                            }
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
                              isMe
                                ? 'bg-white text-brand-600 shadow-sm hover:scale-105'
                                : 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
                            }`}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Soundwave animation */}
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-1 h-6">
                              {[40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 30, 65, 90, 40, 75, 55].map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      height: isPlaying
                                        ? `${Math.max(20, Math.sin(Date.now() / 100 + i) * 80 + 20)}%`
                                        : `${h}%`,
                                    }}
                                    className={`w-1 rounded-full transition-all duration-150 ${
                                      isMe
                                        ? isPlaying
                                          ? 'bg-amber-300'
                                          : 'bg-white/70'
                                        : isPlaying
                                        ? 'bg-brand-600'
                                        : 'bg-slate-300 dark:bg-white/[0.2]'
                                    }`}
                                  />
                                )
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-semibold opacity-90">
                              <span>Voice Note ({msg.voiceDurationSeconds || 14}s)</span>
                              <span className="font-mono">
                                {formatSeconds(msg.voiceDurationSeconds || 14)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p
                          className={`text-[11px] mt-2 pt-2 border-t font-medium ${
                            isMe
                              ? 'border-brand-500/60 text-brand-100'
                              : 'border-slate-100 dark:border-white/[0.06] text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          🎤 {msg.messageText}
                        </p>
                      </div>
                    ) : (
                      /* Standard Text Message Bubble */
                      <div
                        className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed shadow-subtle ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-white/[0.04] text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-white/[0.08] rounded-bl-none'
                        }`}
                      >
                        {msg.messageText}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center mb-3 text-slate-400 dark:text-zinc-500">
                  <Headphones className="w-6 h-6 text-[#cf2e46]" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Direct Line to {deskName}
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-md text-center">
                  {isSupplier
                    ? 'Have a question about an RFQ specification, delivery schedule, or quotation? Send a message or voice note below and ProcureSouq’s operations team will respond to you directly.'
                    : 'Have a question about your RFQ, quotation comparison, purchase order, or delivery? Send a message or voice note below and ProcureSouq’s procurement team will respond to you directly.'}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Chat Bar with Voice Note Recorder */}
          <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0c0c0e]">
            {isRecording ? (
              /* LIVE RECORDING STATE */
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      Recording Voice Note:
                    </span>
                    <span className="font-mono text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-white dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-300 dark:border-rose-800">
                      {formatSeconds(recordingSeconds)} / 1:00
                    </span>
                  </div>

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
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/[0.1] text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold flex items-center gap-1 transition-colors"
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
                    placeholder={`Message ${deskName}...`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121215] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </BorderBeam>

                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send to ProcureSouq
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};