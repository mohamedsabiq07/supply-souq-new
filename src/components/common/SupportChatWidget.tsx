import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import {
  Headphones,
  Send,
  ShieldCheck,
  Mic,
  Play,
  Pause,
  Trash2,
  X,
  MessageSquare,
  Minimize2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SupportDeskInlineBoxProps {
  defaultRfqNumber?: string;
  compact?: boolean;
}

/**
 * Shared hook that returns the current company's unified 1-on-1 message thread
 * with ProcureSouq Customer Service & Procurement Officers.
 * Strictly excludes any legacy peer-to-peer messages.
 */
export function useProcureSouqSupportThread() {
  const { currentCompany, currentUser, role } = useAuth();
  const { messages, rfqs, sendMessage } = useAppData();

  const isSupplier = role === 'supplier';
  const deskTitle = isSupplier
    ? 'Customer Service & Procurement Officers (Supplier Desk)'
    : 'Customer Service & Procurement Officers';

  const threadMessages = useMemo(() => {
    if (!currentCompany?.id) return [];
    return messages.filter((m) => {
      if (m.id === 'msg-1' || m.id === 'msg-2-voice') return false;

      const sentByMeToProcureSouq =
        (m.senderCompanyId === currentCompany.id ||
          (currentUser?.id && m.senderId === currentUser.id)) &&
        (m.recipientCompanyId === 'procuresouq-admin' ||
          m.rfqId === 'procuresouq-general-support' ||
          m.rfqNumber === 'PS-SUPPORT');

      const sentByAdminToMe =
        m.recipientCompanyId === currentCompany.id &&
        (m.senderRole === 'admin' || m.senderCompanyId === 'procuresouq-admin');

      return sentByMeToProcureSouq || sentByAdminToMe;
    });
  }, [messages, currentCompany?.id, currentUser?.id]);

  const unreadAdminReplies = useMemo(() => {
    if (!currentCompany?.id) return 0;
    return messages.filter(
      (m) =>
        m.recipientCompanyId === currentCompany.id &&
        (m.senderRole === 'admin' || m.senderCompanyId === 'procuresouq-admin') &&
        !m.isRead
    ).length;
  }, [messages, currentCompany?.id]);

  const relevantRfqs = useMemo(() => {
    if (!currentCompany?.id) return [];
    if (role === 'buyer') {
      return rfqs.filter((r) => r.buyerCompanyId === currentCompany.id);
    }
    return rfqs.filter((r) => r.status !== 'draft' && r.status !== 'cancelled');
  }, [rfqs, role, currentCompany?.id]);

  return {
    currentCompany,
    currentUser,
    role,
    isSupplier,
    deskTitle,
    threadMessages,
    unreadAdminReplies,
    relevantRfqs,
    sendMessage,
  };
}

/**
 * Inline Text Box Card for texting ProcureSouq Customer Service & Procurement Officers
 * directly from the Dashboard, Compare Quotes, or RFQ pages without needing a separate page.
 */
export const SupportDeskInlineBox: React.FC<SupportDeskInlineBoxProps> = ({
  defaultRfqNumber,
  compact = false,
}) => {
  const {
    currentCompany,
    currentUser,
    role,
    isSupplier,
    deskTitle,
    threadMessages,
    relevantRfqs,
    sendMessage,
  } = useProcureSouqSupportThread();

  const [inputText, setInputText] = useState('');
  const [selectedRfqRef, setSelectedRfqRef] = useState<string>(
    defaultRfqNumber || 'PS-SUPPORT'
  );
  const [justSentToast, setJustSentToast] = useState(false);

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultRfqNumber) {
      setSelectedRfqRef(defaultRfqNumber);
    }
  }, [defaultRfqNumber]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [threadMessages.length]);

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

  if (!currentCompany || !currentUser || role === 'admin') return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return mins + ':' + (remaining < 10 ? '0' : '') + remaining;
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const matchedRfq = relevantRfqs.find((r) => r.rfqNumber === selectedRfqRef || r.id === selectedRfqRef);

    sendMessage({
      rfqId: matchedRfq ? matchedRfq.id : 'procuresouq-general-support',
      rfqNumber: matchedRfq ? matchedRfq.rfqNumber : 'PS-SUPPORT',
      senderId: currentUser.id || 'user',
      senderName: currentUser.fullName || currentCompany.name || 'User',
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      senderRole: role,
      recipientCompanyId: 'procuresouq-admin',
      recipientCompanyName: deskTitle,
      messageText: inputText.trim(),
    });

    setInputText('');
    setJustSentToast(true);
    setTimeout(() => setJustSentToast(false), 3500);
  };

  const handleStopAndSendRecording = () => {
    const finalDuration = Math.max(1, recordingSeconds);
    const matchedRfq = relevantRfqs.find((r) => r.rfqNumber === selectedRfqRef || r.id === selectedRfqRef);

    sendMessage({
      rfqId: matchedRfq ? matchedRfq.id : 'procuresouq-general-support',
      rfqNumber: matchedRfq ? matchedRfq.rfqNumber : 'PS-SUPPORT',
      senderId: currentUser.id || 'user',
      senderName: currentUser.fullName || currentCompany.name || 'User',
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      senderRole: role,
      recipientCompanyId: 'procuresouq-admin',
      recipientCompanyName: deskTitle,
      messageText: `Voice message (${finalDuration}s)`,
      voiceNoteUrl: 'recorded-audio-note',
      voiceDurationSeconds: finalDuration,
    });

    setIsRecording(false);
    setRecordingSeconds(0);
    setJustSentToast(true);
    setTimeout(() => setJustSentToast(false), 3500);
  };

  const quickPrompts = isSupplier
    ? [
        'Need technical clarification on BOQ specs',
        'Can we offer an approved alternative brand?',
        'Confirming delivery schedule & site access',
      ]
    : [
        'Please expedite quotations for my RFQ',
        'Need technical clarification on Offer comparison',
        'Requesting update on Purchase Order / Delivery',
      ];

  return (
    <Card className="p-0 overflow-hidden border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] shadow-sm">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-[#1f0910] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#cf2e46] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-white">
                Text Customer Service & Procurement Officers
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Direct Line • Manual Desk
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isSupplier
                ? 'Have a question about an RFQ, quotation, or PO? Text our procurement officers directly below.'
                : 'Need help with your RFQ, quote comparison, or order delivery? Text our customer service & procurement officers directly below.'}
            </p>
          </div>
        </div>

        {/* Optional Topic / RFQ Reference Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Regarding:
          </label>
          <select
            value={selectedRfqRef}
            onChange={(e) => setSelectedRfqRef(e.target.value)}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-white/20 focus:outline-none cursor-pointer"
          >
            <option value="PS-SUPPORT" className="text-slate-900">
              General Support / Procurement Officer
            </option>
            {relevantRfqs.map((r) => (
              <option key={r.id} value={r.rfqNumber} className="text-slate-900">
                {r.rfqNumber} — {r.title.slice(0, 32)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversation History (Shown when messages exist or in non-compact mode) */}
      {(threadMessages.length > 0 || !compact) && (
        <div
          ref={chatScrollRef}
          className="px-5 py-3.5 space-y-2.5 max-h-[240px] overflow-y-auto bg-slate-50/70 dark:bg-[#0c0c0e] border-b border-slate-100 dark:border-white/[0.06]"
        >
          {threadMessages.length > 0 ? (
            threadMessages.map((msg) => {
              const isMe =
                msg.senderCompanyId === currentCompany.id ||
                (currentUser.id && msg.senderId === currentUser.id);
              const isPlaying = playingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 mb-0.5 px-1">
                    {msg.rfqNumber && msg.rfqNumber !== 'PS-SUPPORT' && (
                      <span className="font-mono font-bold text-[#cf2e46]">
                        [{msg.rfqNumber}]
                      </span>
                    )}
                    <span className="font-bold text-slate-700 dark:text-zinc-300">
                      {isMe ? 'You' : 'ProcureSouq Customer Service & Procurement Officer'}
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(msg.createdAt)}</span>
                  </div>

                  {msg.voiceNoteUrl ? (
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl max-w-sm flex items-center gap-3 text-xs ${
                        isMe
                          ? 'bg-[#cf2e46] text-white rounded-br-none'
                          : 'bg-white dark:bg-white/[0.06] text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-white/[0.08] rounded-bl-none'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setPlayingMessageId(isPlaying ? null : msg.id)
                        }
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                          isMe ? 'bg-white text-[#cf2e46]' : 'bg-[#cf2e46] text-white'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                      <span>🎤 {msg.messageText}</span>
                    </div>
                  ) : (
                    <div
                      className={`px-3.5 py-2 rounded-2xl max-w-lg text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#cf2e46] text-white rounded-br-none'
                          : 'bg-white dark:bg-white/[0.06] text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-white/[0.08] rounded-bl-none'
                      }`}
                    >
                      {msg.messageText}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Direct message box with <strong>ProcureSouq Customer Service & Procurement Officers</strong>. Type your question or click a quick topic:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInputText(prompt)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-white/[0.05] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-zinc-300 hover:text-[#cf2e46] border border-slate-200/80 dark:border-white/[0.08] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct Text Input Box */}
      <div className="p-3.5 bg-white dark:bg-[#111114]">
        {justSentToast && (
          <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Sent to ProcureSouq Customer Service & Procurement Officers! Our team will respond right here.
            </span>
          </div>
        )}

        {isRecording ? (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Recording Voice Note for Procurement Officer: {formatSeconds(recordingSeconds)} / 1:00
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRecording(false);
                  setRecordingSeconds(0);
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
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
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              title="Record Voice Note"
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">Voice</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isSupplier
                  ? 'Type your message to ProcureSouq Customer Service & Procurement Officers...'
                  : 'Text our Customer Service & Procurement Officers (e.g. RFQ question, quote update, PO help)...'
              }
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200/90 dark:border-white/[0.1] bg-slate-50/60 dark:bg-[#16161a] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-[#cf2e46] focus:bg-white focus:outline-none"
            />

            <Button
              variant="primary"
              size="sm"
              type="submit"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="shrink-0 font-bold"
            >
              Send Text
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};

/**
 * Floating Bottom-Right Chat Box for Buyers & Suppliers so they can text
 * Customer Service & Procurement Officers from any screen without a separate page.
 */
export const SupportChatWidget: React.FC = () => {
  const {
    currentCompany,
    currentUser,
    role,
    isSupplier,
    deskTitle,
    threadMessages,
    unreadAdminReplies,
    relevantRfqs,
    sendMessage,
  } = useProcureSouqSupportThread();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedRfqRef, setSelectedRfqRef] = useState<string>('PS-SUPPORT');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e?.detail?.rfqNumber) {
        setSelectedRfqRef(e.detail.rfqNumber);
      }
    };
    window.addEventListener('open-support-chat', handleOpenChat as EventListener);
    (window as any).__openSupportChat = (rfqNumber?: string) => {
      setIsOpen(true);
      if (rfqNumber) setSelectedRfqRef(rfqNumber);
    };
    return () => {
      window.removeEventListener('open-support-chat', handleOpenChat as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, threadMessages.length]);

  if (!currentCompany || !currentUser || role === 'admin') {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const matchedRfq = relevantRfqs.find(
      (r) => r.rfqNumber === selectedRfqRef || r.id === selectedRfqRef
    );

    sendMessage({
      rfqId: matchedRfq ? matchedRfq.id : 'procuresouq-general-support',
      rfqNumber: matchedRfq ? matchedRfq.rfqNumber : 'PS-SUPPORT',
      senderId: currentUser.id || 'user',
      senderName: currentUser.fullName || currentCompany.name || 'User',
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      senderRole: role,
      recipientCompanyId: 'procuresouq-admin',
      recipientCompanyName: deskTitle,
      messageText: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-white/[0.12] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-[#1f0910] to-slate-900 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#cf2e46] flex items-center justify-center text-white shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-extrabold text-white truncate">
                  Customer Service & Procurement
                </div>
                <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ProcureSouq Officers Online</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimize chat box"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Regarding Selector */}
          <div className="px-3.5 py-2 bg-slate-100 dark:bg-white/[0.04] border-b border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-slate-600 dark:text-zinc-400 shrink-0">
              Topic / RFQ:
            </span>
            <select
              value={selectedRfqRef}
              onChange={(e) => setSelectedRfqRef(e.target.value)}
              className="flex-1 bg-white dark:bg-[#18181c] text-slate-900 dark:text-white font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-white/[0.1] text-[11px] focus:outline-none"
            >
              <option value="PS-SUPPORT">General Customer Service & Procurement</option>
              {relevantRfqs.map((r) => (
                <option key={r.id} value={r.rfqNumber}>
                  {r.rfqNumber} — {r.title.slice(0, 26)}
                </option>
              ))}
            </select>
          </div>

          {/* Messages List */}
          <div
            ref={scrollRef}
            className="p-3.5 space-y-3 h-[290px] overflow-y-auto bg-slate-50/80 dark:bg-[#0c0c0e]"
          >
            {threadMessages.length > 0 ? (
              threadMessages.map((msg) => {
                const isMe =
                  msg.senderCompanyId === currentCompany.id ||
                  (currentUser.id && msg.senderId === currentUser.id);
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1">
                      {msg.rfqNumber && msg.rfqNumber !== 'PS-SUPPORT' && (
                        <span className="font-mono font-bold text-[#cf2e46]">
                          [{msg.rfqNumber}]
                        </span>
                      )}
                      <span className="font-bold text-slate-600 dark:text-zinc-300">
                        {isMe ? 'You' : 'ProcureSouq Officer'}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#cf2e46] text-white rounded-br-none'
                          : 'bg-white dark:bg-white/[0.06] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/[0.08] rounded-bl-none shadow-2xs'
                      }`}
                    >
                      {msg.voiceNoteUrl ? `🎤 ${msg.messageText}` : msg.messageText}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-3 text-slate-400">
                <Headphones className="w-8 h-8 text-[#cf2e46] mb-2 opacity-80" />
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                  Direct Line to Customer Service & Procurement Officers
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  {isSupplier
                    ? 'Send a text below regarding any RFQ specification, quotation, or purchase order.'
                    : 'Send a text below regarding your RFQs, quote comparisons, orders, or any issue.'}
                </p>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white dark:bg-[#111114] border-t border-slate-200/80 dark:border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Text Customer Service / Procurement Officer..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#18181c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#cf2e46]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#cf2e46] hover:bg-[#b91c33] text-white font-bold transition-colors cursor-pointer shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-slate-900 via-[#2a0c14] to-[#cf2e46] hover:from-[#cf2e46] hover:to-[#b91c33] text-white shadow-xl border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Headphones className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-left">
            <div className="text-xs font-extrabold leading-none">
              Text Procurement Officer
            </div>
            <div className="text-[10px] text-rose-200 font-medium leading-none mt-0.5">
              Customer Service & Support
            </div>
          </div>
          {unreadAdminReplies > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              {unreadAdminReplies}
            </span>
          )}
        </button>
      )}
    </div>
  );
};
