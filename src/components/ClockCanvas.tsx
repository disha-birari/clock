import React, { useEffect, useRef, useState } from 'react';
import { ClockConfig, FrameMaterial, WorldSubdial } from '../types/clock';
import { MATERIAL_DETAILS } from '../lib/presets';

interface ClockCanvasProps {
  config: ClockConfig;
  className?: string;
  sizePx?: number;
}

export const ClockCanvas: React.FC<ClockCanvasProps> = ({
  config,
  className = '',
  sizePx = 480,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoImageRef = useRef<HTMLImageElement | null>(null);
  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);

  // Mouse Parallax 3D tilt tracking
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (config.dialTexture === 'custom-photo' && config.customPhotoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.customPhotoUrl;
      img.onload = () => {
        photoImageRef.current = img;
        setPhotoLoaded(true);
      };
    } else {
      photoImageRef.current = null;
      setPhotoLoaded(false);
    }
  }, [config.dialTexture, config.customPhotoUrl]);

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

      const centerX = width / 2 + mouseOffset.x * 3;
      const centerY = height / 2 + mouseOffset.y * 3;
      const radius = Math.min(width, height) / 2 * 0.92;

      // 1. LED Backlight Ambient Halo
      if (config.ledBacklight && config.ledColor) {
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.8,
          centerX,
          centerY,
          radius * 1.08
        );
        glowGrad.addColorStop(0, `${config.ledColor}88`);
        glowGrad.addColorStop(0.5, `${config.ledColor}44`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.08, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Bezel Frame with Dynamic Studio Lighting Angle
      const lightAngle = ((config.lightAngleDegrees || 45) * Math.PI) / 180;
      drawFrameWithLighting(ctx, centerX, centerY, radius, config.frameMaterial, lightAngle);

      // 3. Dial Face Background & Textures
      const dialRadius = radius * 0.82;
      drawDialFace(ctx, centerX, centerY, dialRadius, config, photoImageRef.current);

      // 4. World Time Sub-Dials (Real-Time Ticking Multi-Timezone)
      if (config.subdials && config.subdials.length > 0) {
        drawWorldSubdials(ctx, centerX, centerY, dialRadius, config.subdials, config);
      }

      // 5. Laser Engraved Text Inscription with Inlay Finishes
      if (config.engravedText && config.engravedText.trim().length > 0) {
        drawEngravingInlay(ctx, centerX, centerY, dialRadius, config);
      }

      // 6. Dial Numerals & Minute Tick Marks
      drawNumeralsAndTicks(ctx, centerX, centerY, dialRadius, config);

      // 7. Real-Time Main Clock Hands
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      drawHands(ctx, centerX, centerY, dialRadius, hours, minutes, seconds, config);

      // 8. Center Pin Cap
      ctx.fillStyle = config.handColor || '#E6C453';
      ctx.beginPath();
      ctx.arc(centerX, centerY, dialRadius * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, sizePx, photoLoaded, mouseOffset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block cursor-crosshair ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        className="rounded-full drop-shadow-2xl transition-transform duration-100 ease-out"
      />
    </div>
  );
};

// ----------------------------------------------------
// HELPER DRAWING FUNCTIONS
// ----------------------------------------------------

function drawFrameWithLighting(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  mat: FrameMaterial,
  lightAngle: number
) {
  ctx.save();

  const dx = Math.cos(lightAngle) * r;
  const dy = Math.sin(lightAngle) * r;

  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);

  if (mat === 'brass') {
    grad.addColorStop(0, '#FFF5C2');
    grad.addColorStop(0.3, '#E6C453');
    grad.addColorStop(0.7, '#8C6C23');
    grad.addColorStop(1, '#5C4410');
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
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = r * 0.025;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.stroke();

  ctx.restore();
}

function drawDialFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  config: ClockConfig,
  photoImg: HTMLImageElement | null
) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = config.dialColor || '#181C28';
  ctx.fill();

  if (config.dialTexture === 'custom-photo' && photoImg) {
    const scale = Math.max((r * 2) / photoImg.width, (r * 2) / photoImg.height);
    const w = photoImg.width * scale;
    const h = photoImg.height * scale;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(photoImg, cx - w / 2, cy - h / 2, w, h);
    ctx.globalAlpha = 1.0;
  } else if (config.dialTexture === 'brushed-wood') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = -r; i < r; i += 6) {
      ctx.beginPath();
      ctx.moveTo(cx - r, cy + i);
      ctx.lineTo(cx + r, cy + i + (i % 12));
      ctx.stroke();
    }
  } else if (config.dialTexture === 'marble-vein') {
    ctx.strokeStyle = 'rgba(230, 196, 83, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.8, cy - r * 0.5);
    ctx.bezierCurveTo(cx - r * 0.2, cy - r * 0.2, cx + r * 0.2, cy + r * 0.4, cx + r * 0.7, cy + r * 0.6);
    ctx.stroke();
  } else if (config.dialTexture === 'sunburst') {
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    sunGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
    sunGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = sunGrad;
    ctx.fill();
  }

  const insetGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r);
  insetGrad.addColorStop(0, 'transparent');
  insetGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = insetGrad;
  ctx.fill();

  ctx.restore();
}

// Draw Real-Time World Time Sub-Dials
function drawWorldSubdials(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  subdials: WorldSubdial[],
  config: ClockConfig
) {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  subdials.forEach((sub) => {
    let subCx = cx;
    let subCy = cy;
    const subR = r * 0.26;

    if (sub.position === 'left') {
      subCx = cx - r * 0.45;
      subCy = cy;
    } else if (sub.position === 'right') {
      subCx = cx + r * 0.45;
      subCy = cy;
    } else if (sub.position === 'bottom') {
      subCx = cx;
      subCy = cy + r * 0.45;
    }

    ctx.save();
    // Sub-dial background ring
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = config.numeralColor || '#E6C453';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(subCx, subCy, subR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sub-dial label
    ctx.fillStyle = config.numeralColor || '#E6C453';
    ctx.font = `700 ${Math.round(subR * 0.32)}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(sub.label, subCx, subCy + subR * 0.25);

    // Sub-dial time calculation
    const subHours = (utcHours + sub.timezoneOffsetHours + 24) % 12 + utcMinutes / 60;
    const subHourAngle = (subHours * Math.PI) / 6;
    const subMinAngle = (utcMinutes * Math.PI) / 30;

    // Sub-dial hour hand
    ctx.save();
    ctx.translate(subCx, subCy);
    ctx.rotate(subHourAngle);
    ctx.lineWidth = 2;
    ctx.strokeStyle = config.handColor || '#E6C453';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -subR * 0.55);
    ctx.stroke();
    ctx.restore();

    // Sub-dial minute hand
    ctx.save();
    ctx.translate(subCx, subCy);
    ctx.rotate(subMinAngle);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = config.handColor || '#E6C453';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -subR * 0.75);
    ctx.stroke();
    ctx.restore();

    // Sub-dial center dot
    ctx.fillStyle = config.handColor || '#E6C453';
    ctx.beginPath();
    ctx.arc(subCx, subCy, subR * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

// Laser Engraving Inlay Drawing
function drawEngravingInlay(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  config: ClockConfig
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontName = config.engravedFont || 'Cinzel';
  const fontSize = Math.max(11, Math.round(r * 0.085));
  ctx.font = `600 ${fontSize}px "${fontName}", serif`;

  let textY = cy + r * 0.45;
  if (config.engravedPosition === 'dial-top') {
    textY = cy - r * 0.45;
  } else if (config.engravedPosition === 'rear-brass-plate') {
    textY = cy + r * 0.55;
  }

  const inlay = config.engravedInlayStyle || 'natural-burn';

  if (inlay === 'gold-foil') {
    const goldGrad = ctx.createLinearGradient(cx - 50, textY, cx + 50, textY);
    goldGrad.addColorStop(0, '#FFF2AD');
    goldGrad.addColorStop(0.5, '#E6C453');
    goldGrad.addColorStop(1, '#9C7A1D');
    ctx.fillStyle = goldGrad;
    ctx.shadowColor = '#FCE076';
    ctx.shadowBlur = 6;
  } else if (inlay === 'silver-inlay') {
    const silverGrad = ctx.createLinearGradient(cx - 50, textY, cx + 50, textY);
    silverGrad.addColorStop(0, '#FFFFFF');
    silverGrad.addColorStop(0.5, '#CBD5E1');
    silverGrad.addColorStop(1, '#64748B');
    ctx.fillStyle = silverGrad;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 6;
  } else if (inlay === 'black-enamel') {
    ctx.fillStyle = '#050608';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 2;
  } else {
    // natural burn
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
  }

  ctx.fillText(config.engravedText!.toUpperCase(), cx, textY);
  ctx.restore();
}

function drawNumeralsAndTicks(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  config: ClockConfig
) {
  ctx.save();
  ctx.fillStyle = config.numeralColor || '#E6C453';
  ctx.strokeStyle = config.numeralColor || '#E6C453';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const numeralStyle = config.numeralStyle;

  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isHourTick = i % 5 === 0;
    const tickOuter = r * 0.95;
    const tickInner = isHourTick ? r * 0.87 : r * 0.92;

    ctx.lineWidth = isHourTick ? 2.5 : 1;
    ctx.globalAlpha = isHourTick ? 0.9 : 0.4;

    ctx.beginPath();
    ctx.moveTo(cx + tickOuter * Math.sin(angle), cy - tickOuter * Math.cos(angle));
    ctx.lineTo(cx + tickInner * Math.sin(angle), cy - tickInner * Math.cos(angle));
    ctx.stroke();
  }

  if (numeralStyle === 'none') {
    ctx.restore();
    return;
  }

  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const numRadius = r * 0.74;
  const fontSize = Math.round(r * 0.14);

  for (let hour = 1; hour <= 12; hour++) {
    const angle = (hour * Math.PI) / 6;
    const x = cx + numRadius * Math.sin(angle);
    const y = cy - numRadius * Math.cos(angle);

    ctx.globalAlpha = 0.95;

    if (numeralStyle === 'roman') {
      ctx.font = `600 ${fontSize}px "Cinzel", serif`;
      ctx.fillText(romanNumerals[hour % 12], x, y);
    } else if (numeralStyle === 'arabic') {
      ctx.font = `700 ${fontSize * 0.95}px "Inter", sans-serif`;
      ctx.fillText(hour.toString(), x, y);
    } else if (numeralStyle === 'minimal-dash') {
      if (hour % 3 === 0) {
        ctx.font = `600 ${fontSize * 0.85}px "Inter", sans-serif`;
        ctx.fillText(hour.toString(), x, y);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (numeralStyle === 'sunburst-dots') {
      ctx.beginPath();
      ctx.arc(x, y, hour % 3 === 0 ? r * 0.035 : r * 0.02, 0, Math.PI * 2);
      ctx.fill();
    }
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
  config: ClockConfig
) {
  ctx.save();

  const hourAngle = (hours * Math.PI) / 6;
  const minAngle = (minutes * Math.PI) / 30;
  const secAngle = (seconds * Math.PI) / 30;

  const handStyle = config.handStyle;
  const handColor = config.handColor || '#E6C453';
  const secColor = config.secondHandColor || '#EF4444';

  // --- Hour Hand ---
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(hourAngle);
  ctx.fillStyle = handColor;
  ctx.strokeStyle = handColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;

  const hLength = r * 0.52;
  const hWidth = r * 0.06;

  if (handStyle === 'breguet-luxury') {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.08);
    ctx.lineTo(0, -hLength);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -hLength * 0.7, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
  } else if (handStyle === 'classic-spade') {
    ctx.beginPath();
    ctx.moveTo(-hWidth / 2, r * 0.06);
    ctx.lineTo(-hWidth / 2, -hLength * 0.65);
    ctx.quadraticCurveTo(-hWidth * 1.5, -hLength * 0.8, 0, -hLength);
    ctx.quadraticCurveTo(hWidth * 1.5, -hLength * 0.8, hWidth / 2, -hLength * 0.65);
    ctx.lineTo(hWidth / 2, r * 0.06);
    ctx.closePath();
    ctx.fill();
  } else if (handStyle === 'neon-glow') {
    ctx.shadowColor = handColor;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.05);
    ctx.lineTo(0, -hLength);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.rect(-hWidth / 2, -hLength, hWidth, hLength + r * 0.05);
    ctx.fill();
  }
  ctx.restore();

  // --- Minute Hand ---
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(minAngle);
  ctx.fillStyle = handColor;
  ctx.strokeStyle = handColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;

  const mLength = r * 0.76;
  const mWidth = r * 0.045;

  if (handStyle === 'breguet-luxury') {
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.08);
    ctx.lineTo(0, -mLength);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -mLength * 0.75, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
  } else if (handStyle === 'neon-glow') {
    ctx.shadowColor = handColor;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.05);
    ctx.lineTo(0, -mLength);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.rect(-mWidth / 2, -mLength, mWidth, mLength + r * 0.06);
    ctx.fill();
  }
  ctx.restore();

  // --- Second Hand ---
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(secAngle);
  ctx.fillStyle = secColor;
  ctx.strokeStyle = secColor;
  ctx.shadowColor = secColor;
  ctx.shadowBlur = 6;

  const sLength = r * 0.85;

  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.15);
  ctx.lineTo(0, -sLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.03, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}
