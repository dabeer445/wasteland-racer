import { GameState } from "../GameState.js";
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;
    const gameState = new GameState();

    this.add
      .text(width / 2, height / 3, "Wasteland Racer", {
        fontSize: "64px",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(width / 2, height / 2, "Start Game", {
        fontSize: "32px",
      })
      .setOrigin(0.5)
      .setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene", { gameState });
    });
  }
}
export { MenuScene };
