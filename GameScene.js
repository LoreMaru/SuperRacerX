import { PG } from './characters.js';
import { addTrackPiece, spawnThingsOverTime, fasterByTime, powerBarActivation } from './gameMechanics.js';

class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    } 
  
    init(dataFromSelection) {
      //Questo viene chiamato prima di preload()
      //Serve per portare i dati della selezione dalla scena precedente
      this.selectedID = dataFromSelection.selected;
    }

    preload(){
        this.load.image('life', './assets/life.png');
        this.load.image('power', './assets/avX.png');
        //andrebbe mofidicato per creare la linea di inizio
        this.load.image('ground', './assets/straightRoad.png');
        //
        this.character = PG.find(c => c.ID === this.selectedID);
        this.load.image('player', this.character.immagine);
        this.load.image('straight', './assets/straightRoad.png');     // pezzo rettilineo
        this.load.image('curve_left', './assets/leftRoad.png'); // curva a sinistra
        this.load.image('curve_right', './assets/rightRoad.png'); // curva a destra
        //per scelta nemici
        this.load.image('PG1', './assets/BuickerB.png');
        this.load.image('PG2', './assets/SuperB.png');
        this.load.image('PG3', './assets/GalardB.png');
        this.load.image('PG4', './assets/RamB.png');
        //
        this.load.spritesheet('ScudoX', './assets/effects/spriteX.png', { frameWidth: 32, frameHeight: 32 });
    }

    create(){

        //** Giocatore
        this.player = this.physics.add.image(400, 500, 'player');
        this.player.setCollideWorldBounds(true);
        //** Nemico
        this.enemies = this.physics.add.group();
        this.enemySpawnDelay = 10000; // in millisecondi (10 secondi)
        this.minimumSpawnDelay = 2000; // non andare sotto i 2 secondi
        spawnThingsOverTime(this, this.selectedID, this.player, this.enemySpawnDelay, this.minimumSpawnDelay); // avvia il ciclo
        //**animazione potere, unica per tutti
        this.anims.create({
            key: 'ScudoX',
            frames: this.anims.generateFrameNumbers('ScudoX', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
            });

            this.powerAnimation = this.add.sprite(this.player.x, this.player.y, 'ScudoX')
            .setOrigin(0.5)
            .setVisible(false)
            .setScale(1.5)

        //**gestione del percorso
        this.add.image(400, 300, 'ground').setDepth(-1); //sfondo statico iniziale, da sistemare come linea di partenza
        this.trackPieces = this.add.group(); // Gruppo che conterrà dinamicamente i pezzi della pista
        this.pieceHeight = 600; // Altezza in pixel di ogni segmento della pista
        this.scrollSpeed = 6; // Velocità base di scorrimento della pista (in pixel per frame)
        this.distanceSinceLastPiece = 0; // Accumulatore per sapere quando aggiungere un nuovo pezzo    
        for (let i = 0; i < 3; i++) { // Posizionamento dei primi 3 pezzi (tutti rettilinei), partendo da y = 0 verso l'alto
            addTrackPiece(this, 'straight', i * -this.pieceHeight);
        }

        //**gestione del timer**
        this.startTime = this.time.now; // tempo iniziale in millisecondi
        //formattazione testo timer
        this.timerText = this.add.text(550, 10, `Tempo: 0:000`, {
        fontFamily: 'Arial',
        fontSize: '25px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
        }).setDepth(1);
        //per incremento della velocità al passare del tempo
        this.lastHalfMinute = -1;


        //**gestione delle barre**
        this.life = this.add.image(40, 10, 'life').setOrigin(0, 0);
        this.life.setDepth(1).setScale(0.07);
        this.emptyLifeBar = this.add.rectangle(20, 10, 20, 200, 0x3E2020).setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
        this.emptyLifeBar.setDepth(0)
        this.lifeBar = this.add.rectangle(20, 10, 20, 200, 0xff0000).setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
        this.lifeBar.setDepth(1)

        this.power = this.add.image(755, 590, 'power').setOrigin(1, 1);
        this.power.setDepth(1);    
        this.emptyPowerBar = this.add.rectangle(780, 590, 20, 200, 0x196158).setOrigin(1, 1).setStrokeStyle(2, 0xffffff);
        this.emptyPowerBar.setDepth(0)
        this.powerBar = this.add.rectangle(780, 590, 20, 200, 0x80BA27).setOrigin(1, 1).setStrokeStyle(2, 0xffffff);
        this.powerBar.setDepth(1)    
      
      

        //**inizializzazione comandi
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);


    }

    update(time, delta){
        this.player.setVelocity(0);
        this.powerAnimation.x = this.player.x;
        this.powerAnimation.y = this.player.y;

        //**gestione comandi
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        }//tasto X per usare il power
        if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
            powerBarActivation(this, this.powerAnimation, 'ScudoX');   
        }//FINE gestione comandi, deve andare tutto dopo questo quando possibile
      
        //nemici
        this.enemies.getChildren().forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            if (enemy.isTracking) {
              this.physics.moveToObject(enemy, this.player, 100);
            }else{
                enemy.body.setVelocity(0, 100);
            }
          });

        //**gestione update percorso
        const dt = delta / 1000;                // delta in secondi
        const scrollMultiplier = dt * 60;       // normalizzazione a 60 fps
        // Imposta velocità visiva dello sfondo: rallenta se l’auto è fuori carreggiata
        let visualScrollSpeed = this.scrollSpeed;
        if (this.player.x < 100 || this.player.x > 600) {
        visualScrollSpeed = 4.9;
        }
        if (this.slowDownActive) {
        visualScrollSpeed = 2.5;
        }
        
        const adjustedSpeed = visualScrollSpeed * scrollMultiplier;//parte dell'aggiustamento per stabilizazione fps
        
        // Sposta ogni pezzo pista verso il basso (effetto movimento)
        this.trackPieces.getChildren().forEach(piece => {
        piece.y += adjustedSpeed;
        // Se il pezzo è completamente uscito dallo schermo, lo distruggiamo per liberare memoria
        if (piece.y > 1000) {
            piece.destroy();
        }
        });    
        // Aggiungiamo un nuovo pezzo quando si è raggiunta la distanza verticale necessaria
        this.distanceSinceLastPiece += this.scrollSpeed * scrollMultiplier;//parte dell'aggiustamento per stabilizazione fps
        if (this.distanceSinceLastPiece >= this.pieceHeight) {
        const types = ['straight', 'curve_left', 'curve_right'];          // tipi di pezzi disponibili
        const randomType = Phaser.Utils.Array.GetRandom(types);           // scegli uno casuale
        addTrackPiece(this, randomType, -this.pieceHeight);                // aggiungi in alto
        this.distanceSinceLastPiece = 0;                                  // resetta il contatore
        }

        //**Gestione Timer
        if (this.lifeBar && this.lifeBar.height > 0) {
            const elapsed = this.time.now - this.startTime; // tempo totale in ms
            const totalSeconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const secondsFormatted = seconds.toString().padStart(2, '0');
            const milliseconds = Math.floor(elapsed % 1000);
            // probabilmente andrà messo qui per la schermata di game over
            // if (this.lifeBar && this.lifeBar.height > 0) {
            this.timerText.setText(`Tempo: ${minutes}:${secondsFormatted}:${milliseconds}`);
    
            if (totalSeconds % 15 === 0 && this.lastHalfMinute !== totalSeconds) {
            //incrementa la velocità di 2 ogni minuto
            this.lastHalfMinute = totalSeconds;
            fasterByTime(this);
            console.log('velocità',this.scrollSpeed)
            }
        }else {
            //this.timer.remove();
            this.physics.pause();
            this.player.setTint(0xff0000); // effetto visivo
        
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOverScene', {
                    timeResult: this.timerText.text
                });
            });
        }
    }

}


export { GameScene };
