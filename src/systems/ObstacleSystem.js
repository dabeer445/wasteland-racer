// Obstacle system
class ObstacleSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.obstacles = scene.physics.add.group();

    this.types = {
      tree: { sprite: "tree", scale: 1, damage: 25, density: 10 },
      rock: { sprite: "rock", scale: 1, damage: 35, density: 10 },
      missile: { sprite: "missile", scale: 1, damage: 50, density: 10 },
      steel: { sprite: "steel", scale: 1, damage: 50, density: 10 },
      building: { sprite: "building", scale: 1, damage: 50, density: 10 },
    };
  }

  spawn(type, x, y) {
    const config = this.types[type];
    const obstacle = this.obstacles
      .create(x, y, config.sprite)
      .setScale(config.scale)
      .setImmovable(true);
    obstacle.damage = config.damage;
    return obstacle;
  }

  //   handleCollision(player, obstacle) {
  //     const speed = this.gameState.get("speed");
  //     const damage = obstacle.damage * (speed / 10); // Scale damage with speed

  //     this.gameState.update("lives", this.gameState.get("lives") - 1);
  //     this.scene.cameras.main.shake(200, 0.01);

  //     // Knockback effect
  //     const angle = Phaser.Math.Angle.Between(
  //       obstacle.x,
  //       obstacle.y,
  //       player.x,
  //       player.y
  //     );
  //     player.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);

  //     if (this.gameState.get("lives") <= 0) {
  //       this.scene.events.emit("gameOver");
  //     }
  //   }

  handleCollision(player, obstacle) {
    this.scene.events.emit("playerHit");

    // Move all objects in scene AWAY from obstacle
    const angle = Phaser.Math.Angle.Between(
      obstacle.x,
      obstacle.y,
      player.x,
      player.y
    );
    const pushDistance = -150;

    const allObjects = [
      ...this.obstacles.getChildren(),
      ...this.scene.collectibleSystem.collectibles.getChildren(),
    ];

    allObjects.forEach((obj) => {
      obj.x += Math.cos(angle) * pushDistance;
      obj.y += Math.sin(angle) * pushDistance;
    });

  }

  setupCollisions(player) {
    this.scene.physics.add.collider(
      player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    );
  }
}
export { ObstacleSystem };
