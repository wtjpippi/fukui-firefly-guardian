import { useEffect, useRef } from 'react';
import './FireflyParticles.css';

class Firefly {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = 0;
    this.targetOpacity = Math.random() * 0.8 + 0.2;
    this.fadeSpeed = Math.random() * 0.008 + 0.003;
    this.glowSize = this.size * (Math.random() * 4 + 3);
    this.phase = 'in'; // in, hold, out
    this.holdTime = Math.random() * 120 + 60;
    this.holdCounter = 0;
    this.hue = Math.random() * 20 + 55; // 55-75 (yellow-green)
  }

  update() {
    // Gentle movement
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX += (Math.random() - 0.5) * 0.05;
    this.speedY += (Math.random() - 0.5) * 0.05;
    this.speedX *= 0.99;
    this.speedY *= 0.99;

    // Wrap around
    if (this.x < -20) this.x = this.canvas.width + 20;
    if (this.x > this.canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = this.canvas.height + 20;
    if (this.y > this.canvas.height + 20) this.y = -20;

    // Fade cycle
    if (this.phase === 'in') {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= this.targetOpacity) {
        this.opacity = this.targetOpacity;
        this.phase = 'hold';
      }
    } else if (this.phase === 'hold') {
      this.holdCounter++;
      if (this.holdCounter >= this.holdTime) {
        this.phase = 'out';
      }
    } else if (this.phase === 'out') {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  draw(ctx) {
    if (this.opacity <= 0) return;

    ctx.save();

    // Outer glow
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.glowSize
    );
    gradient.addColorStop(0, `hsla(${this.hue}, 80%, 65%, ${this.opacity * 0.6})`);
    gradient.addColorStop(0.4, `hsla(${this.hue}, 80%, 55%, ${this.opacity * 0.2})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 80%, 45%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Core light
    ctx.fillStyle = `hsla(${this.hue}, 90%, 80%, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export default function FireflyParticles({ count = 20 }) {
  const canvasRef = useRef(null);
  const firefliesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create fireflies
    firefliesRef.current = Array.from({ length: count }, () => new Firefly(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      firefliesRef.current.forEach(ff => {
        ff.update();
        ff.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count]);

  return <canvas ref={canvasRef} className="firefly-canvas" />;
}
