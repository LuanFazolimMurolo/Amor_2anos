import { useEffect, useRef } from "react";
import "./Fireworks.css";

const DEFAULT_COLORS = [
  "#d4ac85",
  "#f7d7a6",
  "#ffffff",
  "#ffb86b",
  "#e2bb3b",
  "#fcf9f3",
];

export default function Fireworks({
  active = true,

  interval = 900,
  particlesAmount = Math.random() * 1000,

  minHeight = 60,
  maxHeightPercent = 0.45,

  rocketSize = 3,
  rocketMinSpeed = 2,
  rocketMaxSpeed = 6,

  particleMinSize = 1.5,
  particleMaxSize = 5,
  particleMinSpeed = 2,
  particleMaxSpeed = 7,

  gravity = 0.04,
  friction = 0.98,
  fadeSpeed = 0.010,

  colors = DEFAULT_COLORS,
  backgroundFade = "rgba(0, 0, 0, 0.15)",
}) {
  const canvasRef = useRef(null);

  const configRef = useRef({});

  configRef.current = {
    interval,
    particlesAmount,
    minHeight,
    maxHeightPercent,
    rocketSize,
    rocketMinSpeed,
    rocketMaxSpeed,
    particleMinSize,
    particleMaxSize,
    particleMinSpeed,
    particleMaxSpeed,
    gravity,
    friction,
    fadeSpeed,
    colors,
    backgroundFade,
  };

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationId;
    let intervalId;

    let particles = [];
    let fireworks = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomColor() {
      const { colors } = configRef.current;
      return colors[Math.floor(Math.random() * colors.length)];
    }

    class Firework {
      constructor() {
        const config = configRef.current;

        this.x = Math.random() * canvas.width;
        this.y = canvas.height;

        this.targetY =
          Math.random() * canvas.height * config.maxHeightPercent +
          config.minHeight;

        this.speed = randomBetween(
          config.rocketMinSpeed,
          config.rocketMaxSpeed
        );

        this.color = getRandomColor();
        this.exploded = false;
      }

      update() {
        this.y -= this.speed;

        if (this.y <= this.targetY && !this.exploded) {
          this.exploded = true;
          createExplosion(this.x, this.y, this.color);
        }
      }

      draw() {
        const { rocketSize } = configRef.current;

        if (this.exploded) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, rocketSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        const config = configRef.current;

        this.x = x;
        this.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = randomBetween(
          config.particleMinSpeed,
          config.particleMaxSpeed
        );

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.color = color;

        this.size = randomBetween(
          config.particleMinSize,
          config.particleMaxSize
        );
      }

      update() {
        const config = configRef.current;

        this.vx *= config.friction;
        this.vy *= config.friction;

        this.vy += config.gravity;

        this.x += this.vx;
        this.y += this.vy;

        this.alpha -= config.fadeSpeed;
      }

      draw() {
        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
      }
    }

    function createExplosion(x, y, color) {
      const { particlesAmount } = configRef.current;

      for (let i = 0; i < particlesAmount; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    function animate() {
      const { backgroundFade } = configRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = backgroundFade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((firework) => {
        firework.update();
        firework.draw();
      });

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      fireworks = fireworks.filter((firework) => !firework.exploded);
      particles = particles.filter((particle) => particle.alpha > 0);

      animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    intervalId = setInterval(() => {
      fireworks.push(new Firework());
    }, configRef.current.interval);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="fireworks-canvas" />;
}