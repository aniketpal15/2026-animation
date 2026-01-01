const button = document.getElementById("celebrate-btn");

/* ---------- CONFETTI ---------- */
function launchConfetti() {
  const colors = ["#ff6bcb", "#ffd93b", "#6bffb5", "#6bb7ff", "#ff6bb7", "#b86bff"];

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("span");
    piece.classList.add("confetti");

    const size = Math.random() * 6 + 4;
    piece.style.width = size + "px";
    piece.style.height = size * 1.6 + "px";

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDelay = Math.random() * 0.6 + "s";
    piece.style.animationDuration = 2.4 + Math.random() * 1.8 + "s";

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4000);
  }
}

/* ---------- CANVAS AIR-CRACKER FIREWORKS ---------- */
const canvas = document.getElementById("firework-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let lastTime = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.friction = 0.96;
    this.gravity = 0.05;
    this.color = color;
    this.size = Math.random() * 2 + 1;
  }

  update(delta) {
    const factor = delta / 16.67;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity * factor;
    this.x += this.vx * factor;
    this.y += this.vy * factor;
    this.alpha -= 0.015 * factor;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createFireworkBurst(x, y) {
  const colors = ["#ff6bcb", "#ffd93b", "#6bffb5", "#6bb7ff", "#ff6bb7", "#b86bff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 50;

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function animateFireworks(timestamp) {
  const delta = timestamp - lastTime || 16.67;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => {
    p.update(delta);
    p.draw(ctx);
  });

  requestAnimationFrame(animateFireworks);
}
requestAnimationFrame(animateFireworks);

function randomAirCrackers() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const x = Math.random() * w * 0.8 + w * 0.1;
  const y = Math.random() * h * 0.4 + h * 0.1;
  createFireworkBurst(x, y);
}

/* ---------- BUTTON CLICK ---------- */
button.addEventListener("click", () => {
  launchConfetti();

  const w = window.innerWidth;
  const h = window.innerHeight;
  createFireworkBurst(w / 2, h * 0.35);

  for (let i = 0; i < 3; i++) {
    setTimeout(randomAirCrackers, 300 + i * 250);
  }
});
