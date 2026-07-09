interface FarmIconProps {
  size?: number
}

/** Ovo — usado para representar total vendido. */
export function EggIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path
        d="M24,6 C34,6 40,24 40,32 C40,40 33,44 24,44 C15,44 8,40 8,32 C8,24 14,6 24,6 Z"
        fill="#FFFDF3"
        stroke="#4A3325"
        strokeWidth="3"
      />
      <path
        d="M17,30 C17,24 20,18 24,15"
        fill="none"
        stroke="#F3D19E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Ovo com rostinho — usado como mascote/logo (ex: tela de login). */
export function EggFaceIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path
        d="M24,6 C34,6 40,24 40,32 C40,40 33,44 24,44 C15,44 8,40 8,32 C8,24 14,6 24,6 Z"
        fill="#FFFDF3"
        stroke="#4A3325"
        strokeWidth="3"
      />
      <ellipse cx="14.5" cy="30" rx="3" ry="2" fill="#F3A76A" opacity="0.55" />
      <ellipse cx="33.5" cy="30" rx="3" ry="2" fill="#F3A76A" opacity="0.55" />
      <path d="M15,25 Q18,22 21,25" stroke="#4A3325" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M27,25 Q30,22 33,25" stroke="#4A3325" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20,32 Q24,36 28,32" stroke="#4A3325" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** Cesta de ovos — usada para representar total vendido (produção que saiu). */
export function EggBasketIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path
        d="M15,20 C15,11 33,11 33,20"
        fill="none"
        stroke="#4A3325"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="17" cy="21" rx="6" ry="7.5" fill="#FFFDF3" stroke="#4A3325" strokeWidth="2.5" />
      <ellipse cx="26" cy="17" rx="6" ry="7.5" fill="#FFFDF3" stroke="#4A3325" strokeWidth="2.5" />
      <ellipse cx="33" cy="22" rx="6" ry="7.5" fill="#FFFDF3" stroke="#4A3325" strokeWidth="2.5" />
      <path
        d="M6,24 L42,24 L37,44 L11,44 Z"
        fill="#F3D19E"
        stroke="#4A3325"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M11,32 L37,32 M13,38 L35,38" stroke="#4A3325" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Moeda — usada para representar total recebido (dinheiro já em mãos). */
export function CoinIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="#E2953B" stroke="#4A3325" strokeWidth="3" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="#4A3325" strokeWidth="1.5" opacity="0.35" />
      <path d="M24,14 L24,34" stroke="#4A3325" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M29,18.5 C29,15 19,15 19,19 C19,23 29,22 29,26 C29,30 19,30.5 19,27"
        fill="none"
        stroke="#4A3325"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Galinha — usada para representar total recebido. */
export function HenIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path
        d="M10,26 C4,20 2,10 3,4 C7,10 9,16 12,22"
        fill="#F3D19E"
        stroke="#4A3325"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="20" cy="30" rx="14" ry="11" fill="#FFFDF3" stroke="#4A3325" strokeWidth="3" />
      <circle cx="35" cy="16" r="7" fill="#FFFDF3" stroke="#4A3325" strokeWidth="3" />
      <path
        d="M29,8 Q31,3 33,8 Q35,2 37,8 Q39,4 40,9"
        fill="none"
        stroke="#E4593A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="41,15 47,13 47,19" fill="#F3A76A" stroke="#4A3325" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="37" cy="14" r="1.4" fill="#4A3325" />
      <line x1="17" y1="40" x2="16" y2="46" stroke="#F3A76A" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="40" x2="25" y2="46" stroke="#F3A76A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Galinheiro — usado para representar valores a receber (ainda não coletados). */
export function CoopIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <polygon points="4,26 24,8 44,26" fill="#F3D19E" stroke="#4A3325" strokeWidth="3" strokeLinejoin="round" />
      <rect x="8" y="26" width="32" height="18" rx="2" fill="#FFFDF3" stroke="#4A3325" strokeWidth="3" />
      <path
        d="M19,44 L19,35 C19,31 29,31 29,35 L29,44"
        fill="#4A3325"
        fillOpacity="0.15"
        stroke="#4A3325"
        strokeWidth="3"
      />
      <line x1="29" y1="40" x2="40" y2="47" stroke="#F3A76A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="17" r="2" fill="#E4593A" stroke="#4A3325" strokeWidth="1.5" />
    </svg>
  )
}

/** Pintinho — disponível para outros usos (ex: cabeçalho da rota de hoje). */
export function ChickIcon({ size = 20 }: FarmIconProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <path
        d="M78,162 Q72,175 66,173 M78,162 Q78,176 77,175 M78,162 Q85,174 88,172"
        stroke="#4A3325"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M122,162 Q115,175 112,172 M122,162 Q122,176 123,175 M122,162 Q129,174 134,173"
        stroke="#4A3325"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48,115 C35,145 65,165 100,165 C135,165 165,145 152,115 C145,100 130,95 100,95 C70,95 55,100 48,115 Z"
        fill="#FFFDF3"
        stroke="#4A3325"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M100,28 Q103,22 100,15 Q97,22 100,28 C75,35 48,70 54,115 C54,115 65,130 76,115 C82,108 88,118 100,110 C112,118 118,108 124,115 C135,130 146,115 146,115 C152,70 125,35 100,28 Z"
        fill="#F3D19E"
        stroke="#4A3325"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M53,92 C45,102 45,118 52,125 C58,131 63,122 61,112 C59,102 56,95 53,92 Z"
        fill="#EAD4B7"
        stroke="#4A3325"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M147,92 C155,102 155,118 148,125 C142,131 137,122 139,112 C141,102 144,95 147,92 Z"
        fill="#EAD4B7"
        stroke="#4A3325"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M96,25 Q93,20 96,17 Q98,21 96,25"
        stroke="#4A3325"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="85" y1="72" x2="85" y2="84" stroke="#4A3325" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="115" y1="72" x2="115" y2="84" stroke="#4A3325" strokeWidth="4.5" strokeLinecap="round" />
      <polygon points="100,90 92,78 108,78" fill="#F3A76A" stroke="#4A3325" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  )
}

interface ChickWalkProps {
  x: number
  y: number
  scale: number
}

/** Um pintinho andando (voltado pra direita), posicionado por x/y/scale. */
function ChickWalk({ x, y, scale }: ChickWalkProps) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path
        d="M-8,6 C-4,1 5,3 6,12 C0,14 -6,12 -8,6 Z"
        fill="#F3D19E"
        stroke="#4A3325"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="0" cy="10" rx="13" ry="11" fill="#FFFDF3" stroke="#4A3325" strokeWidth="3" />
      <circle cx="11" cy="-1" r="8" fill="#FFFDF3" stroke="#4A3325" strokeWidth="3" />
      <polygon points="18,-1 26,-3 26,2" fill="#F3A76A" stroke="#4A3325" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="13" cy="-3" r="1.4" fill="#4A3325" />
      <line x1="-3" y1="20" x2="-4" y2="26" stroke="#F3A76A" strokeWidth="3" strokeLinecap="round" />
      <line x1="5" y1="20" x2="6" y2="26" stroke="#F3A76A" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/** Galinha mãe (de chapéu e botas) seguida por cinco pintinhos — cena de família da fazenda. */
export function HenWithChicksIcon({ size = 44 }: FarmIconProps) {
  const chickScale = 0.9
  const groundY = 205
  const chickTy = groundY - 26 * chickScale
  const chickXs = [8, 48, 88, 128, 168]

  return (
    <svg viewBox="0 0 400 220" width={(size * 400) / 220} height={size} aria-hidden="true">
      {chickXs.map((x) => (
        <ChickWalk key={x} x={x} y={chickTy} scale={chickScale} />
      ))}

      <g transform="translate(178,10)">
        {/* cauda */}
        <path
          d="M60,112 C35,95 18,65 14,32 C28,48 34,70 44,88"
          fill="#FFFDF3"
          stroke="#4A3325"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M64,120 C42,108 22,88 12,56 C28,66 40,82 52,100"
          fill="#F3D19E"
          stroke="#4A3325"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M70,128 C50,122 30,110 18,84 C34,90 48,100 58,114"
          fill="#FFFDF3"
          stroke="#4A3325"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* corpo */}
        <ellipse cx="95" cy="128" rx="52" ry="42" fill="#FFFDF3" stroke="#4A3325" strokeWidth="5" />
        <path
          d="M72,110 C90,102 112,110 118,132 C104,128 86,130 74,140 C68,130 68,118 72,110 Z"
          fill="#F3D19E"
          stroke="#4A3325"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* botas */}
        <rect x="72" y="180" width="20" height="22" rx="7" fill="#E2953B" stroke="#4A3325" strokeWidth="3.5" />
        <line x1="71" y1="198" x2="93" y2="198" stroke="#4A3325" strokeWidth="3" strokeLinecap="round" />
        <line x1="83" y1="168" x2="82" y2="181" stroke="#4A3325" strokeWidth="4" strokeLinecap="round" />

        <rect x="104" y="180" width="20" height="22" rx="7" fill="#E2953B" stroke="#4A3325" strokeWidth="3.5" />
        <line x1="103" y1="198" x2="125" y2="198" stroke="#4A3325" strokeWidth="3" strokeLinecap="round" />
        <line x1="111" y1="168" x2="112" y2="181" stroke="#4A3325" strokeWidth="4" strokeLinecap="round" />

        {/* cabeça */}
        <circle cx="152" cy="80" r="27" fill="#FFFDF3" stroke="#4A3325" strokeWidth="5" />
        <path
          d="M168,96 C166,106 174,112 178,104 C182,112 176,120 168,116 C160,112 162,100 168,96 Z"
          fill="#E4593A"
          stroke="#4A3325"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <polygon points="177,76 198,70 198,86" fill="#F3A76A" stroke="#4A3325" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="160" cy="72" r="3.5" fill="#4A3325" />

        {/* chapéu */}
        <path
          d="M126,58 Q126,32 152,32 Q178,32 178,58 Z"
          fill="#F3D19E"
          stroke="#4A3325"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <ellipse cx="152" cy="58" rx="38" ry="9" fill="#E2953B" stroke="#4A3325" strokeWidth="4" />
        <path d="M128,50 Q152,58 176,50" fill="none" stroke="#4A3325" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  )
}
