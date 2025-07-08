import { sport, F1 } from './characters.js';

class SelectionScene extends Phaser.Scene {
    constructor() {
        super('SelectionScene');
    }

    init(dataFromSelection) {
        //Questo viene chiamato prima di preload()
        //Serve per portare i dati della selezione dalla scena precedente
        this.selectedCategory = dataFromSelection.selected;

        // Mappa nome stringa → array importato
        const categoryMap = {
        sport,
        F1
        };

        // Ottieni l’array corrispondente
        this.PG = categoryMap[this.selectedCategory];
    }

    preload(){
        this.load.image('PG1', './assets/BuickerB.png');
        this.load.image('PG2', './assets/SuperB.png');
        this.load.image('PG3', './assets/GalardB.png');
        this.load.image('PG4', './assets/RamB.png');
        this.load.image('PG1f', './assets/rosso3.png');
        this.load.image('PG2f', './assets/blu3.png');
        this.load.image('PG3f', './assets/verde3.png');
        this.load.image('PG4f', './assets/viola3.png');
        this.load.image('sky', './assets/sky.png');
    }

    create(){
        // Titolo
        this.add.text(400, 30, 'Seleziona un veicolo', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#302932'
            }).setOrigin(0.5);

        this.selectedCharacter = null;

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.image(400, 300, 'sky').setDepth(-1);

        const positions = [
            { x: centerX - 200, y: centerY - 100 },
            { x: centerX + 200, y: centerY - 100 },
            { x: centerX - 200, y: centerY + 100 },
            { x: centerX + 200, y: centerY + 100 }
          ];

        this.PG.forEach((char, index) => {
            const pos = positions[index];
            // Crea immagine cliccabile
            const img = this.add.image(pos.x, pos.y, char.ID)
            .setInteractive({ useHandCursor: true })

            img.on('pointerdown', () => {
                //Se c'era già un'immagine selezionata, resettiamo il suo stato
                if (this.selectedImage) {
                    this.tweens.killTweensOf(this.selectedImage);        // Ferma il tween precedente
                    this.selectedImage.setScale(1);                      // Riporta alla scala normale
                }
                //Salva la selezione attuale
                this.selectedCharacter = char.ID;
                this.selectedImage = img;            
                //Aggiungi effetto di pulsazione alla scala
                this.tweens.add({
                targets: img,
                scale: { from: 1, to: 1.1 },
                duration: 300,
                yoyo: true,
                repeat: -1
                });
            });
              
        });
        // Tasto start
        const startButton = this.add.rectangle(400, 480, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const startText = this.add.text(400, 480, 'START', {
        fontSize: '16px', fill: '#302932', fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        const categoryMap = { sport, F1 };

        // Avvia la scena successiva solo se un personaggio è stato selezionato
        startButton.on('pointerdown', () => {
            if (this.selectedCharacter) {
                this.scene.start('GameScene', { selected: this.selectedCharacter, PG: categoryMap[this.selectedCategory]});
                //console.log(this.selectedCharacter)
            } else {
                this.add.text(400, 400, 'Seleziona un personaggio!', {
                fontSize: '20px', fill: '#ff4444',
                }).setOrigin(0.5);
            }
        }); 

        // Tasto back
        const backButton = this.add.rectangle(400, 555, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const backText = this.add.text(400, 555, 'BACK', {
        fontSize: '16px', fill: '#302932', fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        backButton.on('pointerdown', () => {
                this.scene.start('StyleSelectScene', {});
        })

    }

    update(){

    }
}  


export { SelectionScene };