import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { Heart, MessageCircle, Send, ShieldCheck, Sparkles, Filter, PlusCircle } from 'lucide-react';

interface ForumPost {
  id: string;
  authorNickname: string;
  category: string;
  content: string;
  likes: number;
  likedByUser: boolean;
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

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p1',
      authorNickname: '🌸 Lavender Soul',
      category: 'Cramps & Comfort',
      content:
        language === 'hi'
          ? 'पीरियड के पहले दिन मुझे बहुत तेज ऐंठन होती है। अजवाइन और गुड़ की चाय से मुझे बहुत राहत मिली। क्या कोई और घरेलू उपाय है जो काम करता है?'
          : 'First day cramps are so tough today! Warm ajwain-ginger tea with jaggery really helped soothe my uterus. What is your go-to natural comfort ritual?',
      likes: 24,
      likedByUser: false,
      timeAgo: '2h ago',
      replies: [
        {
          id: 'r1',
          author: '✨ Moonlight Sister',
          text: language === 'hi' ? 'नाभि पर गर्म तिल के तेल की हल्की मालिश और कैस्टर ऑयल पैक भी बहुत आराम देता है!' : 'Castor oil pack on lower abdomen and warm socks work wonders! Stay cozy dear ❤️',
          time: '1h ago',
        },
      ],
    },
    {
      id: 'p2',
      authorNickname: '🌿 Bloom Girl',
      category: 'PCOS & Hormones',
      content:
        language === 'hi'
          ? 'PCOS में पीरियड अनियमति होना बहुत तनाव देता है। क्या सीड साइकलिंग (अलसी और कद्दू के बीज) सच में मदद करती है?'
          : 'Dealing with irregular cycles from PCOS can be emotionally exhausting. Has seed cycling (flax + pumpkin seeds) helped anyone regulate their flow?',
      likes: 42,
      likedByUser: false,
      timeAgo: '5h ago',
      replies: [
        {
          id: 'r2',
          author: '🌷 Sunflower Didi',
          text: language === 'hi' ? 'हाँ सखी! मैंने 3 महीने लगातार किया, सुबह अलसी का पाउडर दलिया में खाया और मेरा चक्र 31 दिनों पर आ गया।' : 'Yes! Consistency is key. Eating freshly ground flaxseeds in breakfast oatmeal noticeably helped my energy and cycle timing!',
          time: '3h ago',
        },
      ],
    },
    {
      id: 'p3',
      authorNickname: '☕ Chai Lover',
      category: 'Mood & Emotions',
      content:
        language === 'hi'
          ? 'ल्यूटियल फेज में बिना किसी बात के रोना आ जाता है। बस यह याद दिलाना था कि तुम अकेली नहीं हो, यह तुम्हारे हार्मोन्स हैं, तुम कमजोर नहीं हो 💗'
          : 'Just a gentle reminder to anyone in their luteal phase crying for no reason today: You are not crazy, your progesterone is just shifting. You are safe and doing your best 💗',
      likes: 67,
      likedByUser: false,
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
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Cramps & Comfort');
  const [isPosting, setIsPosting] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const categories = [
    'All',
    'Cramps & Comfort',
    'PCOS & Hormones',
    'Mood & Emotions',
    'First Period & Teens',
    'Diet & Teas',
  ];

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
    ];
    const randomNick = cuteNicknames[Math.floor(Math.random() * cuteNicknames.length)];

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      authorNickname: randomNick,
      category: newCategory,
      content: newContent,
      likes: 1,
      likedByUser: true,
      timeAgo: 'Just now',
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setIsPosting(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const cuteNicknames = ['🌸 Sweet Sakhi', '✨ Star Didi', '💗 Gentle Soul'];
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
  };

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>{t.anonymousBadge}</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.forumTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.forumSub}</p>
      </div>

      {/* Action to create post */}
      <div className="flex justify-between items-center bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-[#F4DFE2] shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#C04D68] text-white shadow-xs'
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
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white shadow-xs hover:from-[#C75A73] hover:to-[#AC3E57] transition-all ml-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createPost}</span>
        </button>
      </div>

      {/* Post creation card if open */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#FAD2D8] shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A1E38] uppercase tracking-wide">
              {t.createPost} • Posting Anonymously
            </span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[#ECCACF] bg-[#FFF9F6] text-[#4A262E] focus:outline-none"
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={t.postContentPlaceholder}
            className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-[#D86B84] focus:ring-1 focus:ring-[#D86B84]"
          />

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
              className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white shadow-xs"
            >
              {t.postSubmit}
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-sm space-y-3.5 transition-all hover:border-[#FAD2D8]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[#8A1E38] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-pink-200">
                  {post.authorNickname}
                </span>
                <span className="text-[11px] text-[#A66F7B]">• {post.timeAgo}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A63A50] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {post.category}
              </span>
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
                  placeholder="Write a loving supportive reply..."
                  className="flex-1 px-3.5 py-2 rounded-full bg-[#FFF9F6] border border-[#ECCACF] text-xs text-[#4A262E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddReply(post.id)}
                  className="px-4 py-2 rounded-full bg-[#C04D68] text-white text-xs font-semibold hover:bg-[#A63A50]"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
