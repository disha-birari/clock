import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  Firestore 
} from 'firebase/firestore';
import { 
  ClockConfig, 
  ClockOrder, 
  OrderStage, 
  BespokeQuoteRequest, 
  ChatMessage, 
  CollaborativeSession, 
  AuthenticCertificate,
  ReviewItem 
} from '../types/clock';

export interface FirebaseCredentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const LOCAL_STORAGE_KEY = 'chronocraft_firebase_config';
const LOCAL_ORDERS_KEY = 'chronocraft_local_orders';
const LOCAL_DESIGNS_KEY = 'chronocraft_local_designs';
const LOCAL_CHAT_KEY = 'chronocraft_local_chat';
const LOCAL_ROOMS_KEY = 'chronocraft_local_rooms';

export function getStoredFirebaseConfig(): FirebaseCredentials | null {
  const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (envKey) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FirebaseCredentials;
  } catch (e) {
    console.warn('Failed to parse local Firebase config', e);
  }
  return null;
}

export function saveFirebaseConfig(config: FirebaseCredentials) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  window.location.reload();
}

export function clearFirebaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.reload();
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const activeConfig = getStoredFirebaseConfig();
if (activeConfig && activeConfig.apiKey && activeConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(activeConfig) : getApp();
    db = getFirestore(app);
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export const isFirebaseConnected = (): boolean => db !== null;

// Reactive event listeners for local fallback mode
type ListenerCallback<T> = (data: T) => void;
const orderListeners = new Set<ListenerCallback<ClockOrder[]>>();
const chatListeners = new Set<ListenerCallback<ChatMessage[]>>();
const roomListeners = new Map<string, Set<ListenerCallback<ClockConfig>>>();

// Demo Initial Data
const INITIAL_DEMO_ORDERS: ClockOrder[] = [
  {
    id: 'ORD-98421',
    trackingNumber: 'CHRONO-98421-US',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@vance-designs.com',
    totalAmount: 380,
    currentStage: 'dial-printing',
    estimatedDeliveryDays: 4,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    clockConfig: {
      name: 'Vance Residence Statement Clock',
      size: 18,
      frameMaterial: 'walnut',
      dialColor: '#181C28',
      dialTexture: 'brushed-wood',
      numeralStyle: 'roman',
      numeralColor: '#E6C453',
      handStyle: 'breguet-luxury',
      handColor: '#E6C453',
      secondHandColor: '#EF4444',
      engravedText: 'VANCE EST. 2026',
      engravedFont: 'Cinzel',
      engravedPosition: 'dial-bottom',
      engravedInlayStyle: 'gold-foil',
      ledBacklight: true,
      ledColor: '#FCE076',
      chime: 'silent-sweep',
      subdials: [
        { id: 'sub-1', label: 'LONDON', timezoneOffsetHours: 0, position: 'left' },
        { id: 'sub-2', label: 'TOKYO', timezoneOffsetHours: 9, position: 'right' },
      ],
    },
    history: [
      {
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        stage: 'order-placed',
        message: 'Order received and specs queued for master craftsman review.',
        author: 'System',
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        stage: 'material-sourcing',
        message: 'Hand-selecting premium American Black Walnut timber blank.',
        author: 'Master Craftsman',
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
        stage: 'laser-cutting',
        message: 'Precision CNC bezel shaping and laser engraving completed.',
        author: 'Master Craftsman',
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 0.2).toISOString(),
        stage: 'dial-printing',
        message: 'UV printing luxury brushed gold indices on dark dial core.',
        author: 'Master Craftsman',
      },
    ],
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'artisan',
    senderName: 'Master Craftsman Jean-Luc',
    text: 'Welcome to ChronoCraft Studio! I am online to assist you with timber finishes, dial photo resolutions, or custom laser inscriptions.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

function getLocalOrders(): ClockOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
  return INITIAL_DEMO_ORDERS;
}

function saveLocalOrders(orders: ClockOrder[]) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  orderListeners.forEach((cb) => cb(orders));
}

function getLocalChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_CHAT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(INITIAL_CHAT_MESSAGES));
  return INITIAL_CHAT_MESSAGES;
}

function saveLocalChat(msgs: ChatMessage[]) {
  localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(msgs));
  chatListeners.forEach((cb) => cb(msgs));
}

// ----------------------------------------------------
// PUBLIC REAL-TIME SERVICE APIS
// ----------------------------------------------------

// 1. Subscribe to Live Orders
export function subscribeToOrders(callback: (orders: ClockOrder[]) => void): () => void {
  if (db) {
    const q = query(collection(db, 'clock_orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders: ClockOrder[] = snapshot.docs.map((docSnap) => docSnap.data() as ClockOrder);
      callback(orders);
    });
  } else {
    orderListeners.add(callback);
    callback(getLocalOrders());
    return () => {
      orderListeners.delete(callback);
    };
  }
}

// 2. Subscribe to Single Order
export function subscribeToSingleOrder(
  searchQuery: string,
  callback: (order: ClockOrder | null) => void
): () => void {
  const cleanQuery = searchQuery.trim().toUpperCase();

  if (db) {
    const ordersRef = collection(db, 'clock_orders');
    return onSnapshot(ordersRef, (snapshot) => {
      const docMatch = snapshot.docs.find((d) => {
        const data = d.data() as ClockOrder;
        return data.id?.toUpperCase() === cleanQuery || data.trackingNumber?.toUpperCase() === cleanQuery;
      });
      callback(docMatch ? (docMatch.data() as ClockOrder) : null);
    });
  } else {
    const handleUpdate = (orders: ClockOrder[]) => {
      const match = orders.find(
        (o) => o.id.toUpperCase() === cleanQuery || o.trackingNumber.toUpperCase() === cleanQuery
      );
      callback(match || null);
    };
    orderListeners.add(handleUpdate);
    handleUpdate(getLocalOrders());
    return () => {
      orderListeners.delete(handleUpdate);
    };
  }
}

// 3. Create Order
export async function createOrder(
  config: ClockConfig,
  customerName: string,
  customerEmail: string,
  totalAmount: number
): Promise<ClockOrder> {
  const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const trackingNumber = `CHRONO-${Math.floor(10000 + Math.random() * 90000)}-US`;
  const now = new Date().toISOString();

  const newOrder: ClockOrder = {
    id,
    trackingNumber,
    customerName,
    customerEmail,
    clockConfig: config,
    totalAmount,
    currentStage: 'order-placed',
    estimatedDeliveryDays: 7,
    createdAt: now,
    history: [
      {
        timestamp: now,
        stage: 'order-placed',
        message: 'Order confirmed and registered in production system.',
        author: 'System',
      },
    ],
  };

  if (db) {
    await setDoc(doc(db, 'clock_orders', id), newOrder);
  } else {
    const local = getLocalOrders();
    saveLocalOrders([newOrder, ...local]);
  }

  return newOrder;
}

// 4. Update Order Stage
export async function updateOrderStage(
  orderId: string,
  nextStage: OrderStage,
  statusMessage: string,
  author: 'System' | 'Master Craftsman' | 'Quality Auditor' | 'Shipping Team' = 'Master Craftsman'
) {
  const now = new Date().toISOString();
  const updateItem = {
    timestamp: now,
    stage: nextStage,
    message: statusMessage,
    author,
  };

  if (db) {
    const docRef = doc(db, 'clock_orders', orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ClockOrder;
      const updatedHistory = [...data.history, updateItem];
      await updateDoc(docRef, {
        currentStage: nextStage,
        history: updatedHistory,
      });
    }
  } else {
    const orders = getLocalOrders();
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      target.currentStage = nextStage;
      target.history.push(updateItem);
      saveLocalOrders([...orders]);
    }
  }
}

// 5. Save Design
export async function saveClockDesign(config: ClockConfig): Promise<string> {
  const id = config.id || `DESIGN-${Math.floor(10000 + Math.random() * 90000)}`;
  const designRecord: ClockConfig = {
    ...config,
    id,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await setDoc(doc(db, 'saved_designs', id), designRecord);
  } else {
    const current = getLocalDesigns();
    const existingIndex = current.findIndex((d) => d.id === id);
    if (existingIndex >= 0) {
      current[existingIndex] = designRecord;
    } else {
      current.unshift(designRecord);
    }
    localStorage.setItem(LOCAL_DESIGNS_KEY, JSON.stringify(current));
  }

  return id;
}

function getLocalDesigns(): ClockConfig[] {
  try {
    const raw = localStorage.getItem(LOCAL_DESIGNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

// 6. Submit Bespoke Quote
export async function submitBespokeQuote(req: Omit<BespokeQuoteRequest, 'id' | 'status' | 'submittedAt'>) {
  const id = `QUOTE-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullReq: BespokeQuoteRequest = {
    ...req,
    id,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  if (db) {
    await setDoc(doc(db, 'bespoke_quotes', id), fullReq);
  } else {
    const raw = localStorage.getItem('chronocraft_quotes') || '[]';
    const list = JSON.parse(raw);
    list.unshift(fullReq);
    localStorage.setItem('chronocraft_quotes', JSON.stringify(list));
  }
  return id;
}

// ----------------------------------------------------
// NEW REAL-TIME FEATURE APIS: CHAT, COLLABORATION, AUTHENTICATOR
// ----------------------------------------------------

// 7. Subscribe to Live Consultation Chat Messages
export function subscribeToChatMessages(callback: (messages: ChatMessage[]) => void): () => void {
  if (db) {
    const q = query(collection(db, 'consultation_chats'), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => d.data() as ChatMessage);
      callback(msgs);
    });
  } else {
    chatListeners.add(callback);
    callback(getLocalChat());
    return () => {
      chatListeners.delete(callback);
    };
  }
}

// 8. Send Live Consultation Chat Message
export async function sendChatMessage(text: string, sender: 'client' | 'artisan', senderName: string) {
  const msg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender,
    senderName,
    text,
    timestamp: new Date().toISOString(),
  };

  if (db) {
    await setDoc(doc(db, 'consultation_chats', msg.id), msg);
  } else {
    const current = getLocalChat();
    saveLocalChat([...current, msg]);
  }
}

// 9. Subscribe to Real-Time Collaborative Co-Design Session
export function subscribeToCollaborativeSession(
  roomId: string,
  callback: (config: ClockConfig) => void
): () => void {
  if (db) {
    const docRef = doc(db, 'collaborative_rooms', roomId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CollaborativeSession;
        callback(data.activeConfig);
      }
    });
  } else {
    if (!roomListeners.has(roomId)) {
      roomListeners.set(roomId, new Set());
    }
    const set = roomListeners.get(roomId)!;
    set.add(callback);
    return () => {
      set.delete(callback);
    };
  }
}

// 10. Update Collaborative Co-Design Session State
export async function updateCollaborativeSession(
  roomId: string,
  config: ClockConfig,
  updatedBy: string
) {
  const session: CollaborativeSession = {
    roomId,
    activeConfig: config,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    await setDoc(doc(db, 'collaborative_rooms', roomId), session);
  } else {
    const listeners = roomListeners.get(roomId);
    if (listeners) {
      listeners.forEach((cb) => cb(config));
    }
  }
}

// 11. Verify Authenticity Serial Certificate
export async function verifySerialNumber(serial: string): Promise<AuthenticCertificate> {
  const clean = serial.trim().toUpperCase();

  if (clean === 'CHRONO-CERT-8842' || clean === 'CHRONO-98421-US') {
    return {
      serialNumber: clean,
      clockName: 'Vance Heritage Executive Walnut',
      frameMaterial: 'Hand-Selected American Black Walnut',
      craftedDate: 'September 14, 2026',
      masterCraftsman: 'Master Artisan Jean-Luc Vance',
      movementSpec: 'Japanese Seiko Silent Precision Quartz (±2 sec/year)',
      status: 'AUTHENTIC',
    };
  }

  if (clean.startsWith('CHRONO-')) {
    return {
      serialNumber: clean,
      clockName: 'Custom ChronoCraft Studio Edition',
      frameMaterial: 'Certified Solid Timber / Brushed Brass',
      craftedDate: 'Recorded in Craft Register',
      masterCraftsman: 'Studio Master Craftsman Guild',
      movementSpec: 'Calibre CC-2026 High Torque Silent Sweep',
      status: 'AUTHENTIC',
    };
  }

  return {
    serialNumber: clean,
    clockName: 'Unknown Item',
    frameMaterial: 'N/A',
    craftedDate: 'N/A',
    masterCraftsman: 'N/A',
    movementSpec: 'N/A',
    status: 'NOT_FOUND',
  };
}
