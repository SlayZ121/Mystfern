class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionx = Math.random() * this.game.width;
    this.collisiony = Math.random() * this.game.height;
    this.collisionRadius = 40;
    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionx - this.width * 0.5;
    this.spriteY = this.collisiony - this.height * 0.5 - 70;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);
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
    }
  }

  update() {}
}
