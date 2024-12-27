// Player management
class PlayerSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.controls = {};
    this.setupPlayer();
    this.setupControls();
  }

  setupPlayer() {
    this.player = this.scene.physics.add.sprite(400, 300, "car");
    this.player.setCollideWorldBounds(true);
    this.player.angle = 180;

    // Use Phaser's camera follow
    this.scene.cameras.main.startFollow(this.player, true);
    this.scene.cameras.main.setDeadzone(100, 100);
  }

  setupControls() {
    this.controls = this.scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.O,
      right: Phaser.Input.Keyboard.KeyCodes.P,
      accelerate: Phaser.Input.Keyboard.KeyCodes.Q,
      brake: Phaser.Input.Keyboard.KeyCodes.A,
    });

    ["O", "P"].forEach((key) => {
      this.scene.input.keyboard.on(`keyup-${key}`, () => {
        this.gameState.canRotate = true;
      });
    });
  }

  update() {
    this.handleMovement();
    this.updatePhysics();
  }

  handleMovement() {
    // Player movement logic
  }
  updatePhysics() {
    const currentSpeed = this.gameState.get("speed") || 0;
    const maxSpeed = 10;
    const acceleration = 0.2;
    const deceleration = 0.2;

    if (this.controls.left.isDown) {
      this.player.angle -= 3;
    }
    if (this.controls.right.isDown) {
      this.player.angle += 3;
    }

    let newSpeed = currentSpeed;
    if (this.controls.accelerate.isDown && currentSpeed < maxSpeed) {
      newSpeed = Math.min(currentSpeed + acceleration, maxSpeed);
    } else if (currentSpeed > 0) {
      newSpeed = Math.max(currentSpeed - deceleration, 0);
    }

    this.gameState.update("speed", newSpeed);

    if (newSpeed > 0) {
      const rad = Phaser.Math.DegToRad(this.player.angle + 90);
      const dx = Math.cos(rad) * newSpeed;
      const dy = Math.sin(rad) * newSpeed;
      this.scene.background.tilePositionX += dx;
      this.scene.background.tilePositionY += dy;

      [
        ...this.scene.collectibleSystem.collectibles.getChildren(),
        ...this.scene.obstacleSystem.obstacles.getChildren(),
        ...this.scene.enemySystem.enemies.getChildren(),
      ].forEach((obj) => {
        if (obj) {
          obj.x -= dx;
          obj.y -= dy;
        }
      });
    }
  }
}
export { PlayerSystem };
