import ebFlagWatermarkFullImg from '../assets/images/eb_flag_watermark_full_1787765340648.jpg';

export const QGEX_WATERMARK_IMG = ebFlagWatermarkFullImg;

/**
 * Vector Assets, Emblems, Badges & Ornaments for Certificate Generation
 */

export const SGEX_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" width="160" height="220">
  <defs>
    <linearGradient id="sgexGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0A0"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#996515"/>
    </linearGradient>
    <linearGradient id="shieldRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D61818"/>
      <stop offset="100%" stop-color="#9C0A0A"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer gold border & shield shape -->
  <path d="M 12 10 L 148 10 C 148 10 150 120 148 140 C 144 175 80 214 80 214 C 80 214 16 175 12 140 C 10 120 12 10 12 10 Z" 
        fill="#FFD700" stroke="#B8860B" stroke-width="2" filter="url(#dropShadow)"/>

  <!-- Inner red shield -->
  <path d="M 18 16 L 142 16 C 142 16 144 116 142 134 C 138 166 80 204 80 204 C 80 204 22 166 18 134 C 16 116 18 16 18 16 Z" 
        fill="url(#shieldRed)" stroke="#7A0000" stroke-width="1.5"/>

  <!-- Top Blue Banner with SGEX -->
  <rect x="22" y="22" width="116" height="34" rx="2" fill="#0E4C92" stroke="#FFD700" stroke-width="2"/>
  <text x="80" y="47" font-family="'Arial Black', Impact, sans-serif" font-size="21" font-weight="900" 
        letter-spacing="4" fill="#FFD700" text-anchor="middle" stroke="#5A3A00" stroke-width="0.7">S G EX</text>

  <!-- Central White Diamond (Losango) -->
  <polygon points="80,68 136,128 80,188 24,128" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2"/>

  <!-- Crossed Golden Swords and Torch Symbol -->
  <!-- Sword 1 -->
  <line x1="48" y1="160" x2="112" y2="96" stroke="#C59B27" stroke-width="4" stroke-linecap="round"/>
  <line x1="44" y1="164" x2="52" y2="156" stroke="#600" stroke-width="5"/>
  <circle cx="42" cy="166" r="3.5" fill="#D4AF37"/>
  <!-- Sword 2 -->
  <line x1="112" y1="160" x2="48" y2="96" stroke="#C59B27" stroke-width="4" stroke-linecap="round"/>
  <line x1="116" y1="164" x2="108" y2="156" stroke="#600" stroke-width="5"/>
  <circle cx="118" cy="166" r="3.5" fill="#D4AF37"/>

  <!-- Central Torch / Sword Vertical -->
  <rect x="77" y="90" width="6" height="74" fill="url(#sgexGold)" rx="1.5" stroke="#7A4500" stroke-width="0.8"/>
  <!-- Torch flame / Top crest -->
  <path d="M 80 76 Q 88 88 80 94 Q 72 88 80 76 Z" fill="#E65100"/>
  <path d="M 80 80 Q 84 87 80 92 Q 76 87 80 80 Z" fill="#FFEB3B"/>

  <!-- Crossguard -->
  <rect x="68" y="148" width="24" height="4" fill="#C59B27" rx="1"/>
  <!-- Laurel / Wheat branches styling around diamond -->
  <path d="M 62 118 Q 54 128 62 138" stroke="#D4AF37" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 98 118 Q 106 128 98 138" stroke="#D4AF37" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

export const BADM_QGEX_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" width="160" height="220">
  <defs>
    <linearGradient id="badmGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0A0"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#996515"/>
    </linearGradient>
    <linearGradient id="badmRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D61818"/>
      <stop offset="100%" stop-color="#A00000"/>
    </linearGradient>
    <filter id="badmShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer gold shield contour -->
  <path d="M 12 10 L 148 10 C 148 10 150 120 148 140 C 144 175 80 214 80 214 C 80 214 16 175 12 140 C 10 120 12 10 12 10 Z" 
        fill="#FFD700" stroke="#B8860B" stroke-width="2" filter="url(#badmShadow)"/>

  <!-- Top Yellow/Gold Header Banner -->
  <rect x="18" y="16" width="124" height="42" fill="#F4B41A" stroke="#B8860B" stroke-width="1.5"/>
  <text x="80" y="44" font-family="'Arial Black', Impact, sans-serif" font-size="14.5" font-weight="900" 
        letter-spacing="0.5" fill="#1446A0" text-anchor="middle" stroke="#FFF" stroke-width="0.3">B-ADM-QGEX</text>

  <!-- Inner Red Shield Body -->
  <path d="M 18 58 L 142 58 C 142 58 144 124 142 140 C 138 170 80 204 80 204 C 80 204 22 170 18 140 C 16 124 18 58 18 58 Z" 
        fill="url(#badmRed)" stroke="#7A0000" stroke-width="1.5"/>

  <!-- White Central Shield Area -->
  <path d="M 28 66 L 132 66 C 132 66 134 118 132 132 C 128 158 80 190 80 190 C 80 190 32 158 28 132 C 26 118 28 66 28 66 Z" 
        fill="#FFFFFF" stroke="#C59B27" stroke-width="1.5"/>

  <!-- Forte Caxias Monument Drawing (Concha Acústica / Niemeyer Arc and Obelisk) -->
  <g transform="translate(80, 106)">
    <!-- Obelisk column in background -->
    <rect x="-42" y="-36" width="4.5" height="34" fill="#C52828"/>
    <!-- Arc shape -->
    <path d="M -44 -6 Q -2  -32 40 -4 Q 0 -18 -44 -6 Z" fill="#D62828" stroke="#9C0A0A" stroke-width="0.8"/>
    <!-- Platform base line -->
    <line x1="-50" y1="-4" x2="44" y2="-4" stroke="#C52828" stroke-width="2"/>
    
    <!-- Sword pointing down with wings / branches -->
    <!-- Blade -->
    <polygon points="0,0 2.5,4 1.5,42 0,48 -1.5,42 -2.5,4" fill="#C52828"/>
    <line x1="0" y1="0" x2="0" y2="46" stroke="#FFD700" stroke-width="1"/>
    <!-- Crossguard -->
    <rect x="-10" y="2" width="20" height="3" fill="#C52828" rx="1"/>
    <circle cx="0" cy="-3" r="2.5" fill="#C52828"/>
    <!-- Leaves / Wings -->
    <path d="M -2 16 Q -14 24 -18 34 Q -10 32 -2 24" fill="#D62828"/>
    <path d="M 2 16 Q 14 24 18 34 Q 10 32 2 24" fill="#D62828"/>
    <path d="M -2 22 Q -12 28 -14 38 Q -8 36 -2 28" fill="#D62828"/>
    <path d="M 2 22 Q 12 28 14 38 Q 8 36 2 28" fill="#D62828"/>
  </g>
</svg>
`)}`;

export const DIGITAL_SIGNATURE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 90" width="260" height="90">
  <defs>
    <filter id="inkGlow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.4" flood-color="#001850" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Authentic cursive blue fountain pen signature of Carlos Henrique Ferreira De Mello -->
  <path d="M 25 55 
           C 28 35, 42 12, 58 18 
           C 70 24, 62 65, 48 72 
           C 36 78, 30 52, 45 42 
           C 62 30, 78 45, 92 46 
           C 100 47, 104 38, 108 30 
           C 112 24, 116 48, 120 46 
           C 126 44, 128 32, 134 32 
           C 138 32, 140 44, 145 45 
           C 152 46, 158 35, 164 35 
           C 170 35, 172 44, 178 44 
           C 186 44, 194 30, 202 36 
           C 210 42, 198 62, 170 66 
           C 140 70, 70 82, 35 68 
           C 20 62, 50 56, 120 54 
           C 175 52, 225 50, 248 55" 
        fill="none" 
        stroke="#162B75" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#inkGlow)"/>

  <!-- Signature flourish loops -->
  <path d="M 68 28 C 95 10, 140 8, 160 22 C 175 32, 155 48, 130 46" 
        fill="none" stroke="#162B75" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <path d="M 180 38 C 205 32, 220 38, 235 48 C 242 53, 230 65, 205 60" 
        fill="none" stroke="#162B75" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
</svg>
`)}`;

export const ORNAMENT_HEADER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" width="400" height="40">
  <path d="M 20 20 L 160 20 M 240 20 L 380 20" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="3" fill="#1E293B"/>
  <circle cx="380" cy="20" r="3" fill="#1E293B"/>
  <!-- Center scroll filigree -->
  <path d="M 165 20 C 175 10, 185 30, 200 20 C 215 10, 225 30, 235 20" fill="none" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
  <circle cx="200" cy="20" r="4.5" fill="#1E293B"/>
  <circle cx="182" cy="18" r="2.5" fill="#1E293B"/>
  <circle cx="218" cy="18" r="2.5" fill="#1E293B"/>
  <path d="M 190 12 C 196 6, 204 6, 210 12" fill="none" stroke="#1E293B" stroke-width="1.5"/>
</svg>
`)}`;

export const VINTAGE_CORNER_BORDER = `
  <svg class="absolute w-24 h-24 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
    <path d="M0,0 L40,0 C30,10 20,20 15,35 C10,50 10,65 0,100 L0,0 Z" opacity="0.85"/>
    <path d="M6,6 L32,6 C24,14 16,22 12,34 C8,46 8,58 6,70 L6,6 Z" fill="#FFF"/>
    <circle cx="20" cy="20" r="3"/>
  </svg>
`;

export const FORTE_CAXIAS_WATERMARK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#F8FAFC" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  
  <rect width="800" height="500" fill="url(#skyGrad)"/>

  <!-- Clouds softly in background -->
  <path d="M 60 90 Q 120 40 180 90 Q 240 50 300 90 L 300 130 L 60 130 Z" fill="#FFFFFF" opacity="0.5"/>
  <path d="M 450 80 Q 520 30 580 80 Q 640 40 700 80 L 700 120 L 450 120 Z" fill="#FFFFFF" opacity="0.45"/>

  <!-- Niemeyer Monument Arc (Forte Caxias / Praça dos Duques) -->
  <g transform="translate(420, 360)" opacity="0.28">
    <!-- Base pool / espelho d'água -->
    <polygon points="-360,60 300,60 270,100 -390,100" fill="#334155"/>
    <!-- Shell Arc Structure -->
    <path d="M -320 50 Q 0 -130 240 45 Q -20 -80 -320 50 Z" fill="#0F172A"/>
    <path d="M -300 48 Q -10 -90 220 44" stroke="#FFF" stroke-width="4" fill="none"/>
    <!-- Stage area under shell -->
    <rect x="-140" y="20" width="120" height="30" fill="#1E293B"/>
    <!-- Background Monument Obelisk Column -->
    <polygon points="50,-240 60,-240 66,50 44,50" fill="#64748B"/>
  </g>

  <!-- Giant Flagpole & Bandeira do Brasil in the center -->
  <g transform="translate(380, 70)" opacity="0.4">
    <!-- Pole -->
    <line x1="0" y1="0" x2="0" y2="400" stroke="#CBD5E1" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="#E2E8F0"/>
    
    <!-- Flag waving -->
    <g transform="translate(0, 8)">
      <path d="M 0 0 C 40 -12, 80 12, 120 0 L 120 70 C 80 82, 40 58, 0 70 Z" fill="#16A34A"/>
      <!-- Yellow diamond in wave -->
      <polygon points="15,35 60,10 105,35 60,60" fill="#EAB308"/>
      <!-- Blue globe -->
      <circle cx="60" cy="35" r="14" fill="#1E3A8A"/>
      <!-- White stripe band -->
      <path d="M 48 38 Q 60 32 72 35" stroke="#FFFFFF" stroke-width="2.5" fill="none"/>
    </g>
  </g>

  <!-- Green lawn horizon -->
  <path d="M 0 380 Q 400 350 800 380 L 800 500 L 0 500 Z" fill="#84CC16" opacity="0.12"/>
</svg>
`)}`;
