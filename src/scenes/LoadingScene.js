// Create loading scene for assets
class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    // Load all assets
    [
      //bg
      "dot_pattern",
      //players
      "car",
      "enemy",
      //collectibles      
      "fuel",
      "case",
      //obstacles      
      "tree",
      "rock",
      "missile",
      "steel",
      "building",
    ].forEach((asset) => {
      this.load.image(asset, `assets/${asset}.png`);
    });

    // Loading bar
    const progress = this.add.graphics();
    this.load.on("progress", (value) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60
      );
    });
  }

  create() {
    this.scene.start('MenuScene');
    // this.scene.start("GameScene");
  }
}
export { LoadingScene };
