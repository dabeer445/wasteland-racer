// Create new GameOverScene.js
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setScrollFactor(0);

    this.add
      .text(width / 2, height / 3, "GAME OVER", {
        fontSize: "64px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(width / 2, height / 2, "Restart Game", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      const gameScene = this.scene.get("GameScene");
      gameScene.gameState.reset();
      this.scene.stop("GameScene");
      this.scene.stop('GameOverScene');
      this.scene.start("GameScene");

    });
  }
}

export { GameOverScene };
