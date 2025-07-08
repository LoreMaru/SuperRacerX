class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload(){
        
        this.load.image('sfondoStart', './assets/logo/sfondoStart.png');
        this.load.image('super', './assets/logo/super.png');
        this.load.image('avX', './assets/logo/x.png');
        this.load.image('racer', './assets/logo/racer.png');


    }

    create(){

        this.add.image(400, 300, 'sfondoStart').setDepth(-1).setDisplaySize(800, 600);
        const sup = this.add.image(-100, 100, 'super')
        const rac = this.add.image(900, 230, 'racer')
        const avX = this.add.image(420, 160, 'avX').setScale(0)

        //animazione "super"
        this.tweens.add({
            targets: sup,
            x: 400, // centro orizzontale
            ease: 'Power2',
            duration: 1000, // 1 secondo
        });
        //animazione "racer"
        this.tweens.add({
            targets: rac,
            x: 400,
            ease: 'Power2',
            duration: 1000,
            onComplete: () => {
                // animazione "x" dopo la fine della precedente
                this.tweens.add({
                    targets: avX,
                    scale: 1,
                    ease: 'Back.Out',
                    duration: 1000
                });
            }
        });

        // Tasto start
        const startButton = this.add.rectangle(400, 400, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const startText = this.add.text(400, 400, 'START', {
        fontSize: '16px', fill: '#302932', fontFamily: '"Press Start 2P", monospace',
        }).setOrigin(0.5);

        // Tasto how to
        const howToButton = this.add.rectangle(400, 460, 150, 50, 0xB1B1B1)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setStrokeStyle(5, 0x302932);

        const howToText = this.add.text(400, 460, `HOW TO\nPLAY`, {
        fontSize: '15px', fill: '#302932', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);

        howToButton.on('pointerdown', () => {
            this.scene.start('HowToScene', {});
        }); 

        startButton.on('pointerdown', () => {
                this.scene.start('StyleSelectScene', {});
        });  

        const versionText = this.add.text(750, 580, `V2.0`, {
            fontSize: '10px', fill: '#302932', fontFamily: '"Press Start 2P", monospace', align: 'center'
            }).setOrigin(0.5);

    }

    upload(){}

}


export { StartScene };
