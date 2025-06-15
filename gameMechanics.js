import { PG } from './characters.js';

export const EnemyState = {
    IDLE: "IDLE",
    CHASING: "CHASING",
    ATTACKING: "ATTACKING",
    AVOIDING: "AVOIDING",
    DONE: "DONE"
  };

export function addTrackPiece(scene, type, y) {
    const piece = scene.add.image(400, y, type); // usa scene invece di this
    piece.setDepth(-1);
    scene.trackPieces.add(piece);
  }


  export function spawnRandomEnemyCar(scene, selectedPG) {
    let pgCopy = PG.filter((x) => x.ID != selectedPG);
    let randomEnemy = pgCopy[Math.floor(Math.random() * pgCopy.length)];
    let enemyCar = scene.physics.add.image(400, -100, `${randomEnemy.ID}`);
  
    enemyCar.setCollideWorldBounds(true);
    enemyCar.body.setSize(enemyCar.width * 0.7, enemyCar.height * 0.7);
    enemyCar.isTracking = true;
  
    // Aggiungi al gruppo
    scene.enemies.add(enemyCar);
  
    // Aggiungi subito il collider tra player e questo nemico
    scene.physics.add.collider(scene.player, enemyCar, () => {
      //console.log('COLLISIONE!');
      enemyCar.isTracking = false;
      enemyCar.setVelocity(0);
      enemyCar.setTint(0xff0000);
      if(!enemyCar.hasHit && !scene.powerAnimation.anims.isPlaying){
      scene.lifeBar.height -= 10;
      enemyCar.hasHit = true;
      enemyCar.setTint(0xff0000);
      }
    });
  }


  //funzione per generare nemici ed oggetti nel tempo
  export function spawnThingsOverTime(scene, selectedPG, carSelected, spawnDelay, minimumSpawnDelay) {
    spawnRandomEnemyCar(scene, selectedPG, carSelected);//genera il nemico
    spawnRandomObj(scene, carSelected)//genera l'oggetto
    spawnDelay *= 0.9; // calcola il nuovo ritardo: ogni volta diminuisce del 10%
    if (spawnDelay < minimumSpawnDelay) {// limite minimo per non esagerare
      spawnDelay = minimumSpawnDelay;
    }
    
    scene.time.delayedCall(spawnDelay, () => {// richiama sé stessa dopo il nuovo delay
      spawnThingsOverTime(scene, selectedPG, carSelected, spawnDelay, minimumSpawnDelay);
    });
  }

  export function spawnRandomObj(scene, carSelected){
    let objectToSpawn;
    let randomItem = Phaser.Math.Between(1, 10);
    isEven(randomItem) ? objectToSpawn = 'power' : objectToSpawn = 'life';
    
    let randomSpot;//if per evitare che l'oggetto compaia sul nemico
    if (Phaser.Math.Between(0, 1) === 0) {
    randomSpot = Phaser.Math.Between(250, 300);
  } else {
    randomSpot = Phaser.Math.Between(500, 700);
  }
    let upItem = scene.physics.add.image(randomSpot, -100, objectToSpawn);
    upItem.setVelocityY(100); // scende lentamente verso il basso
    upItem.setDepth(1);
    upItem.setScale(0.07);
  
    scene.physics.add.collider(carSelected, upItem, () => {
      upItem.disableBody(true, true);
      if(objectToSpawn=='life' && scene.lifeBar.height<200){
        scene.lifeBar.height += 5; 
      }
      if(objectToSpawn=='power' && scene.powerBar.height<200){
        scene.powerBar.height += 5;
      }
    });
}

export function fasterByTime(scene) {
    //incrementa la velocità di 4 ogni 30 sec.
    scene.scrollSpeed += 4
  }

export function powerBarActivation(scene, powerAnimation, keyAnimazione) {
    if (scene.powerBar.height === 200) {
        //avvia animazione
        powerAnimation.setVisible(true).setDepth(2);
        //evita di riavviare l'animazione se è già in corso permettendo il loop
        if (!powerAnimation.anims.isPlaying) {
        powerAnimation.play(keyAnimazione);
        }
        //timer per il consumo della barra
        const dischargeTimer = scene.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
            if(scene.powerBar.height > 0){
            scene.powerBar.height -= 10;
            scene.powerBar.state = "ACTIVE"
            }
            if (scene.powerBar.height == 0) {
            dischargeTimer.remove();
            powerAnimation.setVisible(false).stop();
            //timer per il recupero della barra
            const rechargeTimer = scene.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                scene.powerBar.height += 2.5;
                scene.powerBar.state = "RECOVERING"
                if (scene.powerBar.height >= 199) {
                    scene.powerBar.height = 200;
                    rechargeTimer.remove();
                }
                }
            });
            }
        }
        });
    }
}


//Funzioni generali

function isEven(n) {
    return n % 2 === 0;
  }