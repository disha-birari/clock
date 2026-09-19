import React, { useEffect, useRef } from 'react';
import { PhotoClockConfig, PhotoSlot, PhotoMaskShape, ClockBodyShape, ClockPinStyle } from '../types/clock';
import { MATERIAL_DETAILS } from '../lib/presets';

interface PhotoClockCanvasProps {
  config: PhotoClockConfig;
  sizePx?: number;
  className?: string;
}

export const PhotoClockCanvas: React.FC<PhotoClockCanvasProps> = ({
  config,
  sizePx = 480,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Preload slot images when config.slots change
  useEffect(() => {
    config.slots.forEach((slot) => {
      if (slot.imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = slot.imageUrl;
        img.onload = () => {
          loadedImagesRef.current.set(slot.id, img);
        };
      } else {
        loadedImagesRef.current.delete(slot.id);
      }
    });
  }, [config.slots]);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = sizePx;
      const height = sizePx;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 2 * 0.9;

      // 1. Render Clock Body Outline based on Body Shape Selection
      drawClockBody(ctx, cx, cy, radius, config.bodyShape, config.frameMaterial);

      // 2. Render Dial Face Background
      const dialR = radius * 0.82;
      ctx.save();
      clipClockBodyDial(ctx, cx, cy, dialR, config.bodyShape);
      ctx.fillStyle = config.dialColor || '#181C28';
      ctx.fill();

      // 3. Render Multi-Photo Slots with Mask Shapes
      drawPhotoSlots(ctx, cx, cy, dialR, config, loadedImagesRef.current);

      ctx.restore();

      // 4. Render Laser Engraved Text Inscription
      if (config.engravedText && config.engravedText.trim().length > 0) {
        ctx.save();
        ctx.fillStyle = config.handColor || '#E6C453';
        ctx.font = `600 ${Math.round(dialR * 0.08)}px "Cinzel", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.engravedText.toUpperCase(), cx, cy + dialR * 0.55);
        ctx.restore();
      }

      // 5. Render Hour Tick Marks & Numerals
      drawTicks(ctx, cx, cy, dialR, config.handColor || '#E6C453');

      // 6. Real-Time Moving Clock Hands
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      drawHands(ctx, cx, cy, dialR, hours, minutes, seconds, config);

      // 7. Render Clock Pins & Center Cap
      drawClockPinCap(ctx, cx, cy, dialR * 0.06, config.pinStyle, config.pinColor);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, sizePx]);

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        className="rounded-2xl drop-shadow-2xl transition-all duration-300"
      />
    </div>
  );
};

// ----------------------------------------------------
// BODY SHAPES & MASK CLIP DRAWING HELPERS
// ----------------------------------------------------

function drawClockBody(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  shape: ClockBodyShape,
  mat: PhotoClockConfig['frameMaterial']
) {
  ctx.save();
  const matInfo = MATERIAL_DETAILS[mat];

  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  if (mat === 'brass') {
    grad.addColorStop(0, '#FFF5C2');
    grad.addColorStop(0.5, '#E6C453');
    grad.addColorStop(1, '#8C6C23');
  } else if (mat === 'walnut') {
    grad.addColorStop(0, '#6E4537');
    grad.addColorStop(0.5, '#3D251E');
    grad.addColorStop(1, '#1A0D0A');
  } else if (mat === 'rosewood') {
    grad.addColorStop(0, '#592922');
    grad.addColorStop(0.5, '#2C1613');
    grad.addColorStop(1, '#120807');
  } else if (mat === 'marble') {
    grad.addColorStop(0, '#3A3F50');
    grad.addColorStop(0.5, '#11141D');
    grad.addColorStop(1, '#050608');
  } else if (mat === 'neon-acrylic') {
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#0F172A');
    grad.addColorStop(1, '#F43F5E');
  } else {
    grad.addColorStop(0, '#333A4C');
    grad.addColorStop(0.5, '#181C28');
    grad.addColorStop(1, '#090B10');
  }

  ctx.fillStyle = grad;

  if (shape === 'square-minimal') {
    const w = r * 1.8;
    const h = r * 1.8;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r * 0.15);
    ctx.fill();
    ctx.lineWidth = r * 0.03;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  } else if (shape === 'arch-tabletop') {
    const w = r * 1.6;
    const h = r * 1.9;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy - h / 4);
    ctx.arc(cx, cy - h / 4, w / 2, Math.PI, 0, false);
    ctx.lineTo(cx + w / 2, cy + h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = r * 0.03;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  } else if (shape === 'hexagon-geometric') {
    const sides = 6;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      const x = cx + r * 0.95 * Math.cos(a);
      const y = cy + r * 0.95 * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = r * 0.03;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  } else {
    // round wall
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = r * 0.03;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  }

  ctx.restore();
}

function clipClockBodyDial(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  shape: ClockBodyShape
) {
  ctx.beginPath();
  if (shape === 'square-minimal') {
    const w = r * 1.8;
    const h = r * 1.8;
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r * 0.12);
  } else if (shape === 'arch-tabletop') {
    const w = r * 1.6;
    const h = r * 1.8;
    ctx.moveTo(cx - w / 2, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy - h / 4);
    ctx.arc(cx, cy - h / 4, w / 2, Math.PI, 0, false);
    ctx.lineTo(cx + w / 2, cy + h / 2);
    ctx.closePath();
  } else if (shape === 'hexagon-geometric') {
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.clip();
}

// Draw Multi-Photo Slots inside Masks
function drawPhotoSlots(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  config: PhotoClockConfig,
  loadedImgs: Map<number, HTMLImageElement>
) {
  const { photoCount, maskShape, slots } = config;

  slots.forEach((slot, index) => {
    ctx.save();

    // 1. Define Slot Position & Mask Shape
    setSlotMaskPath(ctx, cx, cy, r, photoCount, maskShape, index);
    ctx.clip();

    // Fill slot background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    const img = loadedImgs.get(slot.id);
    if (img) {
      // Calculate image containment
      const slotBox = getSlotBounds(cx, cy, r, photoCount, maskShape, index);
      const zoom = slot.zoom || 1.0;
      const w = slotBox.w * zoom;
      const h = slotBox.h * zoom;
      const x = slotBox.cx - w / 2 + slot.xOffset;
      const y = slotBox.cy - h / 2 + slot.yOffset;

      ctx.globalAlpha = 0.92;
      ctx.drawImage(img, x, y, w, h);
      ctx.globalAlpha = 1.0;
    } else {
      // Render Placeholder label
      const bounds = getSlotBounds(cx, cy, r, photoCount, maskShape, index);
      ctx.fillStyle = 'rgba(230, 196, 83, 0.4)';
      ctx.font = `600 ${Math.round(r * 0.08)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`📷 Photo ${slot.id}`, bounds.cx, bounds.cy);
    }

    // Slot border highlight
    setSlotMaskPath(ctx, cx, cy, r, photoCount, maskShape, index);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(230, 196, 83, 0.4)';
    ctx.stroke();

    ctx.restore();
  });
}

function setSlotMaskPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  photoCount: number,
  maskShape: PhotoMaskShape,
  index: number
) {
  ctx.beginPath();

  if (maskShape === 'heart') {
    // Heart path clip mask
    const hSize = r * 0.75;
    const hCx = cx;
    const hCy = cy - hSize * 0.1;
    ctx.moveTo(hCx, hCy + hSize * 0.3);
    ctx.bezierCurveTo(hCx - hSize * 0.6, hCy - hSize * 0.4, hCx - hSize, hCy + hSize * 0.2, hCx, hCy + hSize * 0.8);
    ctx.bezierCurveTo(hCx + hSize, hCy + hSize * 0.2, hCx + hSize * 0.6, hCy - hSize * 0.4, hCx, hCy + hSize * 0.3);
    ctx.closePath();
  } else if (maskShape === '12-hour-circles' || photoCount === 12) {
    // 12 circles around the clock face corresponding to 12 hours
    const hour = index + 1;
    const angle = (hour * Math.PI) / 6;
    const slotR = r * 0.2;
    const slotCx = cx + r * 0.7 * Math.sin(angle);
    const slotCy = cy - r * 0.7 * Math.cos(angle);
    ctx.arc(slotCx, slotCy, slotR, 0, Math.PI * 2);
  } else if (photoCount === 4 || maskShape === 'quadrant') {
    // 4 quadrant slices
    const slotR = r * 0.75;
    const angles = [
      { start: Math.PI, end: Math.PI * 1.5 },
      { start: Math.PI * 1.5, end: Math.PI * 2 },
      { start: 0, end: Math.PI * 0.5 },
      { start: Math.PI * 0.5, end: Math.PI },
    ];
    const a = angles[index % 4];
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, slotR, a.start, a.end);
    ctx.closePath();
  } else if (photoCount === 2) {
    // Left / Right half splits
    if (index === 0) {
      ctx.arc(cx, cy, r * 0.78, Math.PI * 0.5, Math.PI * 1.5);
    } else {
      ctx.arc(cx, cy, r * 0.78, Math.PI * 1.5, Math.PI * 0.5);
    }
    ctx.closePath();
  } else {
    // 1 Photo center circle / default
    ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
  }
}

function getSlotBounds(
  cx: number,
  cy: number,
  r: number,
  photoCount: number,
  maskShape: PhotoMaskShape,
  index: number
) {
  if (photoCount === 12 || maskShape === '12-hour-circles') {
    const hour = index + 1;
    const angle = (hour * Math.PI) / 6;
    const slotR = r * 0.2;
    return {
      cx: cx + r * 0.7 * Math.sin(angle),
      cy: cy - r * 0.7 * Math.cos(angle),
      w: slotR * 2.4,
      h: slotR * 2.4,
    };
  }
  return { cx, cy, w: r * 1.6, h: r * 1.6 };
}

function drawTicks(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isHour = i % 5 === 0;
    const tickOuter = r * 0.96;
    const tickInner = isHour ? r * 0.88 : r * 0.93;
    ctx.lineWidth = isHour ? 2.5 : 1;
    ctx.globalAlpha = isHour ? 0.9 : 0.4;
    ctx.beginPath();
    ctx.moveTo(cx + tickOuter * Math.sin(angle), cy - tickOuter * Math.cos(angle));
    ctx.lineTo(cx + tickInner * Math.sin(angle), cy - tickInner * Math.cos(angle));
    ctx.stroke();
  }
  ctx.restore();
}

function drawHands(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  hours: number,
  minutes: number,
  seconds: number,
  config: PhotoClockConfig
) {
  ctx.save();
  const hourAngle = (hours * Math.PI) / 6;
  const minAngle = (minutes * Math.PI) / 30;
  const secAngle = (seconds * Math.PI) / 30;

  const handColor = config.handColor || '#E6C453';
  const secColor = config.secondHandColor || '#EF4444';

  // Hour Hand
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(hourAngle);
  ctx.lineWidth = 4;
  ctx.strokeStyle = handColor;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.5);
  ctx.stroke();
  ctx.restore();

  // Minute Hand
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(minAngle);
  ctx.lineWidth = 3;
  ctx.strokeStyle = handColor;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.72);
  ctx.stroke();
  ctx.restore();

  // Second Hand
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(secAngle);
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = secColor;
  ctx.shadowColor = secColor;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.1);
  ctx.lineTo(0, -r * 0.82);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawClockPinCap(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  pinR: number,
  style: ClockPinStyle,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  if (style === 'ruby-gem-pin') {
    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, pinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (style === 'black-obsidian-pin') {
    ctx.fillStyle = '#050608';
    ctx.beginPath();
    ctx.arc(0, 0, pinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (style === 'silver-capped-pin') {
    ctx.fillStyle = '#E2E8F0';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, pinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    // gold bullet pin
    ctx.fillStyle = color || '#E6C453';
    ctx.shadowColor = '#FCE076';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, pinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}
