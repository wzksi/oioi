let RENDERER = {
  init: function () {
    this.setParameters();
    this.reconstructMethods();
    this.render();
  },
  setParameters: function () {
    this.$container = $("#jsi-butterfly-container");
    this.width = this.$container.width();
    this.height = this.$container.height();
    this.context = $("<canvas />")
      .attr({ width: this.width, height: this.height })
      .appendTo(this.$container)
      .get(0)
      .getContext("2d");
    this.butterflies = [new BUTTERFLY(this)];
    this.particles = [];
    this.count = this.getRandomValue(200, 500);
  },
  reconstructMethods: function () {
    this.render = this.render.bind(this);
  },
  getRandomValue: function (min, max) {
    return min + (max - min) * Math.random();
  },
  render: function () {
    requestAnimationFrame(this.render);

    let context = this.context;
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.3)";
    context.fillRect(0, 0, this.width, this.height);
    context.globalCompositeOperation = "lighter";

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].render(context)) {
        this.particles.splice(i, 1);
      }
    }
    context.restore();

    for (let i = this.butterflies.length - 1; i >= 0; i--) {
      if (!this.butterflies[i].render(context)) {
        this.butterflies.splice(i, 1);
      }
    }
    if (--this.count < 0) {
      this.count = this.getRandomValue(200, 500);
      this.butterflies.push(new BUTTERFLY(this));
    }
  },
};

let BUTTERFLY = function (renderer) {
  this.renderer = renderer;
  this.init();
};
BUTTERFLY.prototype = {
  DELTA_THETA: Math.PI / 50,
  DELTA_PHI: Math.PI / 100,
  THRESHOLD: 100,
  DELTA_PARTICLE: 1,

  init: function () {
    this.theta = 0;
    this.phi = 0;
    this.x = this.renderer.getRandomValue(
      this.THRESHOLD,
      this.renderer.width - this.THRESHOLD
    );
    this.y = this.renderer.height + this.THRESHOLD;
    this.vx = 0;
    this.vy = -2;
    this.swingRate = this.renderer.getRandomValue(0.5, 1);
  },
  createParticles: function () {
    for (let i = 0; i < this.DELTA_PARTICLE; i++) {
      this.renderer.particles.push(new PARTICLE(this.renderer, this.x, this.y));
    }
    return this.y >= -this.THRESHOLD;
  },
  render: function (context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(Math.atan2(this.vx, -this.vy) / 10);

    for (let i = -1; i <= 1; i += 2) {
      context.save();
      context.scale(i, 1);

      let gradient = context.createRadialGradient(0, 0, 0, 0, 0, 60),
        rate = Math.sin(this.theta / 4);
      gradient.addColorStop(0, "hsl(200, 100%, 40%)");
      gradient.addColorStop(0.3, "hsl(200, 100%, " + (40 + 10 * rate) + "%)");
      gradient.addColorStop(0.5, "hsl(200, 100%, " + (40 + 20 * rate) + "%)");
      gradient.addColorStop(1, "hsl(200, 100%, " + (40 + 30 * rate) + "%)");

      context.lineWidth = 2;
      context.strokeStyle = "hsl(200, 100%, 80%)";
      context.fillStyle = gradient;

      context.save();
      context.scale(0.6 + 0.2 * Math.cos(this.theta + Math.PI / 10), 0.8);
      context.beginPath();
      context.moveTo(-3, 0);
      context.bezierCurveTo(-30, -8, -45, 15, -22, 30);
      context.bezierCurveTo(-15, 38, -7, 40, -3, -5);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();

      context.save();
      context.scale(0.6 + 0.2 * Math.cos(this.theta), 0.8);
      context.beginPath();
      context.moveTo(-3, -5);
      context.bezierCurveTo(-20, -40, -50, -45, -45, -30);
      context.bezierCurveTo(-35, -8, -40, 5, -3, 0);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();

      context.lineWidth = 1.5;
      context.strokeStyle = "hsl(200, 100%, 80%)";
      context.beginPath();
      context.moveTo(-2, -8);
      context.bezierCurveTo(
        -5,
        -15,
        -3 - Math.sin(this.theta),
        -22,
        -8 - Math.sin(this.theta),
        -30
      );
      context.stroke();
      context.restore();
    }

    context.save();
    let gradient = context.createLinearGradient(-2, 0, 2, 0);
    gradient.addColorStop(0, "hsl(200, 100%, 70%)");
    gradient.addColorStop(0.5, "hsl(200, 100%, 80%)");
    gradient.addColorStop(1, "hsl(200, 100%, 70%)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, -8, 2.5, 0, Math.PI * 2, false);
    context.fill();
    context.beginPath();
    context.arc(0, -7, 2.5, 0, Math.PI, false);
    context.stroke();
    context.restore();
    context.restore();

    this.theta += this.DELTA_THETA;
    this.theta %= Math.PI * 4;
    this.phi += this.DELTA_PHI;
    this.phi %= Math.PI * 2;
    this.vx = Math.sin(this.phi) * this.swingRate;
    this.x += this.vx;
    this.y += this.vy;
    return this.createParticles();
  },
};

let PARTICLE = function (renderer, x, y) {
  this.renderer = renderer;
  this.x = x;
  this.y = y;
  this.init();
};
PARTICLE.prototype = {
  FRICTION: 0.99,
  RADIUS: 2,
  DELTA_OPACITY: 0.01,

  init: function () {
    this.x += this.renderer.getRandomValue(-50, 50);
    let theta = this.renderer.getRandomValue(0, Math.PI * 2);
    this.vx = Math.cos(theta);
    this.vy = Math.sin(theta);
    this.opacity = 1;
  },
  render: function (context) {
    context.save();
    context.translate(this.x, this.y);
    context.scale(2 - this.opacity, 2 - this.opacity);
    context.beginPath();
    context.fillStyle = "hsla(200, 100%, 70%, " + this.opacity + ")";
    context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.FRICTION;
    this.vy *= this.FRICTION;
    this.opacity = Math.max(0, this.opacity - this.DELTA_OPACITY);
    return this.opacity > 0;
  },
};

$(function () {
  RENDERER.init();
});


onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};
