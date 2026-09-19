export type FrameMaterial = 
  | 'walnut' 
  | 'rosewood' 
  | 'brass' 
  | 'marble' 
  | 'black-aluminum' 
  | 'neon-acrylic';

export type SizeInches = 10 | 14 | 18 | 24 | 36;

export type NumeralStyle = 
  | 'roman' 
  | 'arabic' 
  | 'minimal-dash' 
  | 'sunburst-dots' 
  | 'none';

export type HandStyle = 
  | 'classic-spade' 
  | 'modern-bar' 
  | 'breguet-luxury' 
  | 'neon-glow';

export type ChimeType = 
  | 'silent-sweep' 
  | 'grandfather-tick' 
  | 'westminster-chime' 
  | 'soft-pendulum';

export type WallBackdrop = 
  | 'wood-panel' 
  | 'gallery-white' 
  | 'industrial-brick' 
  | 'dark-slate' 
  | 'pastel-living';

export type LaserInlayStyle = 
  | 'natural-burn' 
  | 'gold-foil' 
  | 'silver-inlay' 
  | 'black-enamel';

export interface WorldSubdial {
  id: string;
  label: string; // e.g. "LONDON", "TOKYO", "NEW YORK"
  timezoneOffsetHours: number; // e.g. -5, 0, +9
  position: 'left' | 'right' | 'bottom';
}

export interface ClockConfig {
  id?: string;
  name: string;
  size: SizeInches;
  frameMaterial: FrameMaterial;
  dialColor: string; // Hex color or gradient token
  dialTexture: 'smooth' | 'brushed-wood' | 'marble-vein' | 'sunburst' | 'custom-photo';
  customPhotoUrl?: string;
  numeralStyle: NumeralStyle;
  numeralColor: string;
  handStyle: HandStyle;
  handColor: string;
  secondHandColor: string;
  engravedText?: string;
  engravedFont?: 'Cinzel' | 'Inter' | 'JetBrains Mono' | 'Script';
  engravedPosition?: 'dial-top' | 'dial-bottom' | 'rear-brass-plate';
  engravedInlayStyle?: LaserInlayStyle;
  ledBacklight: boolean;
  ledColor?: string;
  chime: ChimeType;
  lightAngleDegrees?: number; // 0 to 360 degree studio light angle
  subdials?: WorldSubdial[]; // Multi-timezone sub-dials
  createdAt?: string;
}

export type OrderStage = 
  | 'order-placed' 
  | 'material-sourcing' 
  | 'laser-cutting' 
  | 'dial-printing' 
  | 'assembly-calibration' 
  | 'quality-testing' 
  | 'shipped';

export interface OrderUpdate {
  timestamp: string;
  message: string;
  stage: OrderStage;
  author: 'System' | 'Master Craftsman' | 'Quality Auditor' | 'Shipping Team';
}

export interface ClockOrder {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  clockConfig: ClockConfig;
  totalAmount: number;
  currentStage: OrderStage;
  estimatedDeliveryDays: number;
  history: OrderUpdate[];
  createdAt: string;
}

export interface BespokeQuoteRequest {
  id?: string;
  clientName: string;
  companyOrProject?: string;
  email: string;
  phone: string;
  quantity: number;
  targetSize: string;
  specialRequirements: string;
  status: 'pending' | 'reviewed' | 'quoted';
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'artisan';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface CollaborativeSession {
  roomId: string;
  activeConfig: ClockConfig;
  updatedBy: string;
  updatedAt: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  clockModel: string;
  comment: string;
  verifiedPurchase: boolean;
  imageUrl?: string;
}

export interface AuthenticCertificate {
  serialNumber: string;
  clockName: string;
  frameMaterial: string;
  craftedDate: string;
  masterCraftsman: string;
  movementSpec: string;
  status: 'AUTHENTIC' | 'REVOKED' | 'NOT_FOUND';
}
