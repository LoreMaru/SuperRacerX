import { StartScene } from './StartScene.js';
import { HowToScene } from './HowToScene.js'
import { SelectionScene } from './SelectionScene.js'
import { GameScene } from './GameScene.js'
import { GameOverScene } from './GameOverScene.js'


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: true }
  },
  scene: [StartScene, HowToScene, SelectionScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);