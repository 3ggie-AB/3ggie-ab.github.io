import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WHEEL_NUMBERS, RED_NUMBERS } from '@/lib/roulette/constants';
import { soundManager } from '@/lib/roulette/audio';

interface RouletteWheelProps {
  isSpinning: boolean;
  targetNumber: number | null;
  onSpinComplete: (winner: number) => void;
  size?: number;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  targetNumber,
  onSpinComplete,
  size = 360,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Wheel angle in radians (rotates clockwise)
  const wheelAngleRef = useRef<number>(0);
  // Ball angle in radians (rotates counter-clockwise)
  const ballAngleRef = useRef<number>(0);
  // Ball radius distance from center
  const ballRadiusRef = useRef<number>(size * 0.43);

  const [displayNumber, setDisplayNumber] = useState<number | null>(null);

  const numSlices = WHEEL_NUMBERS.length; // 37
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Draw the entire wheel and ball on canvas
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, wAngle: number, bAngle: number, bRadius: number, winnerNum: number | null) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 8;

      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.translate(centerX, centerY);

      // --- 1. Outer Mahogany / Rosewood Rim ---
      const outerRimGrad = ctx.createRadialGradient(0, 0, radius * 0.88, 0, 0, radius);
      outerRimGrad.addColorStop(0, '#2e130c');
      outerRimGrad.addColorStop(0.5, '#451a0a');
      outerRimGrad.addColorStop(0.85, '#260e05');
      outerRimGrad.addColorStop(1, '#120502');

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = outerRimGrad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#d97706'; // Gold accent
      ctx.stroke();

      // Outer brass studs / ball track
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.94, 0, 2 * Math.PI);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.stroke();

      // --- 2. Rotating Wheel Pockets ---
      ctx.save();
      ctx.rotate(wAngle);

      const pocketOuterR = radius * 0.88;
      const pocketInnerR = radius * 0.62;

      for (let i = 0; i < numSlices; i++) {
        const num = WHEEL_NUMBERS[i];
        const angleStart = i * sliceAngle - sliceAngle / 2;
        const angleEnd = angleStart + sliceAngle;

        let pocketColor = '#171717'; // black
        if (num === 0) {
          pocketColor = '#059669'; // emerald green
        } else if (RED_NUMBERS.has(num)) {
          pocketColor = '#dc2626'; // ruby red
        }

        // Highlight winner if settled
        const isWinner = winnerNum !== null && winnerNum === num && !isSpinning;
        if (isWinner) {
          pocketColor = '#f59e0b'; // amber glow
        }

        // Draw pocket slice
        ctx.beginPath();
        ctx.arc(0, 0, pocketOuterR, angleStart, angleEnd);
        ctx.arc(0, 0, pocketInnerR, angleEnd, angleStart, true);
        ctx.closePath();
        ctx.fillStyle = pocketColor;
        ctx.fill();

        // Metallic frets (separators)
        ctx.beginPath();
        ctx.moveTo(pocketInnerR * Math.cos(angleStart), pocketInnerR * Math.sin(angleStart));
        ctx.lineTo(pocketOuterR * Math.cos(angleStart), pocketOuterR * Math.sin(angleStart));
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isWinner ? '#ffffff' : '#e5e7eb';
        ctx.stroke();

        // Pocket Number Text
        ctx.save();
        const midAngle = angleStart + sliceAngle / 2;
        ctx.rotate(midAngle);
        ctx.translate((pocketOuterR + pocketInnerR) / 2, 0);
        ctx.rotate(Math.PI / 2); // Orient text readable radially

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, Math.floor(size * 0.033))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore();
      }

      // --- 3. Inner Wheel Core / Gold Turret ---
      // Inner ring
      const innerRingGrad = ctx.createRadialGradient(0, 0, pocketInnerR * 0.6, 0, 0, pocketInnerR);
      innerRingGrad.addColorStop(0, '#b45309');
      innerRingGrad.addColorStop(0.7, '#78350f');
      innerRingGrad.addColorStop(1, '#451a0a');

      ctx.beginPath();
      ctx.arc(0, 0, pocketInnerR, 0, 2 * Math.PI);
      ctx.fillStyle = innerRingGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      // Brass Center Cone Turret
      const turretR = pocketInnerR * 0.55;
      const turretGrad = ctx.createRadialGradient(-turretR * 0.3, -turretR * 0.3, 2, 0, 0, turretR);
      turretGrad.addColorStop(0, '#fef08a');
      turretGrad.addColorStop(0.3, '#f59e0b');
      turretGrad.addColorStop(0.7, '#b45309');
      turretGrad.addColorStop(1, '#78350f');

      ctx.beginPath();
      ctx.arc(0, 0, turretR, 0, 2 * Math.PI);
      ctx.fillStyle = turretGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();

      // Turret crossbeams / spindle details
      ctx.beginPath();
      for (let a = 0; a < 4; a++) {
        const ang = (a * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(turretR * 0.85 * Math.cos(ang), turretR * 0.85 * Math.sin(ang));
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      // Center knob
      ctx.beginPath();
      ctx.arc(0, 0, turretR * 0.25, 0, 2 * Math.PI);
      ctx.fillStyle = '#fffbeb';
      ctx.fill();

      ctx.restore(); // end wheel rotation

      // --- 4. Ivory Ball ---
      if (bRadius > 0) {
        const ballX = bRadius * Math.cos(bAngle);
        const ballY = bRadius * Math.sin(bAngle);
        const ballSize = Math.max(5, Math.floor(size * 0.024));

        // Ball shadow
        ctx.beginPath();
        ctx.arc(ballX + 2, ballY + 2, ballSize, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Ball gradient (3D pearl ivory)
        const ballGrad = ctx.createRadialGradient(
          ballX - ballSize * 0.3,
          ballY - ballSize * 0.3,
          1,
          ballX,
          ballY,
          ballSize
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.6, '#f3f4f6');
        ballGrad.addColorStop(1, '#9ca3af');

        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI);
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#d1d5db';
        ctx.stroke();
      }

      ctx.restore();
    },
    [numSlices, size, sliceAngle, isSpinning]
  );

  // Initial draw & resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, wheelAngleRef.current, ballAngleRef.current, ballRadiusRef.current, displayNumber);
  }, [draw, displayNumber, size]);

  // Spin animation loop
  useEffect(() => {
    if (!isSpinning || targetNumber === null) return;

    soundManager.playSpinStart();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find slice index of targetNumber
    const targetIndex = WHEEL_NUMBERS.indexOf(targetNumber);
    if (targetIndex === -1) return;

    // Calculate final wheel angle so that the target number sits at the top (or where the ball lands)
    // Wheel rotates clockwise. Ball rotates counter-clockwise.
    const duration = 4800; // 4.8 seconds
    const startTime = performance.now();

    const initialWheelAngle = wheelAngleRef.current;
    const initialBallAngle = ballAngleRef.current;

    // Wheel will do 4 full spins + align to target
    // In wheel coordinates, target pocket is at angle targetIndex * sliceAngle.
    // If the ball stops at top (angle -PI/2) or specific landing angle:
    const landingAngle = -Math.PI / 2; // top of wheel
    // We want: initialWheelAngle + wheelSpins + offset such that (wheelAngle + targetIndex * sliceAngle) % 2PI == landingAngle
    const fullWheelSpins = 4 * 2 * Math.PI;
    const targetWheelAngle =
      initialWheelAngle + fullWheelSpins + (landingAngle - (initialWheelAngle % (2 * Math.PI)) - targetIndex * sliceAngle);

    // Ball will do 8 full counter-clockwise rotations and spiral inward
    const fullBallSpins = -8 * 2 * Math.PI;
    const targetBallAngle = landingAngle;
    const totalBallAngleDiff = fullBallSpins + (targetBallAngle - (initialBallAngle % (2 * Math.PI)));

    const startBallRadius = size * 0.43;
    const targetBallRadius = size * 0.375; // pocket radius

    let lastTickTime = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth cubic-bezier ease-out curve
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);
      const easeProgress = easeOut(progress);

      // Current wheel angle
      const curWheelAngle = initialWheelAngle + (targetWheelAngle - initialWheelAngle) * easeProgress;
      wheelAngleRef.current = curWheelAngle;

      // Current ball angle
      const curBallAngle = initialBallAngle + totalBallAngleDiff * easeProgress;
      ballAngleRef.current = curBallAngle;

      // Ball drops into pocket in last 30% of time
      let curBallRadius = startBallRadius;
      if (progress > 0.65) {
        const dropProgress = (progress - 0.65) / 0.35;
        // bouncing effect
        const bounce = Math.sin(dropProgress * Math.PI * 4) * (1 - dropProgress) * (size * 0.02);
        curBallRadius = startBallRadius - (startBallRadius - targetBallRadius) * dropProgress + bounce;
      }
      ballRadiusRef.current = curBallRadius;

      // Audio tick sounds on metal frets
      if (now - lastTickTime > 80 && progress < 0.95) {
        const speed = 1 - easeProgress;
        if (Math.random() < speed * 1.5 + 0.1) {
          soundManager.playBallTick(1600 + Math.random() * 400, 0.12 * speed + 0.05);
          lastTickTime = now;
        }
      }

      draw(ctx, curWheelAngle, curBallAngle, curBallRadius, null);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        soundManager.playBallPocket();
        setDisplayNumber(targetNumber);
        draw(ctx, targetWheelAngle, targetBallAngle, targetBallRadius, targetNumber);
        onSpinComplete(targetNumber);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpinning, targetNumber, onSpinComplete, draw, size, sliceAngle]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      {/* Canvas roulette wheel */}
      <div className="relative rounded-full shadow-2xl p-1 bg-gradient-to-b from-amber-600/40 via-stone-900 to-black border-2 border-amber-500/30">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full shadow-inner block"
          style={{ width: `${size}px`, height: `${size}px` }}
        />

        {/* Top pointer indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow-md z-10" />
      </div>

      {/* Winner Display Badge */}
      {displayNumber !== null && !isSpinning && (
        <div className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/50 shadow-lg animate-in zoom-in-75 duration-300">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Hasil Terakhir:</span>
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-black text-white ${
              displayNumber === 0
                ? 'bg-emerald-600'
                : RED_NUMBERS.has(displayNumber)
                ? 'bg-red-600'
                : 'bg-stone-900 border border-stone-600'
            }`}
          >
            {displayNumber}
          </span>
          <span className="text-xs font-bold text-amber-400">
            {displayNumber === 0 ? 'HIJAU' : RED_NUMBERS.has(displayNumber) ? 'MERAH' : 'HITAM'}
          </span>
        </div>
      )}
    </div>
  );
};
