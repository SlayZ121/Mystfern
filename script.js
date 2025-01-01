window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "40px Bangers";
  ctx.textAlign = "center";

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
    restart() {
      this.collisionx = this.game.width * 0.5;
      this.collisiony = this.game.height * 0.5;

      this.spriteX = this.collisionx - this.width * 0.5;
      this.spriteY = this.collisiony - this.height * 0.5 - 100;
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
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, obstacle);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionx = obstacle.collisionx + (sumOfRadii + 1) * unit_x;
          this.collisiony = obstacle.collisiony + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

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

  class Egg {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;
      this.collisionx =
        this.margin + Math.random() * (this.game.width - this.margin * 2);
      this.collisiony =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin - this.margin);

      this.image = document.getElementById("egg");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.hatchTimer = 0;
      this.hatchInterval = Math.random() * 10000 + 3000; //different eggs different hatch interval
      this.markedForDeletion = false;
    }
    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
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
        const displayTimer = (this.hatchTimer * 0.001).toFixed(0) + "s";

        context.fillText(
          displayTimer,
          this.collisionx,
          this.collisiony - this.collisionRadius * 3
        );
      }
    }
    update(deltaTime) {
      this.spriteX = this.collisionx - this.width * 0.5;
      this.spriteY = this.collisiony - this.height * 0.5 - 30;
      //collision
      let collisionObject = [
        this.game.player,
        ...this.game.obstacles,
        ...this.game.enemies,
        ...this.game.hatchlings,
      ];
      collisionObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionx = object.collisionx + (sumOfRadii + 1) * unit_x;
          this.collisiony = object.collisiony + (sumOfRadii + 1) * unit_y;
        }
      });

      //boundaries
      if (this.collisionx - this.collisionRadius < 0)
        this.collisionx = this.collisionRadius;
      if (this.collisionx + this.collisionRadius > this.game.width)
        this.collisionx = this.game.width - this.collisionRadius;

      if (this.collisiony + this.collisionRadius > this.game.height)
        this.collisiony = this.game.height - this.collisionRadius;

      //egg hatching

      if (
        this.hatchTimer > this.hatchInterval ||
        this.collisiony < this.game.topMargin
      ) {
        this.game.hatchlings.push(
          new Larva(this.game, this.collisionx, this.collisiony)
        );
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      } else {
        this.hatchTimer += deltaTime;
      }
    }
  }

  class Larva {
    constructor(game, x, y) {
      this.game = game;
      this.collisionx = x;
      this.collisiony = y;
      this.collisionRadius = 30;
      this.image = document.getElementById("larva");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = 1 + Math.random();

      this.markedForDeletion = false;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 2);
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteWidth,
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
    update() {
      this.collisiony -= this.speedY;
      this.spriteX = this.collisionx - this.width * 0.5;
      this.spriteY = this.collisiony - this.height * 0.5 - 50;

      //check for safety
      if (this.collisiony < this.game.topMargin) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();

        if (!this.game.gameOver) this.game.score++;
        for (let i = 0; i < 3; i++) {
          this.game.particles.push(
            new Firefly(this.game, this.collisionx, this.collisiony, "yellow")
          );
        }
      }

      //collision with gameObjects
      let collisionObject = [
        this.game.player,
        ...this.game.obstacles,
        ...this.game.eggs,
      ];
      collisionObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionx = object.collisionx + (sumOfRadii + 1) * unit_x;
          this.collisiony = object.collisiony + (sumOfRadii + 1) * unit_y;
        }
      });

      //collision with enemies
      this.game.enemies.forEach((enemy) => {
        if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver) {
          this.markedForDeletion = true;
          this.game.removeGameObjects();
          this.game.lostHatchlings++;
          for (let i = 0; i < 4; i++) {
            this.game.particles.push(
              new Spark(this.game, this.collisionx, this.collisiony, "blue")
            );
          }
        }
      });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.speedx = Math.random() * 3 + 0.5;
      this.image = document.getElementById("toads");
      this.spriteWidth = 140;
      this.spriteHeight = 260;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionx =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisiony =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 4);
    }
    draw(context) {
      context.drawImage(
        this.image,
        0,
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
    update() {
      this.spriteX = this.collisionx - this.width * 0.5;
      this.spriteY = this.collisiony - this.height + 40;
      this.collisionx -= this.speedx;
      if (this.spriteX + this.width < 0 && !this.game.gameOver) {
        this.collisionx =
          this.game.width + this.width + Math.random() * this.game.width * 0.5;
        this.collisiony =
          this.game.topMargin +
          Math.random() * (this.game.height - this.game.topMargin);

        this.frameY = Math.floor(Math.random() * 4);
      }
      let collisionObject = [this.game.player, ...this.game.obstacles];
      collisionObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionx = object.collisionx + (sumOfRadii + 1) * unit_x;
          this.collisiony = object.collisiony + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Particle {
    constructor(game, x, y, color) {
      this.game = game;
      this.collisionx = x;
      this.collisiony = y;
      this.color = color;
      this.radius = Math.floor(Math.random() * 10 + 3);
      this.speedx = Math.random() * 6 - 3;
      this.speedy = Math.random() * 2 + 0.5;
      this.angle = 0;
      this.va = Math.random() * 0.1 + 0.01;
      this.markedForDeletion = false;
    }

    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(
        this.collisionx,
        this.collisiony,
        this.radius,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
    }
  }
  class Firefly extends Particle {
    update() {
      this.angle += this.va;
      this.collisionx += Math.cos(this.angle) * this.speedx;
      this.collisiony -= this.speedy;
      if (this.collisiony < 0 - this.radius) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }

  class Spark extends Particle {
    update() {
      this.angle += this.va * 0.5;
      this.collisionx -= Math.cos(this.angle) * this.speedx;
      this.collisiony -= Math.sin(this.angle) * this.speedy;
      if (this.radius > 0.1) this.radius -= 0.05;
      if (this.radius < 0.2) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.debug = false;
      this.player = new Player(this);
      this.fps = 60;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.eggTimer = 0;
      this.eggInterval = 5000;
      this.numOfObstacles = 10;
      this.maxEggs = 5;
      this.obstacles = [];
      this.eggs = [];
      this.enemies = [];
      this.hatchlings = [];
      this.particles = [];
      this.gameObjects = [];
      this.score = 0;
      this.winningScore = 30;
      this.gameOver = false;
      this.lostHatchlings = 0;
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };

      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
      window.addEventListener("keydown", (e) => {
        if (e.key == "d") this.debug = !this.debug;
        else if (e.key == "r") this.restart();
      });
    }

    render(context, deltaTime) {
      if (this.timer > this.interval) {
        ctx.clearRect(0, 0, this.width, this.height);
        this.gameObjects = [
          ...this.eggs,
          ...this.obstacles,
          this.player,
          ...this.enemies,
          ...this.hatchlings,
          ...this.particles,
        ];
        //sort by vertical position to provide 3-D illusion
        this.gameObjects.sort((a, b) => {
          return a.collisiony - b.collisiony;
        });
        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update(deltaTime);
        });

        this.timer = 0;
      }
      this.timer += deltaTime;

      //add eggs periodically
      if (
        this.eggTimer > this.eggInterval &&
        this.eggs.length < this.maxEggs &&
        !this.gameOver
      ) {
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += deltaTime;
      }

      //draw status text
      context.save();
      context.textAlign = "left";
      context.fillText("Score: " + this.score, 25, 50);
      if (this.debug) {
        context.fillText("Lost: " + this.lostHatchlings, 25, 100);
      }
      context.restore();

      //winning and losing message
      if (this.score >= this.winningScore) {
        this.gameOver = true;
        context.save();
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "white";
        context.textAlign = "center";
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowColor = "black";
        let message1;
        let message2;
        if (this.lostHatchlings <= 5) {
          //win
          message1 = "You Won!!!";
          message2 = "Congratulations! You've conquered the challenge.";
        } else {
          //lose
          message1 = "Game Over!!!";
          message2 = "You lost " + this.lostHatchlings + " hatchlings";
        }
        context.font = "130px Bangers";
        context.fillText(message1, this.width * 0.5, this.height * 0.5 - 20);
        context.font = "40px Bangers";
        context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
        context.fillText(
          "Final Score " + this.score + ". Press 'R' to respawn.",
          this.width * 0.5,
          this.height * 0.5 + 80
        );

        context.restore();
      }
    }
    checkCollision(a, b) {
      const dx = a.collisionx - b.collisionx;
      const dy = a.collisiony - b.collisiony;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    }

    addEgg() {
      this.eggs.push(new Egg(this));
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    removeGameObjects() {
      this.eggs = this.eggs.filter((object) => !object.markedForDeletion);
      this.hatchlings = this.hatchlings.filter(
        (object) => !object.markedForDeletion
      );
      this.particles = this.particles.filter(
        (object) => !object.markedForDeletion
      );
    }

    restart() {
      this.player.restart();
      this.obstacles = [];
      this.eggs = [];
      this.enemies = [];
      this.hatchlings = [];
      this.particles = [];
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };
      this.score = 0;
      this.lostHatchlings = 0;
      this.gameOver = false;
      this.init();
    }

    init() {
      for (let i = 0; i < 5; i++) {
        this.addEnemy();
      }
      let attempts = 0;
      while (this.obstacles.length < this.numOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach((obstacle) => {
          const dx = testObstacle.collisionx - obstacle.collisionx;
          const dy = testObstacle.collisiony - obstacle.collisiony;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 100;
          const sumOfRadii =
            testObstacle.collisionRadius +
            obstacle.collisionRadius +
            distanceBuffer;
          if (distance < sumOfRadii) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 3;
        if (
          !overlap &&
          testObstacle.spriteX > 0 &&
          testObstacle.spriteX < this.width - testObstacle.width &&
          testObstacle.collisiony > this.topMargin + margin &&
          testObstacle.collisiony < this.height - margin
        ) {
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  game.init();
  console.log(game);

  lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);

    requestAnimationFrame(animate);
  }
  animate(0);
});
