import { useEffect, useRef, type ReactNode } from 'react';

const MAX_TILT = 12; // degrees

/**
 * Card that turns to face the mouse: mouse on the left → card turns left.
 * Children with .depth-1 / .depth-2 float above the card for a parallax effect.
 */
export function TiltCard({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!enabled) {
      el.style.transform = '';
      return;
    }

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      // -1 … 1 from the centre of the window
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = nx * MAX_TILT; // rotateY
      target.y = -ny * MAX_TILT; // rotateX
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    // Ease towards the target so the motion is smooth
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.transform = `rotateX(${current.y.toFixed(2)}deg) rotateY(${current.x.toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
    };
  }, [enabled]);

  return (
    <div className="card-stage">
      <main ref={ref} className={`card ${enabled ? 'card-3d' : ''}`}>
        {children}
      </main>
    </div>
  );
}
