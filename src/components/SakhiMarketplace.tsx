import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { useTokens } from '../context/TokenContext';
import {
  PARTNER_BRANDS,
  INITIAL_MARKETPLACE_PRODUCTS,
  INITIAL_REVENUE_STATS,
} from '../data/marketplaceData';
import {
  MarketplaceProduct,
  ProductCategory,
  CartItem,
  DeliveryAddress,
  MarketplaceOrder,
  PartnerBrand,
  MarketplaceRevenueStats,
} from '../types/marketplace';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Building2,
  Clock,
  RotateCcw,
  IndianRupee,
  Package,
  RefreshCw,
  Gift,
  HelpCircle,
  Eye,
} from 'lucide-react';

const STORAGE_MARKETPLACE_ORDERS = 'sakhi_marketplace_orders_v1';
const STORAGE_MARKETPLACE_WISHLIST = 'sakhi_marketplace_wishlist_v1';

export const SakhiMarketplace: React.FC = () => {
  const { t, language } = useTranslation();
  const { tokens, spendTokens } = useTokens();

  // Navigation between Views: 'shop' | 'cart' | 'orders' | 'wishlist' | 'admin' | 'revenue'
  type MarketplaceView = 'shop' | 'orders' | 'wishlist' | 'admin' | 'revenue';
  const [currentView, setCurrentView] = useState<MarketplaceView>('shop');

  // Products and Brands State (can be modified by Partner Admin Panel)
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_MARKETPLACE_PRODUCTS);
  const [brands, setBrands] = useState<PartnerBrand[]>(PARTNER_BRANDS);
  const [revenueStats, setRevenueStats] = useState<MarketplaceRevenueStats>(INITIAL_REVENUE_STATS);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  // Product Detail Modal
  const [activeProductDetail, setActiveProductDetail] = useState<MarketplaceProduct | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_MARKETPLACE_WISHLIST);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem(STORAGE_MARKETPLACE_WISHLIST, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Orders State
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_MARKETPLACE_ORDERS);
      if (s) return JSON.parse(s);
    } catch {
      // ignore
    }
    return [
      {
        id: 'ord_demo_101',
        orderNumber: 'SK-2026-9481',
        createdAt: new Date(Date.now() - 3600000 * 24).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [
          {
            product: INITIAL_MARKETPLACE_PRODUCTS[0],
            quantity: 1,
            paymentPreference: 'combo',
          },
        ],
        totalMrp: 299,
        totalSakhiPrice: 229,
        paidRupees: 179,
        paidTokens: 500,
        paymentMethod: 'token_combo',
        paymentStatus: 'success',
        deliveryStatus: 'dispatched',
        trackingStatusMessage: 'Dispatched with love from Bengaluru Hub 🌸 (Expected delivery in 2 days)',
        shippingAddress: {
          fullName: 'Aditi Sharma',
          phone: '+91 98765 43210',
          pincode: '560034',
          addressLine: 'Flat 402, Lotus Greens, Koramangala',
          city: 'Bengaluru',
          state: 'Karnataka',
        },
        isDemoTransaction: true,
      },
    ];
  });

  // Checkout Flow Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'money' | 'tokens' | 'combo'>('combo');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<MarketplaceOrder | null>(null);

  // Address State
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: 'Sakhi User',
    phone: '+91 98765 43210',
    pincode: '110001',
    addressLine: 'A-42, Gulmohar Enclave',
    city: 'New Delhi',
    state: 'Delhi',
  });

  // Cart operations
  const addToCart = (product: MarketplaceProduct, pref: 'money' | 'tokens' | 'combo' = 'combo') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, paymentPreference: pref }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Cart Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalMrp = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const cartTotalSakhiPrice = cart.reduce((sum, item) => sum + item.product.sakhiPrice * item.quantity, 0);
  const cartTotalSavings = cartTotalMrp - cartTotalSakhiPrice;
  const cartTotalTokenPrice = cart.reduce((sum, item) => sum + item.product.tokenPrice * item.quantity, 0);

  // Combo calculations: Allow redeeming up to maxTokenDiscount per item using tokens
  const maxEligibleTokenDiscount = cart.reduce(
    (sum, item) => sum + item.product.maxTokenDiscount * item.quantity,
    0
  );
  // 10 Tokens = ₹1 discount ratio
  const tokensNeededForMaxDiscount = maxEligibleTokenDiscount * 10;
  const appliedTokensInCombo = Math.min(tokens, tokensNeededForMaxDiscount);
  const discountFromTokensInCombo = Math.floor(appliedTokensInCombo / 10);
  const finalComboRupees = Math.max(0, cartTotalSakhiPrice - discountFromTokensInCombo);

  // Place Order Logic
  const handleProceedCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep('address');
    setPaymentError(null);
  };

  const handleExecutePayment = () => {
    setPaymentProcessing(true);
    setPaymentError(null);

    // Validate token balance if token method chosen
    if (checkoutPaymentMethod === 'tokens' && tokens < cartTotalTokenPrice) {
      setPaymentProcessing(false);
      setPaymentError(`You need ${cartTotalTokenPrice - tokens} more Sakhi Tokens ✨ to pay 100% with Tokens.`);
      return;
    }

    if (checkoutPaymentMethod === 'combo' && tokens < appliedTokensInCombo && appliedTokensInCombo > 0) {
      setPaymentProcessing(false);
      setPaymentError('Insufficient token balance for this combo discount.');
      return;
    }

    // Simulate secure Indian payment gateway checkout
    setTimeout(() => {
      let paidRupees = 0;
      let paidTokens = 0;

      if (checkoutPaymentMethod === 'money') {
        paidRupees = cartTotalSakhiPrice;
        paidTokens = 0;
      } else if (checkoutPaymentMethod === 'tokens') {
        paidRupees = 0;
        paidTokens = cartTotalTokenPrice;
        spendTokens(paidTokens, `Marketplace: ${cart.length} Period Care items`, '🛍️');
      } else {
        // Combo
        paidRupees = finalComboRupees;
        paidTokens = appliedTokensInCombo;
        if (paidTokens > 0) {
          spendTokens(paidTokens, `Combo discount on ${cart.length} items`, '🛍️');
        }
      }

      const newOrder: MarketplaceOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `SK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...cart],
        totalMrp: cartTotalMrp,
        totalSakhiPrice: cartTotalSakhiPrice,
        paidRupees,
        paidTokens,
        paymentMethod:
          checkoutPaymentMethod === 'money'
            ? 'money_gateway'
            : checkoutPaymentMethod === 'tokens'
            ? 'tokens_only'
            : 'token_combo',
        paymentStatus: 'success',
        deliveryStatus: 'dispatched',
        trackingStatusMessage: 'Order confirmed! Dispatched with love 🌸 via Delhivery Express',
        shippingAddress: { ...address },
        isDemoTransaction: true,
      };

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      try {
        localStorage.setItem(STORAGE_MARKETPLACE_ORDERS, JSON.stringify(updatedOrders));
      } catch {
        // ignore
      }

      // Update mock revenue stats
      setRevenueStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        totalGrossSales: prev.totalGrossSales + paidRupees,
        platformRevenue: prev.platformRevenue + Math.round(paidRupees * 0.15),
        supplierPayouts: prev.supplierPayouts + Math.round(paidRupees * 0.85),
        tokenRedemptionsCount: prev.tokenRedemptionsCount + (paidTokens > 0 ? 1 : 0),
      }));

      setLastPlacedOrder(newOrder);
      setCart([]);
      setPaymentProcessing(false);
      setCheckoutStep('confirmation');
    }, 1400);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBrandFilter !== 'all' && p.brandId !== selectedBrandFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Girly Marketplace Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-100 via-[#FFF0F5] to-amber-100 border border-pink-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-rose-700 text-xs font-bold border border-pink-200 shadow-2xs">
              <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
              <span>Sakhi Marketplace 🛍️ • Verified Indian Period Care</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A1E29] tracking-tight">
              Accessible Care, Direct from Ethical Small Brands 🌸
            </h1>
            <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed">
              We partner directly with verified Indian manufacturers to eliminate middleman markups.
              Enjoy transparent pricing, pay with money or <strong>Sakhi Tokens</strong>, and support women-led businesses.
            </p>
          </div>

          {/* Quick Actions & Navigation Tabs */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'shop'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-rose-700 border border-pink-200'
              }`}
            >
              <span>🛍️</span>
              <span>Shop All</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('orders')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'orders'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-rose-700 border border-pink-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('wishlist')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'wishlist'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-rose-700 border border-pink-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('revenue')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'revenue'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-rose-700 border border-pink-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Revenue Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-rose-700 border border-pink-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Partner Admin</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs flex items-center gap-2 hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartItemCount})</span>
              {cartTotalSakhiPrice > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                  ₹{cartTotalSakhiPrice}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- VIEW 1: SHOPPING CATALOG --- */}
      {currentView === 'shop' && (
        <div className="space-y-6">
          {/* Support Local Small Brands Spotlight */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                    Support Local Sakhi Brands & Emerging Startups
                  </h3>
                  <p className="text-xs text-[#7A4B55]">
                    Discover affordable period-care products from verified Indian brands and women-led cooperatives.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Toxin-Free & Verified
              </span>
            </div>

            {/* Brand Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedBrandFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                  selectedBrandFilter === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-pink-50 text-rose-700 hover:bg-pink-100'
                }`}
              >
                All Brands ({brands.length})
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBrandFilter(b.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1.5 transition-all ${
                    selectedBrandFilter === b.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white hover:bg-pink-50 text-[#5C2E38] border border-pink-200'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-rose-500">{b.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search pads, cups, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-pink-200 text-xs text-[#4A1E29] placeholder:text-[#9E6571] focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-2xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center w-full md:w-auto">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'pads', label: '🩷 Pads' },
                { id: 'reusable', label: '🌿 Reusable' },
                { id: 'cups', label: '🌸 Cups' },
                { id: 'tampons', label: '💧 Tampons' },
                { id: 'underwear', label: '🩲 Underwear' },
                { id: 'liners', label: '✨ Liners' },
                { id: 'kits', label: '🎁 Kits' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-pink-50 text-[#6E3C48] border border-pink-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200 shadow-2xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-pink-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isSponsored && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
                          Sponsored
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-white/90 text-rose-800 text-[10px] font-bold shadow-2xs border border-pink-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Partner</span>
                      </span>
                    </div>

                    {/* Wishlist toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-600 flex items-center justify-center shadow-xs transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`}
                      />
                    </button>

                    {/* Pack size ribbon */}
                    <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {product.packSize}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#8A5A66]">
                        <span className="font-bold text-rose-700">{product.brandName}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold text-[#4A1E29]">{product.rating}</span>
                          <span className="text-[10px] text-gray-500">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-base font-bold text-[#4A1E29] leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#7A4B55] line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Transparent Price & Token Options */}
                    <div className="space-y-2 pt-2 border-t border-pink-100">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-[#7A1E34] font-serif">
                            ₹{product.sakhiPrice}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            MRP ₹{product.mrp}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Save ₹{product.savings}
                        </span>
                      </div>

                      {/* Token Price Alternative */}
                      <div className="flex items-center justify-between text-xs bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200">
                        <span className="text-amber-900 font-medium">Or 100% Tokens:</span>
                        <span className="font-bold text-amber-800 flex items-center gap-1">
                          <span>✨</span>
                          <span>{product.tokenPrice} Tokens</span>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveProductDetail(product)}
                          className="py-2 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-rose-800 border border-pink-200 flex items-center justify-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 'combo')}
                          className="py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs hover:opacity-95 flex items-center justify-center gap-1 transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- VIEW 2: MY ORDERS --- */}
      {currentView === 'orders' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">My Orders 📦</h2>
              <p className="text-xs text-[#7A4B55]">
                Track shipments, view payment receipts, and reorder favourite essentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-gradient-to-r from-[#FFF5F8] to-[#FFF9FA] border border-pink-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#4A1E29]">Order #{ord.orderNumber}</span>
                    <span className="text-gray-500 ml-2">Placed on {ord.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {ord.paymentStatus === 'success' ? 'Payment Verified ✅' : ord.paymentStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-rose-800 font-bold text-[11px]">
                      {ord.deliveryStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 border-t border-pink-100 pt-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-pink-200"
                        />
                        <div>
                          <span className="font-bold text-[#4A1E29] block">{item.product.name}</span>
                          <span className="text-[11px] text-gray-500">
                            Qty: {item.quantity} • {item.product.packSize}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#7A1E34]">
                          ₹{item.product.sakhiPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Timeline Callout */}
                <div className="bg-white/80 p-3 rounded-xl border border-pink-200 text-xs flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[#7A4B55]">
                    <Truck className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>{ord.trackingStatusMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      ord.items.forEach((it) => addToCart(it.product));
                    }}
                    className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                  >
                    Buy Again 🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VIEW 3: WISHLIST --- */}
      {currentView === 'wishlist' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">My Wishlist ❤️</h2>
              <p className="text-xs text-[#7A4B55]">Items you've saved for future periods.</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <span className="text-4xl">🌷</span>
              <h3 className="font-serif text-lg font-bold text-[#4A1E29]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#7A4B55] max-w-sm mx-auto">
                Explore menstrual cups, organic pads, and care hampers, then tap the heart icon to save them here!
              </p>
              <button
                type="button"
                onClick={() => setCurrentView('shop')}
                className="px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs"
              >
                Start Browsing 🌸
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products
                .filter((p) => wishlist.includes(p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl border border-pink-200 bg-white space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-pink-200"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-rose-600 block">
                          {product.brandName}
                        </span>
                        <span className="font-serif font-bold text-xs text-[#4A1E29] block line-clamp-1">
                          {product.name}
                        </span>
                        <span className="font-bold text-[#7A1E34] text-xs">₹{product.sakhiPrice}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* --- VIEW 4: REVENUE DASHBOARD --- */}
      {currentView === 'revenue' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sakhi Sustainable Revenue Architecture</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Marketplace Financials & Impact</h2>
              <p className="text-xs text-[#7A4B55]">
                Transparent view of gross orders, brand payouts, platform margins, and token transactions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Back to Store 🛍️
            </button>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-50 to-rose-50 border border-pink-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                Total Orders
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#4A1E29]">
                {revenueStats.totalOrders}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">+18% this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Gross Product Sales
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#4A1E29]">
                ₹{revenueStats.totalGrossSales.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">Avg Order: ₹{revenueStats.avgOrderValue}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Platform Margin Revenue
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#7A1E34]">
                ₹{revenueStats.platformRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-500 block">~15% transparent fee</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-50 to-pink-50 border border-purple-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">
                Supplier Payouts
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#4A1E29]">
                ₹{revenueStats.supplierPayouts.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">Paid to Indian Makers</span>
            </div>
          </div>

          {/* Pricing Engine Formula Breakdown */}
          <div className="bg-[#FFF9FA] border border-pink-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#4A1E29]">
              How Sakhi Calculates Transparent Affordable Pricing:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-pink-100">
                <span className="font-bold text-gray-500 block">Supplier Cost</span>
                <span className="font-bold text-[#4A1E29]">Raw Maker Price</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-pink-100">
                <span className="font-bold text-gray-500 block">+ Logistics & Tax</span>
                <span className="font-bold text-[#4A1E29]">₹35 – ₹50 Flat Shipping</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-pink-100">
                <span className="font-bold text-gray-500 block">+ Platform Margin</span>
                <span className="font-bold text-[#7A1E34]">~12% – 18%</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-700 block">= Sakhi Final Price</span>
                <span className="font-bold text-emerald-700 font-serif">15%–30% Below MRP!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW 5: PARTNER ADMIN PANEL --- */}
      {currentView === 'admin' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Partner & Catalog Administration</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Supplier & Brand Directory</h2>
              <p className="text-xs text-[#7A4B55]">
                Verify new Indian startups, adjust supplier margins, and control available inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Exit Admin Mode 🌸
            </button>
          </div>

          {/* Partner Brands List */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#4A1E29]">
              Registered Indian Brand Partners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-pink-200 bg-white/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#4A1E29]">{b.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.verifiedStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.verifiedStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.verifiedStatus === 'verified' ? '✅ Verified Partner' : b.verifiedStatus}
                      </span>
                    </div>
                    <span className="text-xs text-rose-600 block">{b.location}</span>
                    <p className="text-xs text-[#7A4B55]">{b.founderStory}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-pink-100">
                    <span className="text-[11px] text-gray-500">{b.badge}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStatus = b.verifiedStatus === 'verified' ? 'pending' : 'verified';
                        setBrands((prev) =>
                          prev.map((item) => (item.id === b.id ? { ...item, verifiedStatus: newStatus } : item))
                        );
                      }}
                      className="text-xs font-bold text-rose-700 hover:underline"
                    >
                      Toggle Verification
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- CART DRAWER MODAL --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-[#FFF0F5]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                  My Cart ({cartItemCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-pink-100 text-rose-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="text-4xl">🛍️</span>
                  <h4 className="font-serif text-base font-bold text-[#4A1E29]">Your Cart is Empty</h4>
                  <p className="text-xs text-[#7A4B55]">
                    Browse verified affordable pads, cups, and period kits.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl border border-pink-200 bg-[#FFF9FA] space-y-2.5"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-pink-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-rose-600 block">
                          {item.product.brandName}
                        </span>
                        <h4 className="font-serif font-bold text-xs text-[#4A1E29] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-bold text-xs text-[#7A1E34]">
                            ₹{item.product.sakhiPrice}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{item.product.mrp}
                          </span>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-pink-100">
                      <span className="text-[11px] text-gray-500">
                        Tokens: {item.product.tokenPrice * item.quantity} ✨
                      </span>
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-pink-200 px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.product.id, -1)}
                          className="hover:text-rose-600 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.product.id, 1)}
                          className="hover:text-rose-600 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-pink-200 bg-white space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Total MRP:</span>
                    <span className="line-through">₹{cartTotalMrp}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Direct Maker Discount:</span>
                    <span>-₹{cartTotalSavings}</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-sm text-[#4A1E29] pt-1 border-t border-pink-100">
                    <span>Subtotal:</span>
                    <span>₹{cartTotalSakhiPrice}</span>
                  </div>
                  <div className="text-[11px] text-[#8A5A66] flex items-center justify-between">
                    <span>Your Tokens: <strong>{tokens.toLocaleString()} ✨</strong></span>
                    <span className="text-emerald-700 font-bold">Standard shipping free</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedCheckout}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CHECKOUT FLOW MODAL --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">Sakhi Checkout 🌸</h3>
                <span className="text-xs text-pink-100">
                  {checkoutStep === 'address' && 'Step 1: Delivery Address'}
                  {checkoutStep === 'payment' && 'Step 2: Choose Payment Method'}
                  {checkoutStep === 'confirmation' && 'Order Confirmed!'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* STEP 1: ADDRESS */}
              {checkoutStep === 'address' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4A1E29] block">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29] focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4A1E29] block">Mobile (for SMS)</label>
                      <input
                        type="text"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4A1E29] block">Pincode</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4A1E29] block">Address Line</label>
                    <input
                      type="text"
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4A1E29] block">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4A1E29] block">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs text-[#4A1E29]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-2.5 mt-2 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:opacity-95"
                  >
                    Continue to Payment Options →
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD (Option A, B, C) */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <div className="text-xs text-[#7A4B55]">
                    Select how you would like to pay for your period care order:
                  </div>

                  {paymentError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Option A: Normal Money */}
                  <label
                    onClick={() => setCheckoutPaymentMethod('money')}
                    className={`p-3.5 rounded-2xl border block cursor-pointer transition-all ${
                      checkoutPaymentMethod === 'money'
                        ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-white border-pink-200 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-rose-600" />
                        <div>
                          <span className="font-bold text-xs text-[#4A1E29] block">
                            Option A: Normal Purchase (₹{cartTotalSakhiPrice})
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Pay via UPI / Debit Card / Net Banking (Demo Gateway)
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={checkoutPaymentMethod === 'money'}
                        onChange={() => setCheckoutPaymentMethod('money')}
                        className="text-rose-600"
                      />
                    </div>
                  </label>

                  {/* Option B: 100% Sakhi Tokens */}
                  <label
                    onClick={() => setCheckoutPaymentMethod('tokens')}
                    className={`p-3.5 rounded-2xl border block cursor-pointer transition-all ${
                      checkoutPaymentMethod === 'tokens'
                        ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-white border-pink-200 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="font-bold text-xs text-[#4A1E29] block">
                            Option B: 100% Sakhi Tokens (✨ {cartTotalTokenPrice} Tokens)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            You have: {tokens.toLocaleString()} Tokens
                            {tokens < cartTotalTokenPrice && ' (Insufficient balance)'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={checkoutPaymentMethod === 'tokens'}
                        onChange={() => setCheckoutPaymentMethod('tokens')}
                        className="text-rose-600"
                      />
                    </div>
                  </label>

                  {/* Option C: Token + Money Combo */}
                  <label
                    onClick={() => setCheckoutPaymentMethod('combo')}
                    className={`p-3.5 rounded-2xl border block cursor-pointer transition-all ${
                      checkoutPaymentMethod === 'combo'
                        ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-white border-pink-200 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gift className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="font-bold text-xs text-[#4A1E29] block">
                            Option C: Tokens + Money Combo
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Apply {appliedTokensInCombo} Tokens → Pay ₹{finalComboRupees}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={checkoutPaymentMethod === 'combo'}
                        onChange={() => setCheckoutPaymentMethod('combo')}
                        className="text-rose-600"
                      />
                    </div>
                  </label>

                  {/* Payment Architecture Notice */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <span className="font-bold block">🔒 Demo Gateway Mode Ready</span>
                    <span>
                      Transactions are simulated with authentic business rules. Real Razorpay/Stripe API keys can be securely attached via backend environment variables.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      className="px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleExecutePayment}
                      disabled={paymentProcessing}
                      className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md hover:opacity-95 disabled:opacity-50"
                    >
                      {paymentProcessing ? 'Processing Securely... 🌸' : 'Authorize & Place Order'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRMATION */}
              {checkoutStep === 'confirmation' && lastPlacedOrder && (
                <div className="text-center py-4 space-y-4 animate-in zoom-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
                    🌸
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#4A1E29]">
                      Thank You, Sakhi! 💗
                    </h3>
                    <p className="text-xs text-[#7A4B55]">
                      Your order #{lastPlacedOrder.orderNumber} has been received.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Charged:</span>
                      <span className="font-bold text-[#7A1E34]">
                        ₹{lastPlacedOrder.paidRupees}
                        {lastPlacedOrder.paidTokens > 0 && ` + ${lastPlacedOrder.paidTokens} ✨ Tokens`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Status:</span>
                      <span className="font-bold text-emerald-700">Dispatched with love 🌸</span>
                    </div>
                    <div className="text-[11px] text-gray-600 pt-1 border-t border-pink-100">
                      Shipping to: {lastPlacedOrder.shippingAddress.fullName}, {lastPlacedOrder.shippingAddress.city}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCurrentView('orders');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-xs"
                  >
                    View in My Orders 📦
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PRODUCT DETAIL MODAL --- */}
      {activeProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-pink-200 max-h-[90vh] flex flex-col">
            <div className="relative aspect-16/9 bg-pink-50">
              <img
                src={activeProductDetail.image}
                alt={activeProductDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveProductDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-700 flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-600">{activeProductDetail.brandName}</span>
                <h3 className="font-serif text-xl font-bold text-[#4A1E29]">
                  {activeProductDetail.name}
                </h3>
                <p className="text-xs text-[#7A4B55] leading-relaxed">
                  {activeProductDetail.shortDescription}
                </p>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 space-y-2 text-xs">
                <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block">
                  Transparent Price Engineering
                </span>
                <div className="flex justify-between text-gray-600">
                  <span>Supplier Maker Cost:</span>
                  <span>₹{activeProductDetail.supplierCost}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Packaging:</span>
                  <span>₹{activeProductDetail.shippingCost}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sakhi Sustainable Margin:</span>
                  <span>₹{activeProductDetail.platformMargin}</span>
                </div>
                <div className="flex justify-between font-bold text-[#7A1E34] pt-1 border-t border-pink-200">
                  <span>Sakhi Price (Save ₹{activeProductDetail.savings}):</span>
                  <span className="font-serif text-base">₹{activeProductDetail.sakhiPrice}</span>
                </div>
              </div>

              {/* Hygiene & Usage Instructions */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#4A1E29] block">🧴 Hygiene & Safe Usage Instructions:</span>
                <p className="text-[#7A4B55] bg-amber-50 p-3 rounded-xl border border-amber-200/80">
                  {activeProductDetail.hygieneInstructions}
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(activeProductDetail, 'combo');
                    setActiveProductDetail(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md hover:opacity-95"
                >
                  Add to Cart • ₹{activeProductDetail.sakhiPrice}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
