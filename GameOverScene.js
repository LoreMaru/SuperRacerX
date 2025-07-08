class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(dataFromSelection) {
        //Questo viene chiamato prima di preload()
        //Serve per portare i dati della selezione dalla scena precedente
        this.timer = dataFromSelection.timeResult;
      }

    preload(){
        this.load.image('sky', './assets/sky.png');

    }

    create(){
        this.add.image(400, 300, 'sky').setDepth(-1);

        // Titolo
        this.add.text(400, 50, 'GAME OVER', {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff'
        }).setOrigin(0.5);

        //Tempo
        const splitTimer = this.timer.split(":")
        this.add.text(400, 250, `${splitTimer[0]}\n${splitTimer[1]}:${splitTimer[2]}:${splitTimer[3]}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
            }).setOrigin(0.5);


        // Bottone riprova
        const startButtonY = 530;

        const reStartButton = this.add.rectangle(400, startButtonY, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const reStartText = this.add.text(400, startButtonY, 'RIPROVA', {
        fontSize: '16px',
        fill: '#302932',
        fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        reStartButton.on('pointerdown', () => {
        this.scene.start('StartScene', {});
        this.gameTimer.reset({ delay: 1000000, loop: false });
        });

    }

    upload(){}

}


export { GameOverScene };