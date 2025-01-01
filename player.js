class Player {
  constructor(game) {
    this.game = game;
    this.collisionx = this.game.width * 0.5;
    this.collisiony = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.speedx = 0;
    this.speedy = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedMod = 5;
    this.spriteWidth = 255;
    this.spriteHeight = 256;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.frameX = 0;
    this.frameY = 5;
    this.image = document.getElementById("bull");
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionx,
        this.collisiony,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionx, this.collisiony);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }
  update() {
    //sprite animation
    this.dx = this.game.mouse.x - this.collisionx;
    this.dy = this.game.mouse.y - this.collisiony;
    const angle = Math.atan2(this.dy, this.dx);
    if (angle < -2.74 || angle > 2.74) this.frameY = 6;
    else if (angle < -1.96) this.frameY = 7;
    else if (angle < -1.17) this.frameY = 0;
    else if (angle < -0.39) this.frameY = 1;
    else if (angle < 0.39) this.frameY = 2;
    else if (angle < 1.17) this.frameY = 3;
    else if (angle < 1.96) this.frameY = 4;
    else if (angle < 2.74) this.frameY = 5;

    this.dx = this.game.mouse.x - this.collisionx;
    this.dy = this.game.mouse.y - this.collisiony;
    const distance = Math.hypot(this.dy, this.dx);
    if (distance > this.speedMod) {
      this.speedx = this.dx / distance || 0;
      this.speedy = this.dy / distance || 0;
    } else {
      this.speedx = 0;
      this.speedy = 0;
    }

    this.collisionx += this.speedx * this.speedMod;
    this.collisiony += this.speedy * this.speedMod;
    this.spriteX = this.collisionx - this.width * 0.5;
    this.spriteY = this.collisiony - this.height * 0.5 - 100;

    //horizontal obstacles
    if (this.collisionx < this.collisionRadius)
      this.collisionx = this.collisionRadius;
    else if (this.collisionx > this.game.width - this.collisionRadius)
      this.collisionx = this.game.width - this.collisionRadius;

    //vertical boundaries
    if (this.collisiony < this.game.topMargin + this.collisionRadius)
      this.collisiony = this.game.topMargin + this.collisionRadius;
    else if (this.collisiony > this.game.height - this.collisionRadius)
      this.collisiony = this.game.height - this.collisionRadius;

    //collision with obstacles
    this.game.obstacles.forEach((obstacle) => {
      //[distance < sumOfRadii, distance, sumOfRadii, dx, dy]
      //destructuring them
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(
        this,
        obstacle
      );

      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionx = obstacle.collisionx + (sumOfRadii + 1) * unit_x;
        this.collisiony = obstacle.collisiony + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}
