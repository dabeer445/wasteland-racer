class MovementManager {
  constructor(player, gameState, scene) {
    this.player = player;
    this.gameState = gameState;
    this.scene = scene;
  }

  updateMovement(controls, maxSpeed) {
    this.handleRotation(controls);
    const newSpeed = this.calculateSpeed(controls, maxSpeed);
    this.updatePosition(newSpeed);
  }

  handleRotation(controls) {
    if (controls.left.isDown) this.player.angle -= 3;
    if (controls.right.isDown) this.player.angle += 3;
  }

  calculateSpeed(controls, maxSpeed) {
    const currentSpeed = this.gameState.get("speed") || 0;
    const acceleration = 0.15;
    const deceleration = 0.13;

    if (controls.accelerate.isDown && currentSpeed < maxSpeed) {
      return Math.min(currentSpeed + acceleration, maxSpeed);
    }
    if (controls.deceleration.isDown && currentSpeed > 0) {
      return Math.max(currentSpeed - 2 * deceleration, 0);
    }
    return Math.max(currentSpeed - deceleration, 0);
  }

  updatePosition(newSpeed) {
    this.gameState.update("speed", newSpeed);
    if (newSpeed > 0) {
      const rad = Phaser.Math.DegToRad(this.player.angle + 90);
      const dx = Math.cos(rad) * newSpeed;
      const dy = Math.sin(rad) * newSpeed;

      this.updateSceneElements(dx, dy);
    }
  }

  updateSceneElements(dx, dy) {
    this.scene.background.tilePositionX += dx;
    this.scene.background.tilePositionY += dy;
    const sceneObjects = [
      ...this.scene.collectibleSystem.collectibles.getChildren(),
      ...this.scene.obstacleSystem.obstacles.getChildren(),
      ...this.scene.enemySystem.enemies.getChildren(),
      ...this.scene.explosions.getChildren(),
    ];

    sceneObjects.forEach((obj) => {
      if (obj) {
        obj.x -= dx;
        obj.y -= dy;
      }
    });
  }
}

export { MovementManager };
