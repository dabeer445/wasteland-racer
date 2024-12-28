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
  handleCollision(player, obstacle) {
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
    const collisionPoint = {
      x: (player.x + obstacle.x) / 2,
      y: (player.y + obstacle.y) / 2,
    };

    this.scene.events.emit("playerHit", collisionPoint);
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
