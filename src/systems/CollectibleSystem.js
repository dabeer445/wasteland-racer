// Collectible base class
class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, config) {
    super(scene, x, y, type);
    this.type = type;
    this.config = config;

    this.setScale(config.scale);
  }

  collect() {
    this.emit("collected", this);
    this.config.onCollect();
    if (this.type == "case") {
      this.destroy();
    }
  }
}

class CollectibleSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.collectibles = scene.physics.add.group();

    this.types = {
      fuel: {
        sprite: "fuel",
        scale: 0.75,
        density: 15,
        onCollect: () => {
          this.gameState.update(
            "fuel",
            Math.min(100, this.gameState.get("fuel") + 25)
          );
          if (!this.scene.sounds.refuel.isPlaying) {
            this.scene.sounds.refuel.play();
          }
          this.gameState.update("score", this.gameState.get("score") + 10);
        },
      },
      case: {
        sprite: "case",
        scale: 1,
        density: 15,
        onCollect: () => {
          this.gameState.update(
            "casesCollected",
            this.gameState.get("casesCollected") + 1
          );
        },
      },
    };
  }

  spawn(type, x, y) {
    const config = this.types[type];
    const collectible = new Collectible(this.scene, x, y, type, config);
    this.scene.add.existing(collectible); // Add this line
    this.collectibles.add(collectible);

    return collectible;
  }

  handleCollision(player, collectible) {
    collectible.collect();
  }

  setupCollisions(player) {
    this.scene.physics.add.overlap(
      player,
      this.collectibles,
      this.handleCollision,
      null,
      this
    );
  }
}
export { CollectibleSystem };
