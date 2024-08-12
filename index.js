import Phaser from 'phaser';
import { SCENE, FLOOR, MARIO } from './src/objects';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'supermario',
  width: SCENE.width,
  height: SCENE.height,
  backgroundColor: '#446',
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true
    }
  },
  scene: {
    preload() {
      // CLOUDS
      this.load.image('cloud1', '/public/assets/scenery/overworld/cloud1.png');
      this.load.image('cloud2', '/public/assets/scenery/overworld/cloud2.png');

      // FLOOR
      this.load.image('floor_8', '/public/assets/scenery/overworld/floorbricks_8.png');
      this.load.image('floor_16', '/public/assets/scenery/overworld/floorbricks_16.png');

      this.load.spritesheet('mario', '/public/assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });
    },
    create() {
      // ANIMATIONS
      this.anims.create({
        key: 'mario_walk',
        frames: [{ key: 'mario', frame: 3 }, { key: 'mario', frame: 1 }, { key: 'mario', frame: 2 }],
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'mario_idle',
        frames: [{ key: 'mario', frame: 0 }]
      });

      this.anims.create({
        key: 'mario_jump',
        frames: [{ key: 'mario', frame: 5 }]
      });

      // CLOUDS
      this.add.image(10, 10, 'cloud1').setOrigin(0, 0);
      this.add.image(80, 30, 'cloud2').setOrigin(0, 0);

      // FLOOR
      this.floor = this.physics.add.staticGroup();

      this.floor.create(0, SCENE.height - FLOOR.height, 'floor_8')
        .setOrigin(0, 0)
        .refreshBody();
      this.floor.create(168, SCENE.height - FLOOR.height, 'floor_8')
        .setOrigin(0, 0)
        .refreshBody();

      // MARIO
      this.mario = this.physics.add.sprite(10, 20, 'mario')
        .setOrigin(0, 0)
        .setCollideWorldBounds();

      // PIPE

      // PHYSICS
      this.physics.add.collider(this.mario, this.floor);

      this.physics.world.setBounds(0, 0, 256, 280);

      // KEYS
      this.keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        run: Phaser.Input.Keyboard.KeyCodes.SHIFT
      });
    },
    update() {
      // ANIMATE
      if (this.mario.body.velocity.y !== 0) {
        this.mario.anims.play('mario_jump', true);
      } else {
        if (this.mario.body.velocity.x !== 0) {
          this.mario.anims.play('mario_walk', true);
        } else {
          this.mario.anims.play('mario_idle', true);
        }
      }

      // WALK_RUN
      if (this.keys.right.isDown) {
        this.mario.setFlipX(false);
        this.mario.setVelocityX(MARIO.walk_speed);
      } else if (this.keys.left.isDown) {
        this.mario.setFlipX(true);
        this.mario.setVelocityX(-MARIO.walk_speed);
      } else {
        this.mario.setVelocityX(0);
      }

      // JUMP
      if (this.keys.jump.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(MARIO.jump_strength);
      }

      // FALL
      if (this.mario.y > SCENE.height) {
        this.scene.restart();
      }
    }
  }
});