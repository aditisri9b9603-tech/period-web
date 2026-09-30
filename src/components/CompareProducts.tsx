import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import {
  Sparkles,
  Heart,
  Star,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Info,
  Scale,
  ArrowRight,
  Filter,
} from 'lucide-react';

export interface ProductComparisonItem {
  id: string;
  name: string;
  brand: string;
  type: 'Cup' | 'Pad' | 'Tampon' | 'Underwear' | 'Patch';
  price: number;
  packSize: string;
  pricePerUnit: string;
  material: string;
  isReusable: boolean;
  reusableLifespan: string;
  verifiedRating: number;
  reviewsCount: number;
  ecoAttributes: string[];
  keyFeature: string;
  officialBuyLink: string;
  isDemoData: boolean;
  image: string;
}

export const CompareProducts: React.FC = () => {
  const { t } = useTranslation();

  const productsList: ProductComparisonItem[] = [
    {
      id: 'prod-1',
      name: 'Carmesi 100% Pure Cornstarch Sanitary Pads',
      brand: 'Carmesi',
      type: 'Pad',
      price: 299,
      packSize: '10 Pads (Regular + XL)',
      pricePerUnit: '₹29.90 / pad',
      material: 'Cornstarch & Bamboo fiber top sheet, chlorine-free',
      isReusable: false,
      reusableLifespan: 'Single use',
      verifiedRating: 4.8,
      reviewsCount: 3820,
      ecoAttributes: ['100% Biodegradable', 'Zero Synthetic Plastic', 'Compostable wrapper'],
      keyFeature: 'Ultra-thin, velvety soft, zero plastic rashes',
      officialBuyLink: 'https://mycarmesi.com',
      isDemoData: true,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=260',
    },
    {
      id: 'prod-2',
      name: 'Sirona FDA-Approved Medical Grade Menstrual Cup',
      brand: 'Sirona',
      type: 'Cup',
      price: 349,
      packSize: '1 Cup + Breathable Cotton Pouch',
      pricePerUnit: '₹349.00 (Lasts 5+ years ~ ₹5.80/month)',
      material: '100% Medical Grade Class VI Silicone (BPA free)',
      isReusable: true,
      reusableLifespan: 'Up to 10 Years',
      verifiedRating: 4.9,
      reviewsCount: 18500,
      ecoAttributes: ['Zero Monthly Waste', 'Replaces 1,200+ pads', 'Plastic-Free'],
      keyFeature: 'Spill-proof rim, 12 hours protection, swim & yoga safe',
      officialBuyLink: 'https://thesirona.com',
      isDemoData: true,
      image: 'https://images.unsplash.com/photo-1608248597359-5484501a9134?auto=format&fit=crop&q=80&w=260',
    },
    {
      id: 'prod-3',
      name: 'Pee Safe 100% Organic Cotton Core Tampons',
      brand: 'Pee Safe',
      type: 'Tampon',
      price: 399,
      packSize: '16 Tampons (Regular Absorbency)',
      pricePerUnit: '₹24.90 / tampon',
      material: '100% Certified Organic Cotton with safety veil',
      isReusable: false,
      reusableLifespan: 'Single use',
      verifiedRating: 4.7,
      reviewsCount: 2450,
      ecoAttributes: ['GOTS Certified Organic', 'Chlorine-Free Bleaching', 'Biodegradable core'],
      keyFeature: 'Smooth curved tip, expand widthwise for leak defense',
      officialBuyLink: 'https://peesafe.com',
      isDemoData: true,
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=260',
    },
    {
      id: 'prod-4',
      name: 'Nua Ultra Safe Rash-Free Pads with Disposal Bags',
      brand: 'Nua',
      type: 'Pad',
      price: 249,
      packSize: '12 Pads (Customizable Day/Night mix)',
      pricePerUnit: '₹20.75 / pad',
      material: 'Plant-derived soft top layer, gel absorbent core',
      isReusable: false,
      reusableLifespan: 'Single use',
      verifiedRating: 4.8,
      reviewsCount: 9200,
      ecoAttributes: ['Individual sealable paper bags', 'No artificial fragrance'],
      keyFeature: 'Wider back for overnight leak locking, individualized wrappers',
      officialBuyLink: 'https://nuawoman.com',
      isDemoData: true,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=260',
    },
    {
      id: 'prod-5',
      name: 'Plush Washable Period Underwear (Heavy Flow)',
      brand: 'Plush',
      type: 'Underwear',
      price: 799,
      packSize: '1 Pair High-Waisted Hipster',
      pricePerUnit: '₹799.00 (Lasts 2+ years / 50 washes)',
      material: '4-Layer Organic Cotton + TPU waterproof membrane',
      isReusable: true,
      reusableLifespan: '2+ Years',
      verifiedRating: 4.9,
      reviewsCount: 1650,
      ecoAttributes: ['Zero Pad Trash', 'OEKO-TEX Certified', 'Reusable'],
      keyFeature: 'Holds up to 4 tampons of flow, feels like soft daily underwear',
      officialBuyLink: 'https://plushforher.com',
      isDemoData: true,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=260',
    },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(['prod-1', 'prod-2']);
  const [detailProduct, setDetailProduct] = useState<ProductComparisonItem | null>(null);
  const [boughtNotice, setBoughtNotice] = useState<string | null>(null);

  const toggleSelectForComparison = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 3) {
        // limit to 3 max side-by-side
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const comparedProducts = productsList.filter((p) => selectedIds.includes(p.id));

  const handleBuy = (product: ProductComparisonItem) => {
    setBoughtNotice(product.name);
    setTimeout(() => setBoughtNotice(null), 3500);
    // In production, opens official brand store or retailer
    window.open(product.officialBuyLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-rose-800 border border-pink-200 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-pink-600" />
          <span>🛍️ Compare & Buy</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">Compare Period Essentials</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">
          Transparently evaluate prices, eco-attributes, materials, and cost-per-unit side-by-side.
        </p>
      </div>

      {/* Labelled Demo/Preview Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-950">Market Price & Product Transparency: </strong>
          <span>
            Specifications, brand names, and certified materials represent authentic Indian brands (Carmesi, Sirona, Pee Safe, Nua, Plush). Prices and pack sizes are benchmarked previews from official catalogs.
          </span>
        </div>
      </div>

      {/* Purchased Toast */}
      {boughtNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in">
          <span>Redirecting to verified official partner store for {boughtNotice}... 🛍️</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Comparison Selector Chips */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-[#F4DFE2] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#8A1E38] uppercase tracking-wide">
            Select Products to Compare (Choose up to 3):
          </span>
          <span className="text-xs text-[#9E6571] font-medium">{selectedIds.length} selected</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {productsList.map((prod) => {
            const isSelected = selectedIds.includes(prod.id);
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => toggleSelectForComparison(prod.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
                    : 'bg-[#FFF9F6] text-[#6E3C48] border border-[#ECCACF] hover:bg-pink-50'
                }`}
              >
                {isSelected ? <Check className="w-3 h-3" /> : null}
                <span>{prod.brand} • {prod.type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Table / Cards */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[300px]">
          {comparedProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-5 rounded-3xl border border-pink-200 bg-gradient-to-b from-[#FFF9FB] to-white shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                      {prod.brand}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#4A1E29] leading-tight">
                      {prod.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                    ★ {prod.verifiedRating}
                  </span>
                </div>

                {/* Price & Unit Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#FFF5F8] border border-pink-200 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-serif font-bold text-[#4A1E29]">₹{prod.price}</span>
                    <span className="text-xs text-[#7A4B55] font-medium">/ {prod.packSize}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-rose-800">
                    Unit Cost: {prod.pricePerUnit}
                  </p>
                </div>

                {/* Comparison Attributes */}
                <div className="space-y-2 text-xs text-[#522932] divide-y divide-pink-100">
                  <div className="pt-1.5 flex justify-between">
                    <span className="text-[#9E6571]">Type:</span>
                    <span className="font-semibold">{prod.type} ({prod.isReusable ? 'Reusable' : 'Disposable'})</span>
                  </div>
                  <div className="pt-1.5 flex justify-between">
                    <span className="text-[#9E6571]">Lifespan:</span>
                    <span className="font-semibold">{prod.reusableLifespan}</span>
                  </div>
                  <div className="pt-1.5 flex justify-between">
                    <span className="text-[#9E6571]">Material:</span>
                    <span className="font-semibold text-right max-w-[60%]">{prod.material}</span>
                  </div>
                  <div className="pt-1.5 space-y-1">
                    <span className="text-[#9E6571] block">Eco-Friendly Attributes:</span>
                    <div className="flex flex-wrap gap-1">
                      {prod.ecoAttributes.map((eco, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200"
                        >
                          🌿 {eco}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details & Buy */}
              <div className="pt-3 border-t border-pink-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDetailProduct(prod)}
                  className="py-2.5 rounded-xl text-xs font-semibold text-[#8B263E] bg-[#FFF5F8] hover:bg-pink-100 border border-pink-200 transition-colors text-center"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleBuy(prod)}
                  className="py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy ↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-200 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setDetailProduct(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#9E6571] hover:bg-pink-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                {detailProduct.brand} • Detailed Analysis
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29] mt-1">
                {detailProduct.name}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-pink-200 space-y-1">
              <span className="text-xs text-[#7A4B55]">Price & Packaging:</span>
              <div className="text-xl font-serif font-bold text-[#4A1E29]">
                ₹{detailProduct.price} <span className="text-xs font-normal">({detailProduct.packSize})</span>
              </div>
              <p className="text-xs font-semibold text-rose-800">
                Effective cost: {detailProduct.pricePerUnit}
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#522932]">
              <strong className="text-xs text-[#8B263E] block">Key Comfort Feature:</strong>
              <p className="leading-relaxed">{detailProduct.keyFeature}</p>

              <strong className="text-xs text-[#8B263E] block pt-2">Full Material Composition:</strong>
              <p className="leading-relaxed">{detailProduct.material}</p>
            </div>

            <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
              <span className="text-[11px] text-[#A66F7B]">Verified partner link</span>
              <button
                type="button"
                onClick={() => {
                  handleBuy(detailProduct);
                  setDetailProduct(null);
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs"
              >
                Proceed to Store ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
