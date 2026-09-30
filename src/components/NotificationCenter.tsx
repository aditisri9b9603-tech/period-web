import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import { CycleStatus } from '../types/cycle';
import { Bell, X, Check, Trash2, Heart, MessageCircle, Sparkles, Droplets, Calendar, ExternalLink } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'cycle' | 'forum' | 'wellness';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  actionTab?: string;
  icon: string;
}

interface NotificationCenterProps {
  cycleStatus?: CycleStatus;
  onNavigateTab: (tab: any) => void;
}

const STORAGE_NOTIFICATIONS_KEY = 'sakhi_notifications_v1';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  cycleStatus,
  onNavigateTab,
}) => {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'cycle' | 'forum'>('all');

  // Generate dynamic initial notifications based on cycle status & forum activity
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }

    // Default notifications
    const defaultList: AppNotification[] = [
      {
        id: 'notif-1',
        type: 'cycle',
        title: language === 'hi' ? '🌸 आगामी चरण सूचना' : '🌸 Cycle Phase Horizon',
        message:
          language === 'hi'
            ? 'आपका फॉलिक्युलर फेज़ जल्द आ रहा है। एस्ट्रोजन बढ़ेगा, रचनात्मक कार्यों के लिए बेहतरीन समय है!'
            : 'Your energetic Follicular phase begins soon! Estrogen is gently rising — wonderful time for fresh goals & creative work.',
        timeAgo: '10m ago',
        read: false,
        actionTab: 'phaseGuide',
        icon: '🌸',
      },
      {
        id: 'notif-2',
        type: 'forum',
        title: language === 'hi' ? '💬 सखी चौपाल पर नया उत्तर' : '💬 New Forum Reply',
        message:
          language === 'hi'
            ? 'Moonlight Sister ने आपके क्रैम्प्स सवाल पर जवाब दिया: "तिल का तेल और अजवाइन की चाय बहुत राहत देती है!"'
            : 'Moonlight Sister replied to your post in Cramps & Comfort: "Warm ajwain tea & sesame oil massage soothe uterine muscles so fast!"',
        timeAgo: '1h ago',
        read: false,
        actionTab: 'forum',
        icon: '💬',
      },
      {
        id: 'notif-3',
        type: 'forum',
        title: language === 'hi' ? '💗 बहनों का प्यार' : '💗 Sisterhood Love',
        message:
          language === 'hi'
            ? '5 सखियों ने आपके PCOS अनुभव पर प्यार (Hearts) भेजा है।'
            : '5 sisters sent supportive hearts to your anonymous share in PCOS & Hormones.',
        timeAgo: '3h ago',
        read: false,
        actionTab: 'forum',
        icon: '💗',
      },
      {
        id: 'notif-4',
        type: 'wellness',
        title: language === 'hi' ? '🎵 सखी म्यूज़िक विश्राम' : '🎵 Sakhi Music Sanctuary',
        message:
          language === 'hi'
            ? 'गहरी नींद और पीएमएस तनावमुक्ति के लिए "Calm & Sleep 528 Hz" प्लेलिस्ट स्पॉटिफाई पर तैयार है।'
            : 'New 528 Hz delta waves playlist ready on Spotify to help soothe nighttime restlessness.',
        timeAgo: '1d ago',
        read: true,
        actionTab: 'vibes',
        icon: '🎵',
      },
    ];

    return defaultList;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item: AppNotification) => {
    markAsRead(item.id);
    if (item.actionTab) {
      onNavigateTab(item.actionTab);
      setIsOpen(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'cycle') return n.type === 'cycle';
    if (filter === 'forum') return n.type === 'forum';
    return true;
  });

  return (
    <div className="relative">
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-full border border-[#ECCACF] bg-white/80 hover:bg-[#FFF4F0] text-[#7A4B55] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84] hover:scale-105 active:scale-95 shadow-2xs"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-white/95 backdrop-blur-2xl border border-pink-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔔</span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#4A1E29]">
                    {language === 'hi' ? 'सखी सूचनाएं' : 'Sakhi Notifications'}
                  </h4>
                  <p className="text-[10px] text-[#8A5A66]">
                    {unreadCount > 0
                      ? `${unreadCount} ${language === 'hi' ? 'नई सूचनाएं' : 'new updates'}`
                      : language === 'hi' ? 'सब पढ़ लिया गया' : 'All caught up!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 px-2 py-0.5 rounded-full hover:bg-pink-50 transition-colors"
                  >
                    {language === 'hi' ? 'सब पढ़ें' : 'Mark all read'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: language === 'hi' ? 'सभी' : 'All' },
                { id: 'cycle', label: language === 'hi' ? '🌸 चक्र अलर्ट' : '🌸 Cycle' },
                { id: 'forum', label: language === 'hi' ? '💬 चौपाल' : '💬 Forum' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    filter === f.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                      : 'bg-pink-50/70 text-[#6E3C48] hover:bg-pink-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <span className="text-3xl">🌸</span>
                  <p className="text-xs text-[#8A5A66]">
                    {language === 'hi' ? 'कोई नई सूचना नहीं है' : 'No notifications in this category'}
                  </p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      !item.read
                        ? 'bg-gradient-to-r from-[#FFF5F8] to-[#FFF9FB] border-pink-300 shadow-2xs'
                        : 'bg-white/60 border-pink-100 hover:bg-pink-50/50'
                    }`}
                  >
                    <span className="text-2xl p-1.5 rounded-xl bg-white shadow-2xs border border-pink-100 flex-shrink-0">
                      {item.icon}
                    </span>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-bold text-xs text-[#4A1E29] truncate">
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-[#A66F7B] flex-shrink-0">
                          {item.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-[#522932] leading-snug line-clamp-2">
                        {item.message}
                      </p>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5 hover:underline">
                          <span>{language === 'hi' ? 'देखें' : 'View'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Clear All Footer */}
            {notifications.length > 0 && (
              <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-[#8A5A66]">
                <span>{notifications.length} alerts saved locally</span>
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
