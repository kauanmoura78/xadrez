import React from 'react';

interface PieceProps {
  className?: string;
}

// Authentic Chess.com Neo Piece Set matching the user's uploaded screenshot
// White: Crisp white with subtle contour gradient and dark outline
// Black: Deep warm charcoal slate with dark outline and subtle inner form highlights

export const WhitePawn: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whitePieceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whitePieceGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Head ball */}
      <circle cx="22.5" cy="12" r="5.5" />
      {/* Collar */}
      <path d="M 17,19.5 C 19,18.5 26,18.5 28,19.5 C 27,20.8 18,20.8 17,19.5 Z" />
      {/* Body and base */}
      <path d="M 18,20.5 C 16.5,26 14.5,29 11.5,37.5 L 33.5,37.5 C 30.5,29 28.5,26 27,20.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
    {/* Inner highlight sheen */}
    <circle cx="21" cy="10.5" r="2.2" fill="#ffffff" opacity="0.6" stroke="none" />
  </svg>
);

export const BlackPawn: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackPieceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackPieceGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Head ball */}
      <circle cx="22.5" cy="12" r="5.5" />
      {/* Collar */}
      <path d="M 17,19.5 C 19,18.5 26,18.5 28,19.5 C 27,20.8 18,20.8 17,19.5 Z" />
      {/* Body and base */}
      <path d="M 18,20.5 C 16.5,26 14.5,29 11.5,37.5 L 33.5,37.5 C 30.5,29 28.5,26 27,20.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
    {/* Subtle highlight sheen */}
    <path d="M 19,11 C 21,9.8 24,10 25.5,11.5" fill="none" stroke="#716f6b" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const WhiteKnight: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whiteKnightGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whiteKnightGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Horse Head Profile */}
      <path d="M 22,8 C 28,8 33,12 34,18 C 34.5,22 34,31 34.5,37.5 L 10.5,37.5 C 10.5,33 11,28 12.5,25 C 14.5,21 16,19 14,17 C 12,15 9.5,18 9,21 C 7.5,20.5 7.5,18 8,16 C 9,13 11,11 13.5,11 C 14,9 15.5,7 18,7.5 C 19.5,8 20.5,7.5 22,8 Z" />
      {/* Base Rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      {/* Mane curves */}
      <path d="M 25,12 C 27,15 26,18 27.5,21" fill="none" stroke="#22201d" strokeWidth="1.4" />
      {/* Eye */}
      <circle cx="15" cy="14.5" r="1.3" fill="#22201d" stroke="none" />
      {/* Nostril and Muzzle */}
      <path d="M 10.5,18 C 11.5,19 13.5,19 14.5,17" fill="none" stroke="#22201d" strokeWidth="1.4" />
      {/* Neck contour line */}
      <path d="M 22,23 C 24,26 21,32 19,37.5" fill="none" stroke="#22201d" strokeWidth="1.4" />
    </g>
  </svg>
);

export const BlackKnight: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackKnightGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackKnightGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 22,8 C 28,8 33,12 34,18 C 34.5,22 34,31 34.5,37.5 L 10.5,37.5 C 10.5,33 11,28 12.5,25 C 14.5,21 16,19 14,17 C 12,15 9.5,18 9,21 C 7.5,20.5 7.5,18 8,16 C 9,13 11,11 13.5,11 C 14,9 15.5,7 18,7.5 C 19.5,8 20.5,7.5 22,8 Z" />
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      <path d="M 25,12 C 27,15 26,18 27.5,21" fill="none" stroke="#716f6b" strokeWidth="1.3" />
      <circle cx="15" cy="14.5" r="1.3" fill="#ffffff" stroke="none" />
      <path d="M 10.5,18 C 11.5,19 13.5,19 14.5,17" fill="none" stroke="#716f6b" strokeWidth="1.3" />
      <path d="M 22,23 C 24,26 21,32 19,37.5" fill="none" stroke="#716f6b" strokeWidth="1.3" />
    </g>
  </svg>
);

export const WhiteBishop: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whiteBishopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whiteBishopGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Top finial ball */}
      <circle cx="22.5" cy="8" r="2.3" />
      {/* Mitre head */}
      <path d="M 15,31 C 14,24 16.5,16 22.5,11 C 28.5,16 31,24 30,31 C 27.5,32 17.5,32 15,31 Z" />
      {/* Cross Slit cut */}
      <path d="M 18,17 L 27,26" fill="none" stroke="#22201d" strokeWidth="1.6" />
      {/* Middle ring collar */}
      <path d="M 16,31 L 29,31 L 28,34 L 17,34 Z" />
      {/* Lower base pedestal */}
      <path d="M 16,34 C 14.5,35.5 12,36 10.5,37.5 L 34.5,37.5 C 33,36 30.5,35.5 29,34 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
  </svg>
);

export const BlackBishop: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackBishopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackBishopGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Top finial ball */}
      <circle cx="22.5" cy="8" r="2.3" />
      {/* Mitre head */}
      <path d="M 15,31 C 14,24 16.5,16 22.5,11 C 28.5,16 31,24 30,31 C 27.5,32 17.5,32 15,31 Z" />
      {/* Cross Slit cut */}
      <path d="M 18,17 L 27,26" fill="none" stroke="#1a1816" strokeWidth="1.8" />
      {/* Middle ring collar */}
      <path d="M 16,31 L 29,31 L 28,34 L 17,34 Z" />
      {/* Lower base pedestal */}
      <path d="M 16,34 C 14.5,35.5 12,36 10.5,37.5 L 34.5,37.5 C 33,36 30.5,35.5 29,34 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
    <path d="M 19,13 C 21,11.5 24,11.5 26,13" fill="none" stroke="#716f6b" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const WhiteRook: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whiteRookGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whiteRookGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Battlements & Tower Head */}
      <path d="M 12,17 L 12,9 L 16,9 L 16,13 L 20,13 L 20,9 L 25,9 L 25,13 L 29,13 L 29,9 L 33,9 L 33,17 Z" />
      {/* Cornice band */}
      <path d="M 13.5,17 L 31.5,17 L 30.5,20 L 14.5,20 Z" />
      {/* Tapered tower body */}
      <path d="M 15,20 L 30,20 L 31,34 L 14,34 Z" />
      {/* Lower base trim */}
      <path d="M 12.5,34 L 32.5,34 L 33.5,37.5 L 11.5,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
  </svg>
);

export const BlackRook: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackRookGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackRookGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Battlements & Tower Head */}
      <path d="M 12,17 L 12,9 L 16,9 L 16,13 L 20,13 L 20,9 L 25,9 L 25,13 L 29,13 L 29,9 L 33,9 L 33,17 Z" />
      {/* Cornice band */}
      <path d="M 13.5,17 L 31.5,17 L 30.5,20 L 14.5,20 Z" />
      {/* Tapered tower body */}
      <path d="M 15,20 L 30,20 L 31,34 L 14,34 Z" />
      {/* Lower base trim */}
      <path d="M 12.5,34 L 32.5,34 L 33.5,37.5 L 11.5,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
    </g>
    <path d="M 15,23 L 30,23" fill="none" stroke="#716f6b" strokeWidth="1" />
  </svg>
);

export const WhiteQueen: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whiteQueenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whiteQueenGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Coronet with 5 Points & Pearls */}
      <path d="M 9,25 L 8,14 L 14,21 L 22.5,11 L 31,21 L 37,14 L 36,25 Z" />
      {/* 5 Crown Pearls */}
      <circle cx="8" cy="13.5" r="1.8" />
      <circle cx="14" cy="20.5" r="1.8" />
      <circle cx="22.5" cy="10.5" r="2.2" />
      <circle cx="31" cy="20.5" r="1.8" />
      <circle cx="37" cy="13.5" r="1.8" />
      {/* Bodice waist */}
      <path d="M 10.5,25 C 13,29 15,31 16.5,34 L 28.5,34 C 30,31 32,29 34.5,25 Z" />
      {/* Waist bands */}
      <path d="M 15,34 L 30,34 L 31,37.5 L 14,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      {/* Decorative chest arc */}
      <path d="M 14,29 C 18,31 27,31 31,29" fill="none" stroke="#22201d" strokeWidth="1.4" />
    </g>
  </svg>
);

export const BlackQueen: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackQueenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackQueenGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Coronet with 5 Points & Pearls */}
      <path d="M 9,25 L 8,14 L 14,21 L 22.5,11 L 31,21 L 37,14 L 36,25 Z" />
      {/* 5 Crown Pearls */}
      <circle cx="8" cy="13.5" r="1.8" />
      <circle cx="14" cy="20.5" r="1.8" />
      <circle cx="22.5" cy="10.5" r="2.2" />
      <circle cx="31" cy="20.5" r="1.8" />
      <circle cx="37" cy="13.5" r="1.8" />
      {/* Bodice waist */}
      <path d="M 10.5,25 C 13,29 15,31 16.5,34 L 28.5,34 C 30,31 32,29 34.5,25 Z" />
      {/* Waist bands */}
      <path d="M 15,34 L 30,34 L 31,37.5 L 14,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      {/* Decorative chest arc */}
      <path d="M 14,29 C 18,31 27,31 31,29" fill="none" stroke="#716f6b" strokeWidth="1.4" />
    </g>
  </svg>
);

export const WhiteKing: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.35))' }}>
    <defs>
      <linearGradient id="whiteKingGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#fbfbfa" />
        <stop offset="100%" stopColor="#e8ecef" />
      </linearGradient>
    </defs>
    <g fill="url(#whiteKingGrad)" stroke="#22201d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Royal Cross */}
      <path d="M 22.5,5.5 L 22.5,10.5" stroke="#22201d" strokeWidth="2.2" />
      <path d="M 20,8 L 25,8" stroke="#22201d" strokeWidth="2.2" />
      {/* Crown dome & body */}
      <path d="M 17,14 C 18,11.5 27,11.5 28,14 C 32,17 33,24 33,29 C 31,32 29,33.5 28.5,34 L 16.5,34 C 16,33.5 14,32 12,29 C 12,24 13,17 17,14 Z" />
      {/* Inner crown center jewel circle */}
      <circle cx="22.5" cy="19.5" r="3.2" fill="#ffffff" />
      {/* Middle collar band */}
      <path d="M 15,34 L 30,34 L 31,37.5 L 14,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      {/* Horizontal royal chest lines */}
      <path d="M 14,29 C 18,30.5 27,30.5 31,29" fill="none" stroke="#22201d" strokeWidth="1.4" />
      <path d="M 16,25 C 19,26.5 26,26.5 29,25" fill="none" stroke="#22201d" strokeWidth="1.4" />
    </g>
  </svg>
);

export const BlackKing: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="blackKingGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#575552" />
        <stop offset="50%" stopColor="#464441" />
        <stop offset="100%" stopColor="#353331" />
      </linearGradient>
    </defs>
    <g fill="url(#blackKingGrad)" stroke="#1a1816" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Royal Cross */}
      <path d="M 22.5,5.5 L 22.5,10.5" stroke="#ffffff" strokeWidth="2.2" />
      <path d="M 20,8 L 25,8" stroke="#ffffff" strokeWidth="2.2" />
      {/* Crown dome & body */}
      <path d="M 17,14 C 18,11.5 27,11.5 28,14 C 32,17 33,24 33,29 C 31,32 29,33.5 28.5,34 L 16.5,34 C 16,33.5 14,32 12,29 C 12,24 13,17 17,14 Z" />
      {/* Inner crown center jewel circle */}
      <circle cx="22.5" cy="19.5" r="3.2" fill="#464441" stroke="#ffffff" strokeWidth="1.4" />
      {/* Middle collar band */}
      <path d="M 15,34 L 30,34 L 31,37.5 L 14,37.5 Z" />
      {/* Base rim */}
      <path d="M 9.5,37.5 L 35.5,37.5 L 35.5,40.5 L 9.5,40.5 Z" />
      {/* Horizontal royal chest lines */}
      <path d="M 14,29 C 18,30.5 27,30.5 31,29" fill="none" stroke="#716f6b" strokeWidth="1.4" />
      <path d="M 16,25 C 19,26.5 26,26.5 29,25" fill="none" stroke="#716f6b" strokeWidth="1.4" />
    </g>
  </svg>
);

export const renderPiece = (type: string, color: 'w' | 'b', className: string = 'w-full h-full') => {
  const isWhite = color === 'w';
  switch (type.toLowerCase()) {
    case 'p':
      return isWhite ? <WhitePawn className={className} /> : <BlackPawn className={className} />;
    case 'n':
      return isWhite ? <WhiteKnight className={className} /> : <BlackKnight className={className} />;
    case 'b':
      return isWhite ? <WhiteBishop className={className} /> : <BlackBishop className={className} />;
    case 'r':
      return isWhite ? <WhiteRook className={className} /> : <BlackRook className={className} />;
    case 'q':
      return isWhite ? <WhiteQueen className={className} /> : <BlackQueen className={className} />;
    case 'k':
      return isWhite ? <WhiteKing className={className} /> : <BlackKing className={className} />;
    default:
      return null;
  }
};
