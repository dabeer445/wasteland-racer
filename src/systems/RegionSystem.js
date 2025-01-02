import { regionPaths } from "../../regionPath.js";

function parseSVGPathToPolygon(path) {
  const polygons = [];
  let currentPolygon = [];
  let currentX = 0,
    currentY = 0;
  let startX = 0,
    startY = 0;
  const jumpThreshold = 50;

  const parts = path.trim().split(/(?=[mMlLhHvVcCsSqQtTaAzZ])/);

  parts.forEach((part) => {
    const command = part[0];
    const numbers = part
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    switch (command) {
      case "m":
      case "M": {
        const isRelative = command === "m";
        const [x, y] = numbers;

        if (Math.abs(x) > jumpThreshold || Math.abs(y) > jumpThreshold) {
          if (currentPolygon.length > 0) {
            polygons.push(currentPolygon);
            currentPolygon = [];
          }
        }

        if (isRelative) {
          currentX += x;
          currentY += y;
        } else {
          currentX = x;
          currentY = y;
        }

        startX = currentX;
        startY = currentY;
        currentPolygon.push([currentX, currentY]);

        for (let i = 2; i < numbers.length; i += 2) {
          currentX += numbers[i];
          currentY += numbers[i + 1];
          currentPolygon.push([currentX, currentY]);
        }
        break;
      }

      case "l":
      case "L": {
        const isRelative = command === "l";
        for (let i = 0; i < numbers.length; i += 2) {
          if (isRelative) {
            currentX += numbers[i];
            currentY += numbers[i + 1];
          } else {
            currentX = numbers[i];
            currentY = numbers[i + 1];
          }
          currentPolygon.push([currentX, currentY]);
        }
        break;
      }

      case "z":
      case "Z":
        if (currentPolygon.length > 0) {
          currentPolygon.push([startX, startY]);
          polygons.push(currentPolygon);
          currentPolygon = [];
        }
        break;
    }
  });

  if (currentPolygon.length > 0) {
    polygons.push(currentPolygon);
  }

  return polygons.reduce(
    (largest, current) => (current.length > largest.length ? current : largest),
    polygons[0]
  );
}
function getBoundingBox(polygon) {
  const xs = polygon.points.map((p) => p.x);
  const ys = polygon.points.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    centerX: Math.min(...xs) + (Math.max(...xs) - Math.min(...xs)) / 2,
    centerY: Math.min(...ys) + (Math.max(...ys) - Math.min(...ys)) / 2,
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}
class RegionSystem {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.regions = [];
    this.scale = 10;
    this.setupRegions();
    this.setupDebugGraphics();
    // this.worldBoundsPoly = this.createWorldBoundsPolygon();
  }

  createWorldBoundsPolygon() {
    // Combine all region points
    const allPoints = this.regions.flatMap((region) => region.polygon.points);

    // Get convex hull to create boundary
    return new Phaser.Geom.Polygon(
      Phaser.Geom.Polygon.GetConvexHull(allPoints)
    );
  }

  cleanup() {
    // Clean up debug graphics
    if (this.debugContainer) {
      this.debugContainer.destroy();
    }
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
    }
    this.debugTexts.forEach((text) => text.destroy());
    this.debugTexts = [];

    // Clean up regions
    this.regions.forEach((region) => region.destroy());
    this.regions = [];
  }

  setupRegions() {
    Object.entries(regionPaths).forEach(([name, details]) => {
      this.regions.push({
        name: details.name,
        polygon: new Phaser.Geom.Polygon(
          parseSVGPathToPolygon(details.path).map(([x, y]) => ({
            x: x * this.scale,
            y: y * this.scale,
          }))
        ),
        color: details.color,
      });
    });
  }

  setupDebugGraphics() {
    this.debugContainer = this.scene.add.container(0, 0);
    this.debugContainer.setDepth(1);
    this.debugGraphics = this.scene.add.graphics();
    this.debugContainer.add(this.debugGraphics);
    this.debugTexts = [];
    this.drawRegions();
  }

  drawRegions() {
    this.debugGraphics.clear();
    this.debugTexts.forEach((text) => text.destroy());
    this.debugTexts = [];

    // this.regions.forEach((region) => {
    //   this.debugGraphics.lineStyle(4, region.color || 0xff0000);
    //   this.debugGraphics.strokePoints(region.polygon.points, true);

    //   const bounds = getBoundingBox(region.polygon);
    //   const text = this.scene.add.text(
    //     bounds.centerX,
    //     bounds.centerY,
    //     region.name,
    //     {
    //       font: "16px Arial",
    //       fill: "#ff0000",
    //     }
    //   );

    //   this.debugContainer.add(text);
    //   this.debugTexts.push(text);
    // });


    this.regions.forEach(region => {
      this.debugGraphics.lineStyle(2, region.color || 0xff0000);
      this.debugGraphics.fillStyle(region.color || 0xff0000, 0.5); // 0.2 is alpha/opacity
      this.debugGraphics.beginPath();
      this.debugGraphics.moveTo(region.polygon.points[0].x, region.polygon.points[0].y);
      region.polygon.points.forEach(point => {
        this.debugGraphics.lineTo(point.x, point.y);
      });
      this.debugGraphics.closePath();
      this.debugGraphics.fillPath();
      this.debugGraphics.strokePath();

      const bounds = getBoundingBox(region.polygon);
      const text = this.scene.add.text(
        bounds.centerX,
        bounds.centerY,
        region.name,
        {
          font: "16px Arial",
          fill: "#ff0000",
        }
      );

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

  getRandomSpawnPoint() {
    const region = Phaser.Utils.Array.GetRandom(this.regions);
    const bounds = getBoundingBox(region.polygon);
    let point;

    do {
      point = {
        x: Phaser.Math.Between(bounds.left, bounds.right),
        y: Phaser.Math.Between(bounds.top, bounds.bottom),
      };
    } while (!Phaser.Geom.Polygon.Contains(region.polygon, point.x, point.y));

    return point;
  }

  isInRegion(position, region) {
    return Phaser.Geom.Polygon.Contains(region.polygon, position.x, position.y);
  }
}

export { RegionSystem };
