import React, { useEffect, useRef } from 'react';
import { VoiceState } from '../types/assistant';

interface AudioWaveformProps {
  state: VoiceState;
  className?: string;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  state,
  className = '',
  barCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const step = width / barCount;
      const barWidth = Math.max(3, step * 0.45);

      phase += state === 'speaking' ? 0.08 : state === 'listening' ? 0.12 : state === 'thinking' ? 0.05 : 0.02;

      for (let i = 0; i < barCount; i++) {
        const x = i * step + step / 2;
        const norm = (i / barCount) * Math.PI * 2;

        let amplitude = 4;
        if (state === 'speaking') {
          // Dynamic harmonic motion
          const wave1 = Math.sin(norm * 2 + phase);
          const wave2 = Math.cos(norm * 3 - phase * 1.5);
          const envelope = Math.sin((i / barCount) * Math.PI); // tapering edges
          amplitude = Math.max(6, Math.abs(wave1 * 0.6 + wave2 * 0.4) * (height * 0.42) * envelope + 6);
        } else if (state === 'listening') {
          // More rapid, active mic detection visual
          const wave = Math.sin(norm * 4 + phase * 2);
          const noise = Math.sin(i * 1.7 + phase * 3);
          const envelope = Math.sin((i / barCount) * Math.PI);
          amplitude = Math.max(8, Math.abs(wave * 0.5 + noise * 0.5) * (height * 0.45) * envelope + 8);
        } else if (state === 'thinking') {
          // Gentle propagating ripple
          const wave = Math.sin(norm * 2 - phase);
          amplitude = Math.max(4, Math.abs(wave) * 16 + 5);
        } else {
          // Idle calm ambient wave
          const wave = Math.sin(norm + phase * 0.5);
          amplitude = Math.max(3, Math.abs(wave) * 8 + 4);
        }

        // Color gradients matching theme: purple & indigo / blue
        const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude);
        if (state === 'speaking') {
          gradient.addColorStop(0, '#c084fc'); // purple-400
          gradient.addColorStop(0.5, '#9333ea'); // purple-600
          gradient.addColorStop(1, '#6366f1'); // indigo-500
        } else if (state === 'listening') {
          gradient.addColorStop(0, '#38bdf8'); // sky-400
          gradient.addColorStop(0.5, '#6366f1'); // indigo-500
          gradient.addColorStop(1, '#a855f7'); // purple-500
        } else if (state === 'thinking') {
          gradient.addColorStop(0, '#818cf8');
          gradient.addColorStop(1, '#4f46e5');
        } else {
          gradient.addColorStop(0, 'rgba(148, 163, 184, 0.4)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const topY = centerY - amplitude;
        const barH = amplitude * 2;
        ctx.roundRect(x - barWidth / 2, topY, barWidth, barH, barWidth / 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, barCount]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={340}
        height={56}
        className="w-full h-14 max-w-sm pointer-events-none"
      />
    </div>
  );
};
