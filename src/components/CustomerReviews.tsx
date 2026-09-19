import React from 'react';
import { ReviewItem } from '../types/clock';
import { Star, ShieldCheck, Heart, ThumbsUp } from 'lucide-react';

const SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Victoria Vance',
    location: 'Boston, MA',
    rating: 5,
    date: 'September 12, 2026',
    clockModel: '18" Executive Walnut Clock',
    comment: 'The walnut grain is astonishingly beautiful in person. We uploaded our wedding photo to the dial face and had our anniversary laser-engraved. It ticks in dead silence and is the main conversation piece of our living room!',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    author: 'Harrison Ford-Blake',
    location: 'Chicago, IL',
    rating: 5,
    date: 'August 28, 2026',
    clockModel: '24" Midnight Obsidian Marble',
    comment: 'Ordered for our law firm conference room with custom brass sub-dials showing London and Tokyo time. Real-time order tracker kept us informed at every laser-cutting stage. Outstanding craftsmanship!',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    author: 'Elena & Lucas Rostova',
    location: 'Seattle, WA',
    rating: 5,
    date: 'August 14, 2026',
    clockModel: '14" Heritage Solid Brass & Gold',
    comment: 'The LED backlighting gives a subtle warm halo at night. Customer chat with Master Jean-Luc helped us choose the exact Breguet hand style. Delivered in a custom wooden crate!',
    verifiedPurchase: true,
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
            Verified Client Reviews & Craftsmanship Gallery
          </h2>
          <p className="text-xs text-slate-400">
            Real feedback from homeowners, interior designers, and corporate clients around the globe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-colors"
          >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  {rev.author}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400">{rev.location} • {rev.clockModel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
