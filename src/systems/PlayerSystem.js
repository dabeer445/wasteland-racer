// Player management
import { SoundManager } from "../managers/SoundManager.js";
import { MovementManager } from "../managers/MovementManager.js";
class PlayerSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.controls = {};
    this.setupPlayer();
    this.setupControls();
    this.soundManager = new SoundManager(scene.sounds);
    this.movementManager = new MovementManager(this.player, gameState, scene);
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
    const currentSpeed = this.gameState.get("speed") || 0;
    const maxSpeed = 10;

    this.soundManager.playEngineSound(currentSpeed, maxSpeed, this.controls);
    this.movementManager.updateMovement(this.controls,maxSpeed);
  }
}
export { PlayerSystem };
