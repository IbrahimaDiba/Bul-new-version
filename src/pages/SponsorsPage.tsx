import React, { useEffect, useState } from 'react';
import { Mail, Handshake } from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedSponsors } from '../data/adminContent';
import { Sponsor } from '../types';
import { SponsorCardSkeleton } from '../components/ui/Skeleton';

const SponsorsPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reload = () => {
      setSponsors(getManagedSponsors());
      setIsLoading(false);
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gray-50">

      {/* ══════════════ HERO BANNER ══════════════ */}
      <div className="relative overflow-hidden bg-navy-900">
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-crimson-500" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.3em] text-crimson-500 text-xs font-bold mb-3">
            Basketball University League
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            Partners
          </h1>
          <p className="mt-5 text-gray-400 max-w-2xl text-base sm:text-lg font-medium leading-relaxed">
            The organizations that make the BUL possible. Proud partners of university basketball excellence.
          </p>
        </div>
      </div>

      {/* ══════════════ PARTNERS GRID ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SponsorCardSkeleton key={i} />
            ))}
          </div>
        ) : sponsors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Handshake className="w-16 h-16 text-gray-300 mb-6" />
            <p className="text-gray-400 text-lg font-medium uppercase tracking-widest">
              No partners yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Partners added from the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sponsors.map((sponsor) => (
              <PartnerCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════ JOIN US BANNER ══════════════ */}
      <div className="py-20 bg-navy-900 border-t-4 border-crimson-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-crimson-500 uppercase tracking-[0.25em] text-xs font-bold mb-3">
            Become a Partner
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Join the BUL Family
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
            Align your brand with the next generation of basketball leaders in Senegal. Let's build something meaningful together.
          </p>
          <a
            href="mailto:universityleague221@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 font-bold uppercase tracking-widest text-sm text-navy-900 bg-crimson-500 hover:bg-crimson-600 transition-colors duration-200"
          >
            <Mail className="w-5 h-5" />
            Contact Partnerships
          </a>
        </div>
      </div>

    </div>
  );
};

/* ─── Individual Partner Card ─────────────────────────────────────────── */
const PartnerCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col border border-gray-200 overflow-hidden cursor-pointer rounded-sm"
      style={{ backgroundColor: '#fff' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo area — white background */}
      <div
        className="flex items-center justify-center px-4 sm:px-8 py-8 sm:py-10"
        style={{ minHeight: '120px', backgroundColor: '#fff' }}
      >
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-h-20 max-w-full object-contain transition-transform duration-300"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>

      {/* Text area — turns gold/dark on hover (site colors) */}
      <div
        className="px-4 sm:px-6 py-4 sm:py-5 flex-1 transition-colors duration-300 flex flex-col"
        style={{
          backgroundColor: hovered ? '#050505' : '#f9fafb',
          borderTop: hovered ? '2px solid #d4af37' : '2px solid transparent',
        }}
      >
        <h3
          className="text-sm font-black uppercase tracking-widest mb-2 transition-colors duration-300"
          style={{ color: hovered ? '#d4af37' : '#050505' }}
        >
          {sponsor.name}
        </h3>
        
        {sponsor.description && (
          <p
            className="text-xs leading-relaxed transition-colors duration-300 mb-4 whitespace-pre-wrap"
            style={{ color: hovered ? 'rgba(255,255,255,0.75)' : '#6b7280' }}
          >
            {sponsor.description}
          </p>
        )}

        {sponsor.benefits && sponsor.benefits.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {sponsor.benefits.map((benefit, i) => (
              <span
                key={i}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm transition-colors duration-300"
                style={{ 
                  backgroundColor: hovered ? 'rgba(212, 175, 55, 0.15)' : '#f3f4f6',
                  color: hovered ? '#d4af37' : '#9ca3af',
                  border: hovered ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid #e5e7eb'
                }}
              >
                {benefit}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorsPage;