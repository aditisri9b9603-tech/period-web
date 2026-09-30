import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import {
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  Bookmark,
  BookmarkCheck,
  Flag,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ForumPost {
  id: string;
  authorNickname: string;
  category: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  savedByUser?: boolean;
  reported?: boolean;
  timeAgo: string;
  replies: {
    id: string;
    author: string;
    text: string;
    time: string;
  }[];
}

export const AnonymousForum: React.FC = () => {
  const { t, language } = useTranslation();

  const categories = [
    'All',
    '🌸 Periods',
    '🩷 PMS',
    '🩺 PCOS Awareness',
    '🥗 Nutrition',
    '🫶 Emotional Wellness',
    '🎓 College Life',
    '💗 Relationships',
    '❓ Ask Sakhi',
  ];

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p1',
      authorNickname: '🌸 Lavender Soul',
      category: '🌸 Periods',
      content:
        language === 'hi'
          ? 'पीरियड के पहले दिन मुझे बहुत तेज ऐंठन होती है। अजवाइन और गुड़ की चाय से मुझे बहुत राहत मिली। क्या कोई और घरेलू उपाय है जो काम करता है?'
          : 'First day cramps are so tough today! Warm ajwain-ginger tea with jaggery really helped soothe my uterus. What is your go-to natural comfort ritual?',
      likes: 24,
      likedByUser: false,
      savedByUser: false,
      timeAgo: '2h ago',
      replies: [
        {
          id: 'r1',
          author: '✨ Moonlight Sister',
          text:
            language === 'hi'
              ? 'नाभि पर गर्म तिल के तेल की हल्की मालिश और कैस्टर ऑयल पैक भी बहुत आराम देता है!'
              : 'Castor oil pack on lower abdomen and warm socks work wonders! Stay cozy dear ❤️',
          time: '1h ago',
        },
      ],
    },
    {
      id: 'p2',
      authorNickname: '🌿 Bloom Girl',
      category: '🩺 PCOS Awareness',
      content:
        language === 'hi'
          ? 'PCOS में पीरियड अनियमति होना बहुत तनाव देता है। क्या सीड साइकलिंग (अलसी और कद्दू के बीज) सच में मदद करती है?'
          : 'Dealing with irregular cycles from PCOS can be emotionally exhausting. Has seed cycling (flax + pumpkin seeds) helped anyone regulate their flow?',
      likes: 42,
      likedByUser: false,
      savedByUser: true,
      timeAgo: '5h ago',
      replies: [
        {
          id: 'r2',
          author: '🌷 Sunflower Didi',
          text:
            language === 'hi'
              ? 'हाँ सखी! मैंने 3 महीने लगातार किया, सुबह अलसी का पाउडर दलिया में खाया और मेरा चक्र 31 दिनों पर आ गया।'
              : 'Yes! Consistency is key. Eating freshly ground flaxseeds in breakfast oatmeal noticeably helped my energy and cycle timing!',
          time: '3h ago',
        },
      ],
    },
    {
      id: 'p3',
      authorNickname: '☕ Chai Lover',
      category: '🫶 Emotional Wellness',
      content:
        language === 'hi'
          ? 'ल्यूटियल फेज में बिना किसी बात के रोना आ जाता है। बस यह याद दिलाना था कि तुम अकेली नहीं हो, यह तुम्हारे हार्मोन्स हैं, तुम कमजोर नहीं हो 💗'
          : 'Just a gentle reminder to anyone in their luteal phase crying for no reason today: You are not crazy, your progesterone is just shifting. You are safe and doing your best 💗',
      likes: 67,
      likedByUser: false,
      savedByUser: false,
      timeAgo: '8h ago',
      replies: [
        {
          id: 'r3',
          author: '🕊️ Peaceful Heart',
          text: 'Needed to read this so badly today. Thank you sweet soul 🥺🌸',
          time: '6h ago',
        },
      ],
    },
    {
      id: 'p4',
      authorNickname: '📚 Campus Butterfly',
      category: '🎓 College Life',
      content:
        language === 'hi'
          ? 'कॉलेज में अचानक हेवी फ्लो शुरू हो गया और बैग में एक्स्ट्रा पैड नहीं था। क्लासमेट दीदी ने चुपके से मदद की। गर्ल्स सपोर्टिंग गर्ल्स हमेशा बेस्ट फीलिंग है 💕'
          : 'My period surprised me during a 3-hour college lecture and I ran out of supplies. A senior sister in the washroom immediately offered a pad with a warm hug. Girls supporting girls forever! 🎀',
      likes: 35,
      likedByUser: false,
      savedByUser: false,
      timeAgo: '1d ago',
      replies: [],
    },
    {
      id: 'p5',
      authorNickname: '✨ Little Star',
      category: '❓ Ask Sakhi',
      content:
        language === 'hi'
          ? 'क्या पीरियड के दौरान ठंडा पानी या आइसक्रीम सच में ऐंठन बढ़ाती है, या यह सिर्फ एक मिथक है?'
          : 'Does drinking ice cold water or having ice cream during day 1 really worsen menstrual cramps, or is it just an old wives tale?',
      likes: 19,
      likedByUser: false,
      savedByUser: false,
      timeAgo: '1d ago',
      replies: [
        {
          id: 'r5',
          author: '🩺 Doctor Sakhi',
          text:
            language === 'hi'
              ? 'ठंडे पानी से पेट की मांसपेशियों में हल्का संकुचन हो सकता है। गुनगुना पानी रक्त प्रवाह और ऐंठन को शांत रखने में बेहतर है।'
              : 'Cold foods can cause mild reflexive visceral spasms in sensitive individuals. Warm ginger/chamomile infusions promote smooth uterine muscle relaxation.',
          time: '18h ago',
        },
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('🌸 Periods');
  const [isPosting, setIsPosting] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reportModalPostId, setReportModalPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Spam or inappropriate');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleToggleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextSaved = !p.savedByUser;
          showToast(nextSaved ? '💗 Post saved to your bookmarks!' : 'Post removed from saved');
          return {
            ...p,
            savedByUser: nextSaved,
          };
        }
        return p;
      })
    );
  };

  const handleConfirmReport = () => {
    if (!reportModalPostId) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === reportModalPostId) {
          return { ...p, reported: true };
        }
        return p;
      })
    );
    setReportModalPostId(null);
    showToast('🛡️ Thank you. The post has been flagged for moderator review.');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const cuteNicknames = [
      '🌸 Sakura Petal',
      '✨ Starlight Sister',
      '🌷 Gentle Rose',
      '🦋 Free Butterfly',
      '🌿 Herb Blossom',
      '🧸 Cozy Blanket',
      '🎀 Velvet Ribbon',
      '🫶 Warm Hug',
    ];
    const randomNick = cuteNicknames[Math.floor(Math.random() * cuteNicknames.length)];

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      authorNickname: randomNick,
      category: newCategory,
      content: newContent,
      likes: 1,
      likedByUser: true,
      savedByUser: false,
      timeAgo: 'Just now',
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setIsPosting(false);
    showToast('✨ Your anonymous question has been posted to Sakhi Circle!');
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const cuteNicknames = ['🌸 Sweet Sakhi', '✨ Star Didi', '💗 Gentle Soul', '🎀 Velvet Sister'];
    const randomNick = cuteNicknames[Math.floor(Math.random() * cuteNicknames.length)];

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `r-${Date.now()}`,
                author: randomNick,
                text: replyText,
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyText('');
    setActiveReplyPostId(null);
    showToast('💕 Your loving reply was shared anonymously!');
  };

  const visiblePosts = posts
    .filter((p) => !p.reported)
    .filter((p) => (filterSavedOnly ? p.savedByUser : true))
    .filter((p) => (selectedCategory === 'All' ? true : p.category === selectedCategory));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#7A1E34] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg border border-pink-300 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gentle Kindness & Privacy Banner */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-4 sm:p-5 border border-pink-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-2xs border border-pink-100 flex-shrink-0">
            🌸
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#4A1E29]">
              “Be kind. Don't share personally identifying information.” 💗
            </h4>
            <p className="text-[11px] sm:text-xs text-[#7A4B55]">
              Sakhi Circle is a safe, 100% anonymous sanctuary for sisters. Real names, emails and phone numbers are never shown.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFilterSavedOnly(!filterSavedOnly)}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterSavedOnly
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{filterSavedOnly ? 'Showing Saved' : 'Saved Posts'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>Sakhi Circle • Anonymous & Safe Community</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.forumTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">
          Ask questions, share remedies, and support each other through every cycle phase with total privacy.
        </p>
      </div>

      {/* Category Pills & Post Trigger */}
      <div className="space-y-3 bg-white/75 backdrop-blur-md rounded-3xl p-4 border border-[#F4DFE2] shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                    : 'bg-[#FFF9F6] text-[#6E3C48] hover:bg-[#FCEEE9] border border-[#ECCACF]'
                }`}
              >
                {cat === 'All' ? t.filterAll : cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPosting(!isPosting)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-xs hover:opacity-95 transition-all ml-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask or Share 🌸</span>
          </button>
        </div>
      </div>

      {/* Post creation card if open */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-[#FAD2D8] shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#8A1E38] uppercase tracking-wide flex items-center gap-1.5">
              <span>🌸 Post Anonymously to Sakhi Circle</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7A4B55]">Category:</span>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-[#ECCACF] bg-[#FFF9F6] text-[#4A262E] focus:outline-none"
              >
                {categories
                  .filter((c) => c !== 'All')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share your experience, ask about cramps, remedies, or vent freely. You will appear with a cute floral pseudonym!"
            className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-[#D86B84] focus:ring-1 focus:ring-[#D86B84]"
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-[#8A5A66] italic">
              🔒 No personal data or identity is ever attached.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#7A4B55] hover:bg-[#FCEEE9]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs"
              >
                Post Anonymously ✨
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="text-center py-12 bg-white/70 rounded-3xl border border-pink-200 p-8 space-y-2">
            <p className="text-3xl">🌸</p>
            <h4 className="font-serif text-lg font-bold text-[#4A1E29]">No posts found in this section</h4>
            <p className="text-xs text-[#7A4B55]">Be the first sister to ask a question or share a thought!</p>
          </div>
        ) : (
          visiblePosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-3.5 transition-all hover:border-[#FAD2D8]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#8A1E38] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-pink-200">
                    {post.authorNickname}
                  </span>
                  <span className="text-[11px] text-[#A66F7B]">• {post.timeAgo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A63A50] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {post.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReportModalPostId(post.id)}
                    aria-label="Report post"
                    className="text-[#9E6571] hover:text-rose-600 p-1 rounded-full transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4A262E] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F7E7E9]">
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`inline-flex items-center gap-1.5 transition-colors ${
                      post.likedByUser ? 'text-rose-600 font-bold' : 'text-[#7A4B55] hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.likedByUser ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>
                      {post.likes} {t.likeAction}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                    }
                    className="inline-flex items-center gap-1.5 text-[#7A4B55] hover:text-[#5C2E38]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {post.replies.length} {t.replies}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSave(post.id)}
                  className={`inline-flex items-center gap-1 text-xs transition-colors ${
                    post.savedByUser ? 'text-rose-600 font-bold' : 'text-[#8A5A66] hover:text-rose-600'
                  }`}
                >
                  {post.savedByUser ? (
                    <BookmarkCheck className="w-4 h-4 fill-rose-100" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span>{post.savedByUser ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Replies section */}
              {post.replies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-pink-50">
                  {post.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] text-xs text-[#522932] space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#9E6571]">
                        <span className="font-semibold text-[#8B263E]">{reply.author}</span>
                        <span>{reply.time}</span>
                      </div>
                      <p>{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Form */}
              {activeReplyPostId === post.id && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a loving, kind reply anonymously..."
                    className="flex-1 px-3.5 py-2 rounded-full bg-[#FFF9F6] border border-[#ECCACF] text-xs text-[#4A262E] focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddReply(post.id)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold hover:opacity-90"
                  >
                    Reply 💕
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      {reportModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Report Harmful Content</span>
            </div>
            <p className="text-xs text-[#7A4B55]">
              Help us keep Sakhi Circle safe and respectful. Why are you reporting this post?
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-pink-200 bg-pink-50/50 text-[#4A262E] focus:outline-none"
            >
              <option value="Spam or advertising">Spam or advertising</option>
              <option value="Hate speech or unkindness">Hate speech or unkindness</option>
              <option value="Personal data or phone numbers">Personal data or phone numbers</option>
              <option value="Misleading health claims">Misleading health claims</option>
              <option value="Other">Other concern</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalPostId(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#7A4B55] hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReport}
                className="px-4 py-2 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs hover:bg-rose-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
