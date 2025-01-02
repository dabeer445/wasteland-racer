// class MovementManager {
//   constructor(player, gameState, scene) {
//     this.player = player;
//     this.gameState = gameState;
//     this.scene = scene;

//     // Initialize world offset
//     this.worldOffset = { x: 0, y: 0 };

//     // Center player immediately
//     this.player.setPosition(
//       this.scene.cameras.main.centerX,
//       this.scene.cameras.main.centerY
//     );

//     // Initial world position calculation
//     const initialWorldPos = this.screenToWorld(this.player.x, this.player.y);
//     this.scene.regionSystem?.update(initialWorldPos, this.worldOffset);

//     // Setup camera
//     this.scene.cameras.main.startFollow(this.player, true, 0.09, 0.09);
//   }

//   updateMovement(controls, maxSpeed) {
//     this.handleRotation(controls);
//     const newSpeed = this.calculateSpeed(controls, maxSpeed);
//     this.updateWorldPosition(newSpeed);
//   }

//   handleRotation(controls) {
//     if (controls.left.isDown) this.player.angle -= 3;
//     if (controls.right.isDown) this.player.angle += 3;
//   }

//   calculateSpeed(controls, maxSpeed) {
//     const currentSpeed = this.gameState.get("speed") || 0;
//     const acceleration = 0.15;
//     const deceleration = 0.13;

//     if (controls.accelerate.isDown && currentSpeed < maxSpeed) {
//       return Math.min(currentSpeed + acceleration, maxSpeed);
//     }
//     if (controls.brake.isDown && currentSpeed > 0) {
//       return Math.max(currentSpeed - 2 * deceleration, 0);
//     }
//     return Math.max(currentSpeed - deceleration, 0);
//   }

//   updateWorldPosition(newSpeed) {
//     this.gameState.update("speed", newSpeed);

//     if (newSpeed > 0) {
//       const rad = Phaser.Math.DegToRad(this.player.angle + 90);
//       const dx = Math.cos(rad) * newSpeed;
//       const dy = Math.sin(rad) * newSpeed;

//       // Check if next position would be in any region
//       const nextWorldPos = this.screenToWorld(this.player.x, this.player.y);
//       nextWorldPos.x += dx;
//       nextWorldPos.y += dy;

//       if (!this.isPositionInAnyRegion(nextWorldPos)) {
//         return;
//       }

//       // Update world offset
//       this.worldOffset.x += dx;
//       this.worldOffset.y += dy;

//       // Update region system with new player position
//       const playerWorldPos = this.screenToWorld(this.player.x, this.player.y);
//       this.scene.regionSystem?.update(playerWorldPos, this.worldOffset);

//       this.updateSceneElements(dx, dy);
//     }
//   }

//   updateSceneElements(dx, dy) {
//     // Update background
//     this.scene.background.tilePositionX += dx;
//     this.scene.background.tilePositionY += dy;

//     // Get all game objects
//     const gameObjects = [
//       ...(this.scene.collectibleSystem?.collectibles?.getChildren() || []),
//       ...(this.scene.obstacleSystem?.obstacles?.getChildren() || []),
//       ...(this.scene.enemySystem?.enemies?.getChildren() || []),
//       ...(this.scene.explosions?.getChildren() || []),
//     ];

//     // Update positions relative to world movement
//     gameObjects.forEach((obj) => {
//       if (obj && obj.x !== undefined && obj.y !== undefined) {
//         obj.x -= dx;
//         obj.y -= dy;
//       }
//     });
//   }

//   screenToWorld(screenX, screenY) {
//     return {
//       x: screenX + this.worldOffset.x,
//       y: screenY + this.worldOffset.y,
//     };
//   }

//   worldToScreen(worldX, worldY) {
//     return {
//       x: worldX - this.worldOffset.x,
//       y: worldY - this.worldOffset.y,
//     };
//   }

//   isPositionInAnyRegion(position) {
//     return this.scene.regionSystem.regions.some(
//       (region) =>
//         position.x >= region.regionX &&
//         position.x <= region.regionX + region.regionWidth &&
//         position.y >= region.regionY &&
//         position.y <= region.regionY + region.regionHeight
//     );
//   }
// }

// export { MovementManager };
class MovementManager {
  constructor(player, gameState, scene) {
    this.player = player;
    this.gameState = gameState;
    this.scene = scene;

    // Initialize world offset from spawn point
    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;

    // Ensure player is centered
    this.player.setPosition(centerX, centerY);

    // Initialize world offset
    this.worldOffset = { x: 0, y: 0 };

    // Initial world position calculation
    const initialWorldPos = this.screenToWorld(centerX, centerY);
    this.scene.regionSystem?.update(initialWorldPos, this.worldOffset);

    // Setup camera
    this.scene.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  updateMovement(controls, maxSpeed) {
    this.handleRotation(controls);
    const newSpeed = this.calculateSpeed(controls, maxSpeed);
    this.updateWorldPosition(newSpeed);
  }

  handleRotation(controls) {
    if (controls.left.isDown) this.player.angle -= 3;
    if (controls.right.isDown) this.player.angle += 3;
  }

  calculateSpeed(controls, maxSpeed) {
    const currentSpeed = this.gameState.get("speed") || 0;
    const acceleration = 0.15;
    const deceleration = 0.13;

    if (controls.accelerate.isDown && currentSpeed < maxSpeed) {
      return Math.min(currentSpeed + acceleration, maxSpeed);
    }
    if (controls.brake.isDown && currentSpeed > 0) {
      return Math.max(currentSpeed - 2 * deceleration, 0);
    }
    return Math.max(currentSpeed - deceleration, 0);
  }

  updateWorldPosition(newSpeed) {
    this.gameState.update("speed", newSpeed);

    if (newSpeed > 0) {
      const rad = Phaser.Math.DegToRad(this.player.angle + 90);
      const dx = Math.cos(rad) * newSpeed;
      const dy = Math.sin(rad) * newSpeed;

      // Check if next position would be in any region
      const nextWorldPos = this.screenToWorld(this.player.x, this.player.y);
      nextWorldPos.x += dx;
      nextWorldPos.y += dy;

      if (!this.isPositionInAnyRegion(nextWorldPos)) {
        return;
      }

      // Update world offset
      this.worldOffset.x += dx;
      this.worldOffset.y += dy;

      // Update region system with new player position
      const playerWorldPos = this.screenToWorld(this.player.x, this.player.y);
      this.scene.regionSystem?.update(playerWorldPos, this.worldOffset);

      this.updateSceneElements(dx, dy);
    }
  }

  // updateSceneElements(dx, dy) {
  //   // Update background
  //   this.scene.background.tilePositionX += dx;
  //   this.scene.background.tilePositionY += dy;

  //   // Get all game objects
  //   const gameObjects = [
  //     ...(this.scene.collectibleSystem?.collectibles?.getChildren() || []),
  //     ...(this.scene.obstacleSystem?.obstacles?.getChildren() || []),
  //     ...(this.scene.enemySystem?.enemies?.getChildren() || []),
  //     ...(this.scene.explosions?.getChildren() || []),
  //   ];

  //   // Update positions relative to world movement
  //   gameObjects.forEach((obj) => {
  //     if (obj && obj.x !== undefined && obj.y !== undefined) {
  //       obj.x -= dx;
  //       obj.y -= dy;
  //     }
  //   });
  // }
  updateSceneElements(dx, dy) {
    // Update background if it exists
    if (this.scene.background) {
      this.scene.background.tilePositionX += dx;
      this.scene.background.tilePositionY += dy;
    }

    // Get all game objects safely
    const gameObjects = [];
    
    try {
      if (this.scene.collectibleSystem?.collectibles) {
        gameObjects.push(...this.scene.collectibleSystem.collectibles.getChildren());
      }
      if (this.scene.obstacleSystem?.obstacles) {
        gameObjects.push(...this.scene.obstacleSystem.obstacles.getChildren());
      }
      if (this.scene.enemySystem?.enemies) {
        gameObjects.push(...this.scene.enemySystem.enemies.getChildren());
      }
      if (this.scene.explosions) {
        gameObjects.push(...this.scene.explosions.getChildren());
      }
    } catch (error) {
      console.warn('Some game objects not available during scene transition');
    }

    // Update positions relative to world movement
    gameObjects.forEach(obj => {
      if (obj && obj.x !== undefined && obj.y !== undefined) {
        obj.x -= dx;
        obj.y -= dy;
      }
    });
  }
  screenToWorld(screenX, screenY) {
    return {
      x: screenX + this.worldOffset.x,
      y: screenY + this.worldOffset.y,
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: worldX - this.worldOffset.x,
      y: worldY - this.worldOffset.y,
    };
  }

  isPositionInAnyRegion(position) {
    return this.scene.regionSystem.regions.some(
      (region) =>
        position.x >= region.regionX &&
        position.x <= region.regionX + region.regionWidth &&
        position.y >= region.regionY &&
        position.y <= region.regionY + region.regionHeight
    );
  }

  resetWorldOffset(newSpawnPoint) {
    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;

    // Reset player to center
    this.player.setPosition(centerX, centerY);

    // Calculate new world offset based on spawn point
    this.worldOffset = {
      x: newSpawnPoint.x - centerX,
      y: newSpawnPoint.y - centerY,
    };

    // Update scene elements to reflect new position
    this.updateSceneElements(-this.worldOffset.x, -this.worldOffset.y);

    // Update region system
    const initialWorldPos = this.screenToWorld(centerX, centerY);
    this.scene.regionSystem?.update(initialWorldPos, this.worldOffset);
  }
}

export { MovementManager };
