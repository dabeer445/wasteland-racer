class RegionSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.regions = [];
    this.setupRegions();
    this.setupDebugGraphics();
  }

  setupRegions() {
    const regions = [
      { name: "Wasteland Alpha", x: 0, y: 0, width: 400, height: 600 },
      { name: "Ruins Beta", x: 400, y: 0, width: 400, height: 600 },
      { name: "Dead Zone Charlie", x: 800, y: 0, width: 400, height: 1200 },
      { name: "Danger Delta", x: 1200, y: 0, width: 400, height: 1200 },
      { name: "Echo Valley", x: 0, y: 600, width: 400, height: 600 },
      { name: "Forgotten Foxtrot", x: 400, y: 600, width: 400, height: 600 },
      { name: "Ghost Gulf", x: 0, y: 1200, width: 800, height: 600 },
      { name: "Hunter's Haven", x: 800, y: 1200, width: 400, height: 1200 },
      { name: "Inferno Isle", x: 1200, y: 1200, width: 400, height: 1200 },
      { name: "Junkyard Junction", x: 0, y: 1800, width: 400, height: 600 },
      { name: "Killer Keep", x: 400, y: 1800, width: 400, height: 600 },
    ];

    regions.forEach((region) => {
      const zone = this.scene.add.zone(
        region.x + region.width / 2,
        region.y + region.height / 2,
        region.width,
        region.height
      );

      zone.regionX = region.x;
      zone.regionY = region.y;
      zone.regionWidth = region.width;
      zone.regionHeight = region.height;
      zone.name = region.name;
      this.regions.push(zone);
    });
  }

  setupDebugGraphics() {
    this.debugContainer = this.scene.add.container(0, 0);
    this.debugGraphics = this.scene.add.graphics();
    this.debugContainer.add(this.debugGraphics);
    this.debugTexts = [];

    this.drawRegions();
  }

  drawRegions() {
    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(2, 0xff0000);

    this.debugTexts.forEach((text) => text.destroy());
    this.debugTexts = [];

    this.regions.forEach((region) => {
      this.debugGraphics.strokeRect(
        region.regionX,
        region.regionY,
        region.regionWidth,
        region.regionHeight
      );

      const text = this.scene.add
        .text(
          region.regionX + region.regionWidth / 2,
          region.regionY + region.regionHeight / 2,
          region.name,
          {
            font: "16px Arial",
            fill: "#ff0000",
          }
        )
        .setOrigin(0.5);

      this.debugContainer.add(text);
      this.debugTexts.push(text);
    });
  }

  update(playerWorldPos, worldOffset) {
    if (worldOffset) {
      this.debugContainer.setPosition(-worldOffset.x, -worldOffset.y);
    }

    for (const region of this.regions) {
      if (this.isInRegion(playerWorldPos, region)) {
        if (this.gameState.get("currentRegion") !== region.name) {
          this.gameState.update("currentRegion", region.name);
        }
        return;
      }
    }
    this.gameState.update("currentRegion", "Unknown");
  }

  isInRegion(position, region) {
    return (
      position.x >= region.regionX &&
      position.x <= region.regionX + region.regionWidth &&
      position.y >= region.regionY &&
      position.y <= region.regionY + region.regionHeight
    );
  }

  getRandomSpawnPoint() {
    const randomRegion = Phaser.Utils.Array.GetRandom(this.regions);
    return {
      x: Phaser.Math.Between(
        randomRegion.regionX + 50,
        randomRegion.regionX + randomRegion.regionWidth - 50
      ),
      y: Phaser.Math.Between(
        randomRegion.regionY + 50,
        randomRegion.regionY + randomRegion.regionHeight - 50
      ),
    };
  }
}

export { RegionSystem };
