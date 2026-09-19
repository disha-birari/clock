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

export type PhotoMaskShape = 
  | 'circle' 
  | 'heart' 
  | 'quadrant' 
  | 'diamond' 
  | 'hexagon' 
  | '12-hour-circles' 
  | 'square-grid';

export type ClockBodyShape = 
  | 'round-wall' 
  | 'square-minimal' 
  | 'arch-tabletop' 
  | 'hexagon-geometric';

export type ClockPinStyle = 
  | 'gold-bullet-pin' 
  | 'silver-capped-pin' 
  | 'black-obsidian-pin' 
  | 'ruby-gem-pin';

export interface PhotoSlot {
  id: number;
  label: string; // e.g. "Hour 12", "Top Left Quadrant"
  imageUrl?: string;
  zoom: number;
  xOffset: number;
  yOffset: number;
}

export interface PhotoClockConfig {
  photoCount: 1 | 2 | 3 | 4 | 6 | 12;
  maskShape: PhotoMaskShape;
  slots: PhotoSlot[];
  bodyShape: ClockBodyShape;
  pinStyle: ClockPinStyle;
  pinColor: string;
  frameMaterial: FrameMaterial;
  dialColor: string;
  size: SizeInches;
  handStyle: HandStyle;
  handColor: string;
  secondHandColor: string;
  engravedText?: string;
  engravedFont?: string;
}

export interface WorldSubdial {
  id: string;
  label: string;
  timezoneOffsetHours: number;
  position: 'left' | 'right' | 'bottom';
}

export interface ClockConfig {
  id?: string;
  name: string;
  size: SizeInches;
  frameMaterial: FrameMaterial;
  dialColor: string;
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
  lightAngleDegrees?: number;
  subdials?: WorldSubdial[];
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
