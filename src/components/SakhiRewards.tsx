import React, { useState } from 'react';
import { useTokens } from '../context/TokenContext';
import { RewardProduct } from '../types/tokens';
import {
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Gift,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
} from 'lucide-react';

export const REWARD_PRODUCTS: RewardProduct[] = [
  {
    id: 'rew_pads_1',
    name: 'Carmesi Organic Cotton Pads (Pack of 10)',
    category: 'pads',
    categoryName: '🩷 Pads',
    description: '100% pure organic cotton top-sheet, chemical-free & biodegradable.',
    badge: 'Best Seller 🌸',
    priceInRupees: 199,
    tokenPrice: 500,
    rating: 4.8,
    reviewCount: 3120,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    ecoScore: 'Biodegradable & Hypoallergenic',
    features: ['Zero plastic toxins', 'Wide wings for zero leak', 'Super soft cotton'],
    isDemo: true,
  },
  {
    id: 'rew_cup_1',
    name: 'Sirona Medical Grade Silicone Cup (Size S/M)',
    category: 'cups',
    categoryName: '🌸 Menstrual Cups',
    description: '100% medical-grade silicone with easy ring pull for 8–10 hours leak-free freedom.',
    badge: 'Doctor Recommended 🩺',
    priceInRupees: 349,
    tokenPrice: 850,
    rating: 4.9,
    reviewCount: 5410,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    ecoScore: 'Zero Waste (Reusable 5+ Years)',
    features: ['Up to 10 hours protection', 'BPA & latex free', 'Includes breathable pouch'],
    isDemo: true,
  },
  {
    id: 'rew_reusable_1',
    name: 'EcoFemme Washable Cloth Pads (Day Pad)',
    category: 'reusable',
    categoryName: '🌿 Reusable Pads',
    description: 'Handcrafted organic cotton cloth pads made by women artisans in Auroville, Tamil Nadu.',
    badge: 'Artisan Crafted 🌿',
    priceInRupees: 295,
    tokenPrice: 700,
    rating: 4.7,
    reviewCount: 1840,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    ecoScore: '100% Compostable Cotton',
    features: ['Lasts 75+ washes', 'Skin friendly & cool', 'Supports rural livelihoods'],
    isDemo: true,
  },
  {
    id: 'rew_underwear_1',
    name: 'HealthFab GoPadFree Leakproof Period Panty',
    category: 'underwear',
    categoryName: '🩲 Period Underwear',
    description: '4-layer moisture-wicking bamboo cotton absorbent underwear holding up to 3 tampons flow.',
    badge: 'Ultra Comfortable ✨',
    priceInRupees: 599,
    tokenPrice: 1400,
    rating: 4.8,
    reviewCount: 940,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    ecoScore: 'Sustainable Bamboo Fiber',
    features: ['Odor neutralizing', 'Washable 2+ years', 'Breathable seam-free'],
    isDemo: true,
  },
  {
    id: 'rew_liners_1',
    name: 'Nua Ultra Thin Daily Pantyliners (Pack of 25)',
    category: 'liners',
    categoryName: '💧 Pantyliners',
    description: 'Feather-light organic daily liners for ovulation discharge, spotting, or cup backup.',
    badge: 'Everyday Freshness 💧',
    priceInRupees: 149,
    tokenPrice: 380,
    rating: 4.6,
    reviewCount: 2210,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    ecoScore: 'Chlorine-free bleached',
    features: ['1mm thin design', 'Individually wrapped', 'Breathable bottom film'],
    isDemo: true,
  },
  {
    id: 'rew_kit_1',
    name: 'Sakhi First Period & Cramp Sanctuary Gift Kit',
    category: 'kits',
    categoryName: '🎁 Wellness Kits',
    description: 'Complete care box with organic pads, heating herbal patch, dark artisan chocolate, and chamomile tea.',
    badge: 'Ultimate Care Box 🎀',
    priceInRupees: 799,
    tokenPrice: 1950,
    rating: 5.0,
    reviewCount: 820,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    ecoScore: 'Eco Box Packaging',
    features: ['Cramp heat gel pack', 'Calming tea blend', 'Organic pads + satin pouch'],
    isDemo: true,
  },
];

interface SakhiRewardsProps {
  onEarnTokensClick?: () => void;
}

export const SakhiRewards: React.FC<SakhiRewardsProps> = ({ onEarnTokensClick }) => {
  const { tokens, spendTokens } = useTokens();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<RewardProduct | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<'tokens' | 'money' | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Rewards 🌸' },
    { id: 'pads', label: '🩷 Pads' },
    { id: 'reusable', label: '🌿 Reusable' },
    { id: 'cups', label: '🌸 Menstrual Cups' },
    { id: 'underwear', label: '🩲 Period Underwear' },
    { id: 'liners', label: '💧 Pantyliners' },
    { id: 'kits', label: '🎁 Wellness Kits' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? REWARD_PRODUCTS
      : REWARD_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleOpenCheckout = (product: RewardProduct, mode: 'tokens' | 'money') => {
    setSelectedProduct(product);
    setCheckoutMode(mode);
  };

  const handleConfirmRedeem = () => {
    if (!selectedProduct) return;

    if (tokens < selectedProduct.tokenPrice) {
      return;
    }

    const success = spendTokens(selectedProduct.tokenPrice, selectedProduct.name);
    if (success) {
      setOrderSuccess(`Order confirmed! 🌸 Redeemed ${selectedProduct.name} with ${selectedProduct.tokenPrice} Sakhi Tokens.`);
      setTimeout(() => {
        setSelectedProduct(null);
        setCheckoutMode(null);
        setOrderSuccess(null);
      }, 3500);
    }
  };

  const handleConfirmMoneyPurchase = () => {
    if (!selectedProduct) return;
    setOrderSuccess(`Demo Order placed for ${selectedProduct.name} (₹${selectedProduct.priceInRupees}). Thank you for supporting women's health! 💗`);
    setTimeout(() => {
      setSelectedProduct(null);
      setCheckoutMode(null);
      setOrderSuccess(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-[#FFF9FA] to-[#FCEEE9] border border-pink-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-800 text-xs font-bold border border-pink-200">
            <span>🎀 Sakhi Rewards Shop</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1E29] tracking-tight">
            Turn Healthy Self-Care Habits Into Real Period Products 🌸
          </h2>
          <p className="text-xs sm:text-sm text-[#7A4B55]">
            Every breathing exercise, mood log, and educational video adds to your balance. Redeem verified eco-friendly pads, cups, and kits or purchase directly.
          </p>
        </div>

        {/* Current Token Counter Card */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-pink-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs flex-shrink-0 min-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E6571]">
            Your Sakhi Balance
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#7A1E34] font-serif">
              ✨ {tokens.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-pink-700 font-semibold block mt-1">
            Ready for redemption
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'bg-white/80 border border-pink-200 text-[#6E3C48] hover:bg-pink-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const hasEnoughTokens = tokens >= p.tokenPrice;
          const missingTokens = p.tokenPrice - tokens;

          return (
            <div
              key={p.id}
              className="bg-white/90 backdrop-blur-md border border-[#F4DFE2] rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-48 w-full bg-pink-50 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-700 border border-pink-200 shadow-2xs">
                    {p.badge}
                  </div>
                  {p.isDemo && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white tracking-wider uppercase">
                      Demo Product
                    </div>
                  )}
                  <div className="absolute bottom-2 left-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <span>🌿</span>
                    <span>{p.ecoScore}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-pink-700">
                      {p.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                      <span className="text-gray-400">({p.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#4A1E29] line-clamp-1">
                    {p.name}
                  </h3>

                  <p className="text-xs text-[#7A4B55] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {p.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-pink-50 text-[#7A4B55] border border-pink-100"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Buy Buttons */}
              <div className="p-5 pt-0 border-t border-pink-50 mt-4 space-y-3">
                <div className="flex items-baseline justify-between pt-3">
                  <div>
                    <span className="text-lg font-extrabold text-[#7A1E34] font-serif">
                      ₹{p.priceInRupees}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-1">M.R.P</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>{p.tokenPrice} Tokens</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(p, 'money')}
                    className="py-2 px-3 rounded-xl border border-pink-300 text-pink-800 text-xs font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(p, 'tokens')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1 ${
                      hasEnoughTokens
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-xs hover:opacity-95'
                        : 'bg-gray-400 hover:bg-gray-500 cursor-pointer'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Use Tokens</span>
                  </button>
                </div>

                {!hasEnoughTokens && (
                  <p className="text-[10px] text-[#A63A50] text-center font-medium">
                    You need {missingTokens} more Tokens ✨
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedProduct && checkoutMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-pink-200 shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setCheckoutMode(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {orderSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                  🌸
                </div>
                <h3 className="font-serif text-xl font-bold text-emerald-800">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-[#7A4B55] max-w-xs mx-auto">
                  {orderSuccess}
                </p>
                <div className="p-3 bg-pink-50 rounded-2xl text-[11px] text-pink-800 font-medium">
                  🚚 Expected Delivery: 2–3 Days in discrete, eco-friendly Sakhi packaging.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {checkoutMode === 'tokens' ? '✨' : '🛍️'}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                      {checkoutMode === 'tokens'
                        ? 'Redeem with Sakhi Tokens'
                        : 'Secure Checkout'}
                    </h3>
                    <p className="text-xs text-[#7A4B55]">
                      {selectedProduct.name}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-pink-50/70 border border-pink-100 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7A4B55]">Item</span>
                    <span className="font-bold text-[#4A1E29]">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A4B55]">Payment Mode</span>
                    <span className="font-bold text-rose-700">
                      {checkoutMode === 'tokens'
                        ? `${selectedProduct.tokenPrice} Sakhi Tokens`
                        : `₹${selectedProduct.priceInRupees} (Demo Payment)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A4B55]">Eco Packaging</span>
                    <span className="font-bold text-emerald-700">Free 🌿</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-pink-200 text-sm font-extrabold text-[#7A1E34]">
                    <span>Total</span>
                    <span>
                      {checkoutMode === 'tokens'
                        ? `${selectedProduct.tokenPrice} Tokens`
                        : `₹${selectedProduct.priceInRupees}`}
                    </span>
                  </div>
                </div>

                {checkoutMode === 'tokens' && tokens < selectedProduct.tokenPrice ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Not enough tokens yet!</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          You have {tokens} Tokens, but this item requires {selectedProduct.tokenPrice} Tokens (you need {selectedProduct.tokenPrice - tokens} more ✨).
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        setCheckoutMode(null);
                        onEarnTokensClick?.();
                      }}
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Earn Tokens with Daily Care</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={
                        checkoutMode === 'tokens'
                          ? handleConfirmRedeem
                          : handleConfirmMoneyPurchase
                      }
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {checkoutMode === 'tokens'
                          ? `Confirm & Redeem (${selectedProduct.tokenPrice} Tokens)`
                          : `Confirm Purchase (₹${selectedProduct.priceInRupees})`}
                      </span>
                    </button>
                    <p className="text-[10px] text-gray-500 text-center">
                      Discrete packaging guaranteed. 100% genuine products with manufacturer warranty.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
