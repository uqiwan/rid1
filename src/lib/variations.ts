/**
 * TuneForge Centralized Variation System (Poin 3 & Poin 4 & Sistem Warna Variasi Global)
 * Menjamin konsistensi warna aksen, border, badge, dan kartu di seluruh aplikasi:
 * 1. Biru (Blue)
 * 2. Ungu / Indigo (Purple)
 * 3. Teal / Hijau Tosca (Teal)
 * 4. Oranye / Amber (Amber)
 * Siklikal berulang setiap 4 variasi.
 */

export interface VariationTheme {
  name: string;
  borderColor: string;
  borderHover: string;
  borderActive: string;
  textColor: string;
  textActive: string;
  badgeBg: string;
  badgeBorder: string;
  cardBg: string;
  hoverBg: string;
  activeBg: string;
  activeBorder: string;
  ringColor: string;
}

export const VARIATION_PALETTE: VariationTheme[] = [
  {
    name: 'blue',
    borderColor: 'rgba(0, 122, 255, 0.40)',
    borderHover: 'rgba(0, 122, 255, 0.85)',
    borderActive: '#007AFF',
    textColor: '#007AFF',
    textActive: '#0056B3',
    badgeBg: 'rgba(0, 122, 255, 0.10)',
    badgeBorder: 'rgba(0, 122, 255, 0.35)',
    cardBg: 'rgba(0, 122, 255, 0.05)',
    hoverBg: 'rgba(0, 122, 255, 0.12)',
    activeBg: 'rgba(0, 122, 255, 0.22)',
    activeBorder: '#007AFF',
    ringColor: 'rgba(0, 122, 255, 0.35)',
  },
  {
    name: 'purple',
    borderColor: 'rgba(124, 58, 237, 0.40)',
    borderHover: 'rgba(124, 58, 237, 0.85)',
    borderActive: '#7C3AED',
    textColor: '#7C3AED',
    textActive: '#5B21B6',
    badgeBg: 'rgba(124, 58, 237, 0.10)',
    badgeBorder: 'rgba(124, 58, 237, 0.35)',
    cardBg: 'rgba(124, 58, 237, 0.05)',
    hoverBg: 'rgba(124, 58, 237, 0.12)',
    activeBg: 'rgba(124, 58, 237, 0.22)',
    activeBorder: '#7C3AED',
    ringColor: 'rgba(124, 58, 237, 0.35)',
  },
  {
    name: 'teal',
    borderColor: 'rgba(13, 148, 136, 0.40)',
    borderHover: 'rgba(13, 148, 136, 0.85)',
    borderActive: '#0D9488',
    textColor: '#0D9488',
    textActive: '#115E59',
    badgeBg: 'rgba(13, 148, 136, 0.10)',
    badgeBorder: 'rgba(13, 148, 136, 0.35)',
    cardBg: 'rgba(13, 148, 136, 0.05)',
    hoverBg: 'rgba(13, 148, 136, 0.12)',
    activeBg: 'rgba(13, 148, 136, 0.22)',
    activeBorder: '#0D9488',
    ringColor: 'rgba(13, 148, 136, 0.35)',
  },
  {
    name: 'amber',
    borderColor: 'rgba(217, 119, 6, 0.40)',
    borderHover: 'rgba(217, 119, 6, 0.85)',
    borderActive: '#D97706',
    textColor: '#D97706',
    textActive: '#92400E',
    badgeBg: 'rgba(217, 119, 6, 0.10)',
    badgeBorder: 'rgba(217, 119, 6, 0.35)',
    cardBg: 'rgba(217, 119, 6, 0.05)',
    hoverBg: 'rgba(217, 119, 6, 0.12)',
    activeBg: 'rgba(217, 119, 6, 0.22)',
    activeBorder: '#D97706',
    ringColor: 'rgba(217, 119, 6, 0.35)',
  },
];

export function getVariationIndex(index: number): number {
  return Math.abs(index) % VARIATION_PALETTE.length;
}

export function getVariationTheme(index: number): VariationTheme {
  const safeIdx = getVariationIndex(index);
  return VARIATION_PALETTE[safeIdx];
}

export function getVariationClass(index: number, isSelected: boolean = false): string {
  const vIdx = getVariationIndex(index);
  return `btn-variation var-${vIdx} ${isSelected ? 'is-selected' : ''}`;
}

export function getVariationBoxClass(index: number, isSelected: boolean = false): string {
  const vIdx = getVariationIndex(index);
  return `var-box var-${vIdx} ${isSelected ? 'is-selected' : ''}`;
}

export const VARIATION_COLORS = VARIATION_PALETTE;

