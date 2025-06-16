class HowToScene extends Phaser.Scene {
    constructor() {
        super('HowToScene');
    }

    preload(){
        this.load.image('sky', './assets/sky.png');
        this.load.image('life', './assets/life.png');
        this.load.image('power', './assets/avX.png');


    }

    create(){
        this.add.image(400, 300, 'sky').setDepth(-1);

        // Titolo
        this.add.text(400, 30, 'Guida ai Tasti', {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff'
        }).setOrigin(0.5);

        // Tabella
        const startX = 100;
        const startY = 80;
        const rowHeight = 60;

        const rows = [
        { icon: null, key: '← / → / ↑ / ↓', description: '      Usa le frecce per muoverti' },
        { icon: null, key: 'X', description: 'Attiva lo scudo con il tasto X' },
        { icon: 'life', key: '', description: 'Raccogli i cuori per aumentare la barra della vita' },
        { icon: 'power', key: '', description: 'Raccogli le X per aumentare la barra dello scudo' },
        ];

        rows.forEach((row, index) => {
        const y = startY + index * rowHeight;

        if (row.icon) {
            this.add.image(startX, y, row.icon).setScale(0.09).setOrigin(0, 0.5);
        } else {
            this.add.text(startX, y, row.key, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffff00'
            });
        }

        this.add.text(startX + 100, y, row.description, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#302932'
        });
        });

        // Testo descrittivo sotto la tabella
        const descrizione = `I nemici sono agguerriti ma fragili, basterà un solo scontro per metterli KO.\n` +
        `Gli scontri danneggiano anche te, tieni d'occhio la barra della vita.\n` +
        `Se hai lo scudo X attivo niente potrà danneggiarti!\n` +
        `Raccogli i simboli X per mantenere attivo lo scudo o \nper ricaricare la barra più velocemente.\n` +
        `Quanto tempo riuscirai a resistere?`;

        this.add.text(400, 390, descrizione, {
        fontSize: '21px',
        fontFamily: 'Arial',
        color: '#302932',
        align: 'center',
        wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Tasto START
        const startButton = this.add.rectangle(470, 530, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const startText = this.add.text(470, 530, 'START', {
        fontSize: '16px',
        fill: '#302932',
        fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        startButton.on('pointerdown', () => {
        this.scene.start('SelectionScene', {});
        });

        // Tasto back
        const backButton = this.add.rectangle(300, 530, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const backText = this.add.text(300, 530, 'BACK', {
        fontSize: '16px', fill: '#302932', fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        // Avvia la scena successiva solo se un personaggio è stato selezionato
        backButton.on('pointerdown', () => {
                this.scene.start('StartScene', {});
        })

    }

    upload(){}

}


export { HowToScene };
