import { ClockConfig, FrameMaterial, NumeralStyle, HandStyle } from '../types/clock';

export interface MaterialDetail {
  id: FrameMaterial;
  name: string;
  description: string;
  basePriceMultiplier: number;
  texturePattern: string;
  accentColor: string;
}

export const MATERIAL_DETAILS: Record<FrameMaterial, MaterialDetail> = {
  walnut: {
    id: 'walnut',
    name: 'Hand-Finished American Walnut',
    description: 'Deep warm grain harvested from sustainable black walnut timber, oiled with natural beeswax.',
    basePriceMultiplier: 1.0,
    texturePattern: '#3D251E',
    accentColor: '#E6C453',
  },
  rosewood: {
    id: 'rosewood',
    name: 'Heritage Rosewood',
    description: 'Rich reddish-brown luxury hardwood with intricate dark graining.',
    basePriceMultiplier: 1.25,
    texturePattern: '#2C1613',
    accentColor: '#FCE076',
  },
  brass: {
    id: 'brass',
    name: 'Brushed Solid Brass',
    description: 'Precision CNC machined heavy yellow brass with anti-tarnish protective satin lacquer.',
    basePriceMultiplier: 1.4,
    texturePattern: '#C5A059',
    accentColor: '#FFFFFF',
  },
  marble: {
    id: 'marble',
    name: 'Obsidian Black Marble',
    description: 'Natural quarried black marble disk with subtle white and gold veining.',
    basePriceMultiplier: 1.6,
    texturePattern: '#11141D',
    accentColor: '#E6C453',
  },
  'black-aluminum': {
    id: 'black-aluminum',
    name: 'Anodized Matte Black Aluminum',
    description: 'Modern aerospace grade aluminum with ultra-sleek minimalist sandblasted finish.',
    basePriceMultiplier: 0.9,
    texturePattern: '#181C28',
    accentColor: '#38BDF8',
  },
  'neon-acrylic': {
    id: 'neon-acrylic',
    name: 'Cyber Edge RGB Acrylic',
    description: 'High-clarity optical grade acrylic frame with integrated dynamic RGB LED perimeter diffusion.',
    basePriceMultiplier: 1.2,
    texturePattern: '#0F172A',
    accentColor: '#F43F5E',
  },
};

export const SIZE_PRICING: Record<number, { price: number; name: string; recommendedUse: string }> = {
  10: { price: 120, name: '10" Desk / Countertop', recommendedUse: 'Ideal for executive desks, nightstands & mantels' },
  14: { price: 180, name: '14" Standard Wall', recommendedUse: 'Perfect for home offices, bedrooms & kitchens' },
  18: { price: 260, name: '18" Executive Wall', recommendedUse: 'Great for living rooms, conference rooms & lobbies' },
  24: { price: 390, name: '24" Statement Feature', recommendedUse: 'High impact main focal clock for spacious rooms' },
  36: { price: 680, name: '36" Grand Architectural', recommendedUse: 'Handcrafted luxury centerpiece for high ceiling spaces' },
};

export const DEFAULT_CLOCK_CONFIG: ClockConfig = {
  name: 'Custom ChronoCraft Edition',
  size: 14,
  frameMaterial: 'walnut',
  dialColor: '#181C28',
  dialTexture: 'brushed-wood',
  numeralStyle: 'roman',
  numeralColor: '#E6C453',
  handStyle: 'breguet-luxury',
  handColor: '#E6C453',
  secondHandColor: '#EF4444',
  engravedText: 'TEMPUS FUGIT • EST. 2026',
  engravedFont: 'Cinzel',
  engravedPosition: 'dial-bottom',
  ledBacklight: true,
  ledColor: '#FCE076',
  chime: 'silent-sweep',
};

export const PRESET_CLOCKS: ClockConfig[] = [
  {
    id: 'preset-executive',
    name: 'The Executive Walnut',
    size: 18,
    frameMaterial: 'walnut',
    dialColor: '#11141D',
    dialTexture: 'brushed-wood',
    numeralStyle: 'roman',
    numeralColor: '#E6C453',
    handStyle: 'breguet-luxury',
    handColor: '#E6C453',
    secondHandColor: '#E6C453',
    engravedText: 'EXCELLENCE IN TIME',
    engravedFont: 'Cinzel',
    engravedPosition: 'dial-bottom',
    ledBacklight: true,
    ledColor: '#FCE076',
    chime: 'silent-sweep',
  },
  {
    id: 'preset-obsidian',
    name: 'Midnight Marble Luxe',
    size: 24,
    frameMaterial: 'marble',
    dialColor: '#0B0D12',
    dialTexture: 'marble-vein',
    numeralStyle: 'minimal-dash',
    numeralColor: '#FFFFFF',
    handStyle: 'modern-bar',
    handColor: '#FFFFFF',
    secondHandColor: '#38BDF8',
    engravedText: 'CHRONOCRAFT OBSIDIAN',
    engravedFont: 'Inter',
    engravedPosition: 'rear-brass-plate',
    ledBacklight: true,
    ledColor: '#38BDF8',
    chime: 'silent-sweep',
  },
  {
    id: 'preset-cyberpunk',
    name: 'Cyber-Edge Neon Wall',
    size: 14,
    frameMaterial: 'neon-acrylic',
    dialColor: '#090A0F',
    dialTexture: 'smooth',
    numeralStyle: 'arabic',
    numeralColor: '#F43F5E',
    handStyle: 'neon-glow',
    handColor: '#F43F5E',
    secondHandColor: '#22C55E',
    engravedText: 'CHRONO-PROTOCOL',
    engravedFont: 'JetBrains Mono',
    engravedPosition: 'dial-top',
    ledBacklight: true,
    ledColor: '#F43F5E',
    chime: 'silent-sweep',
  },
  {
    id: 'preset-brass-heritage',
    name: 'Heritage Brass & Gold',
    size: 14,
    frameMaterial: 'brass',
    dialColor: '#1E293B',
    dialTexture: 'sunburst',
    numeralStyle: 'roman',
    numeralColor: '#C5A059',
    handStyle: 'classic-spade',
    handColor: '#C5A059',
    secondHandColor: '#DC2626',
    engravedText: 'PASSE LE TEMPS',
    engravedFont: 'Script',
    engravedPosition: 'dial-bottom',
    ledBacklight: false,
    chime: 'grandfather-tick',
  }
];
