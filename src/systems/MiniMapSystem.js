class MinimapSystem {
  constructor(scene, movementManager, boundingBox) {
    this.scene = scene;
    this.movementManager = movementManager;
    this.dot = document.querySelector(".map > .dot");
    this.regionScale = 25;
    this.scaleX = 200 / boundingBox.width;
    this.scaleY = 250 / boundingBox.height;
    this.XOffset = boundingBox.x
    this.YOffset = boundingBox.y
  }

  update() {
    const worldPoint = this.movementManager.screenToWorld(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );
    this.dot.style.left = `${(worldPoint.x - this.XOffset) * this.scaleX}px`;
    this.dot.style.top = `${(worldPoint.y - this.YOffset) * this.scaleY + 4}px`;
  }
}
export { MinimapSystem };
