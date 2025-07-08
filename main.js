import { StartScene } from './StartScene.js';
import { HowToScene } from './HowToScene.js'
import { SelectionScene } from './SelectionScene.js'
import { GameScene } from './GameScene.js'
import { GameOverScene } from './GameOverScene.js'
import { StyleSelectScene } from './StyleSelectScene.js'


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [StartScene, HowToScene, StyleSelectScene, SelectionScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
