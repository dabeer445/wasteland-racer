// Main game scene
import { PlayerSystem } from "../systems/PlayerSystem.js";
import { CollectibleSystem } from "../systems/CollectibleSystem.js";
import { ObstacleSystem } from "../systems/ObstacleSystem.js";
import { EnemySystem } from "../systems/EnemySystem.js";
import { BaseScene } from "./BaseScene.js";
import { GameState } from "../GameState.js";

class GameScene extends BaseScene {
  constructor() {
    super("GameScene");
    this.initializeGameState();
  }
  initializeGameState() {
    this.gameState = new GameState();
  }
  create() {
    // Set up physics world bounds properly
    this.physics.world.setBounds(0, 0, 2400, 2400);
    this.cameras.main.setBounds(0, 0, 2400, 2400);
    this.addBackground();
    // Initialize systems
    this.playerSystem = new PlayerSystem(this, this.gameState);
    this.collectibleSystem = new CollectibleSystem(this, this.gameState);
    this.obstacleSystem = new ObstacleSystem(this, this.gameState);
    this.enemySystem = new EnemySystem(this);

    // Setup collisions
    this.collectibleSystem.setupCollisions(this.playerSystem.player);
    this.obstacleSystem.setupCollisions(this.playerSystem.player);
    this.enemySystem.setupCollisions(this.playerSystem.player);

    // Spawn initial objects
    this.spawnItems(this.collectibleSystem);
    this.spawnItems(this.obstacleSystem);

    this.initializeUI();

    // Set up pause functionality

    ["SPACE", "ESC"].forEach((key) => {
      this.input.keyboard.on(`keydown-${key}`, () => {
        this.handlePause();
      });
    });

    // Listen for game state changes
    this.gameState.on("stateChange", (state) => {
      this.updateUI(state);
    });

    this.registerEvents();
  }
  registerEvents() {
    this.events.removeListener("gameOver");
    this.events.on("gameOver", () => {
      this.scene.start("GameOverScene");
    });

    this.events.removeListener("playerHit");
    this.events.on("playerHit", () => {
      // Reset speed
      this.gameState.update("speed", 0);
      this.cameras.main.shake(200, 0.01);

      const currentLives = this.gameState.get("lives");
      console.log("Current lives before hit:", currentLives); // Debug log
      this.gameState.update("lives", currentLives - 1);
      console.log("Lives after hit:", this.gameState.get("lives")); // Debug log
      if (this.gameState.get("lives") <= 0) {
        this.events.emit("gameOver");
      }
    });
  }

  addBackground() {
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.physics.world.bounds.width,
        this.physics.world.bounds.height,
        "dot_pattern"
      )
      .setOrigin(0, 0);
  }

  spawnItems(itemSystem) {
    for (const [type, config] of Object.entries(itemSystem.types)) {
      for (let i = 0; i < config.density; i++) {
        const position = this.getValidPosition();
        if (position) {
          itemSystem.spawn(type, position.x, position.y);
        }
      }
    }
  }

  getValidPosition(margin = 50, minDistance = 100) {
    const maxAttempts = 50;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const x = Phaser.Math.Between(
        margin,
        this.physics.world.bounds.width - margin
      );
      const y = Phaser.Math.Between(
        margin,
        this.physics.world.bounds.height - margin
      );

      // Check distance from player start position
      const distanceFromStart = Phaser.Math.Distance.Between(x, y, 400, 300);
      if (distanceFromStart > 200) {
        return { x, y };
      }
      attempts++;
    }
    return null;
  }

  update(time, delta) {
    if (!this.scene.isPaused()) {
      this.playerSystem.update();
      this.updateGameState(delta);
      this.enemySystem.update(time);
    }
  }

  handlePause() {
    if (this.scene.isPaused()) {
      this.scene.resume();
    } else {
      this.scene.pause();
      // Show pause menu
      this.scene.launch("PauseScene");
    }
  }

  updateGameState(delta) {
    const currentSpeed = Math.round(this.gameState.get("speed"));

    // Temperature
    const tempChangeRate = this.getTempChangeRate(currentSpeed);
    const currentTemp = this.gameState.get("temp");
    this.gameState.update(
      "temp",
      Phaser.Math.Clamp(currentTemp + (tempChangeRate * delta) / 1000, 50, 130)
    );

    // Fuel
    const fuelConsumptionRate = this.getFuelConsumptionRate(currentSpeed);
    const currentFuel = this.gameState.get("fuel");
    this.gameState.update(
      "fuel",
      Math.max(0, currentFuel - fuelConsumptionRate)
    );
  }

  getTempChangeRate(speed) {
    const rates = {
      0: -3,
      1: -1,
      2: -0.5,
      3: -0.2,
      4: 0.5,
      5: 0.6,
      6: 1.0,
      7: 1.2,
      8: 1.5,
      9: 1.6,
      10: 2.5,
    };
    return rates[speed] || 0;
  }

  getFuelConsumptionRate(speed) {
    const ratios = {
      0: 1 / 240,
      1: 1 / 120,
      2: 1 / 96,
      3: 1 / 90,
      4: 1 / 84,
      5: 1 / 72,
      6: 1 / 60,
      7: 1 / 54,
      8: 1 / 48,
      9: 1 / 42,
      10: 1 / 30,
    };
    return ratios[speed] || 0;
  }
}

export { GameScene };