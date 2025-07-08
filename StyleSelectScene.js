
class StyleSelectScene extends Phaser.Scene {
    constructor() {
        super('StyleSelectScene');
    }

    preload(){
        this.load.image('sport', './assets/SuperB.png');
        this.load.image('F1', './assets/rosso3.png');
        this.load.image('sky', './assets/sky.png');
    }

    create(){
        // Titolo
        this.add.text(400, 30, 'Seleziona una categoria', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#302932'
            }).setOrigin(0.5);

        this.selectedCategory = null;

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.image(400, 300, 'sky').setDepth(-1);

        const positions = [
            { x: centerX - 200, y: centerY - 100 },
            { x: centerX + 200, y: centerY - 100 },
            { x: centerX - 200, y: centerY + 100 },
            { x: centerX + 200, y: centerY + 100 }
          ];

        const PG = [ 
            {ID: 'sport', name: 'S', immagine: './assets/SuperB.png'},
            {ID: 'F1', name: 'F', immagine: './assets/rosso.png'},
        ]

        PG.forEach((char, index) => {
            const pos = positions[index];
            // Crea immagine cliccabile
            const img = this.add.image(pos.x, pos.y, char.ID)
            .setInteractive({ useHandCursor: true })

            //Testo descrittivo
            /*const label = this.add.text(pos.x, pos.y + 70, char.ID, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#302932'
            }).setOrigin(0.5);*/

            img.on('pointerdown', () => {
                //Se c'era già un'immagine selezionata, resettiamo il suo stato
                if (this.selectedImage) {
                    this.tweens.killTweensOf(this.selectedImage);        // Ferma il tween precedente
                    this.selectedImage.setScale(1);                      // Riporta alla scala normale
                }
                //Salva la selezione attuale
                this.selectedCategory = char.ID;
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

        const startText = this.add.text(400, 480, 'VAI', {
        fontSize: '16px', fill: '#302932', fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        // Avvia la scena successiva solo se un personaggio è stato selezionato
        startButton.on('pointerdown', () => {
            if (this.selectedCategory) {
                this.scene.start('SelectionScene', { selected: this.selectedCategory });
                //console.log(this.selectedCategory)
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
                this.scene.start('StartScene', {});
        })

    }

    update(){

    }
}  


export { StyleSelectScene };