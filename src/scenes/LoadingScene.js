// Import images
import splashScreen from '../../assets/splashScreen.png';
import dot_pattern from '../../assets/dot_pattern.png';
import car from '../../assets/car.png';
import enemy from '../../assets/enemy.png';
import fuel from '../../assets/fuel.png';
import caseImg from '../../assets/case.png';
import tree from '../../assets/tree.png';
import rock from '../../assets/rock.png';
import missile from '../../assets/missile.png';
import steel from '../../assets/steel.png';
import building from '../../assets/building.png';
import complete from '../../assets/complete.png';
import map from '../../assets/map.png';
import ukMap from '../../assets/ukMap.png';

// Import audio
import accelerate from '../../assets/audio/accelerate.mp3';
import braking from '../../assets/audio/braking.mp3';
import crash from '../../assets/audio/crash.mp3';
import idle from '../../assets/audio/idle.mp3';
import refuel from '../../assets/audio/refuel.mp3';
import topspeed from '../../assets/audio/topspeed.mp3';
import skid from '../../assets/audio/skid.mp3';

// Import spritesheets
import explosion from '../../assets/explosion.png';

class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene' });
  }

  preload() {
    // Load images
    this.load.image('splashScreen', splashScreen);
    this.load.image('dot_pattern', dot_pattern);
    this.load.image('car', car);
    this.load.image('enemy', enemy);
    this.load.image('fuel', fuel);
    this.load.image('case', caseImg);
    this.load.image('tree', tree);
    this.load.image('rock', rock);
    this.load.image('missile', missile);
    this.load.image('steel', steel);
    this.load.image('building', building);
    this.load.image('complete', complete);
    this.load.image('map', map);
    this.load.image('ukMap', ukMap);

    // Load audio
    this.load.audio('accelerate', accelerate);
    this.load.audio('braking', braking);
    this.load.audio('crash', crash);
    this.load.audio('idle', idle);
    this.load.audio('refuel', refuel);
    this.load.audio('topspeed', topspeed);
    this.load.audio('skid', skid);

    // Load spritesheets
    this.load.spritesheet('explosion', explosion, {
      frameWidth: 75,
      frameHeight: 49,
    });

    // Loading bar
    const progress = this.add.graphics();
    this.load.on('progress', (value) => {
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
  }
}

export { LoadingScene };
// class LoadingScene extends Phaser.Scene {
//   constructor() {
//     super({ key: "LoadingScene" });
//   }

//   preload() {
//     // Load all assets
//     [
//       //bg
//       "splashScreen",
//       "dot_pattern",
//       //players
//       "car",
//       "enemy",
//       //collectibles
//       "fuel",
//       "case",
//       //obstacles
//       "tree",
//       "rock",
//       "missile",
//       "steel",
//       "building",
//       "complete",
//       "map",
//       "ukMap"
//     ].forEach((asset) => {
//       this.load.image(asset, `assets/${asset}.png`);
//     });

//     //Add audio assets
//     const audioFiles = [
//       "accelerate",
//       "braking",
//       "crash",
//       "idle",
//       "refuel",
//       "topspeed",
//       "skid",
//     ];
//     audioFiles.forEach((audio) => {
//       this.load.audio(audio, `assets/audio/${audio}.mp3`);
//     });

//     //Add Sprtiesheet assets
//     const spriteSheets = ["explosion"];
//     spriteSheets.forEach((spriteSheet) => {
//       this.load.spritesheet(spriteSheet, `assets/${spriteSheet}.png`, {
//         frameWidth: 75,
//         frameHeight: 49,
//       });
//     });

//     // Loading bar
//     const progress = this.add.graphics();
//     this.load.on("progress", (value) => {
//       progress.clear();
//       progress.fillStyle(0xffffff, 1);
//       progress.fillRect(
//         0,
//         this.sys.game.config.height / 2,
//         this.sys.game.config.width * value,
//         60
//       );
//     });
//   }

//   create() {
//     this.scene.start("MenuScene");
//     // this.scene.start("GameScene");
//   }
// }
// export { LoadingScene };
