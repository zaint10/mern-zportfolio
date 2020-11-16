const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
class Particles {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distanceFromCenter = randomIntFromRange(50, 150);
    this.lastMouse = {x: x, y: y}
     

    this.update = () => {
      const lastPoint = { x: this.x, y: this.y };
      // Move poinys over time
      this.radians += this.velocity;

      // Drag Effect
      this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
      this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
      this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
      this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
      this.draw(lastPoint);
    };

    this.draw = (lastPoint) => {
      c.beginPath();
      
      c.strokeStyle = this.color;
      c.lineWidth = this.radius;
      c.moveTo(lastPoint.x, lastPoint.y)
      c.lineTo(this.x, this.y)
      c.stroke()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      c.fill();
    };
  }

  
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    const radius = Math.random() * 2 + 1;
    particles.push(
      new Particles(canvas.width / 2, canvas.height / 2, radius, randomColor())
    );
  }
}

// Animation Loop
var img = new Image();


function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(27, 36, 47, 0.05)"
  c.fillRect(0, 0, canvas.width, canvas.height);


  particles.forEach((particle) => {
    particle.update();
  });
}

init();
animate();
