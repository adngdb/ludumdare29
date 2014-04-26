Chopper.Enemy = function(game) {

    this.game = game;
    this.tankSprite;
    this.turretSprite;
    this.velocity = 100;
    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;
    this.fireKey;
    this.turretMaxAngle = -40;
    this.turretMinAngle = 0;
    this.bullet;
    this.bulletVelocity = 250;
    this.bullets;
    this.firerate = 700;
    this.fireTime = 0;

    this.circle;
};

Chopper.Enemy.prototype = {
    create: function() {
        this.bullets = this.game.add.group();
        this.bullets.createMultiple(10, 'missile');
        this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);

        this.turretSprite = this.game.add.sprite(10, 250, 'enemyTankTurret');

        this.tankSprite = this.game.add.sprite(10, 250, 'enemyTank');
        this.tankSprite.body.gravity.y = 6;

        this.tankSprite.body.collideWorldBounds = true;

        this.upKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8);
        this.downKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2);
        this.leftKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6);
        this.fireKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD);
    },

    update: function(playerPosition) {
        this.tankSprite.body.velocity.x = 0;

        if (this.upKey.isDown)
        {
            if (this.turretMaxAngle <= this.turretSprite.angle - 1) {
                this.turretSprite.angle -= 1;
            }
        }
        else if (this.downKey.isDown)
        {
            if (this.turretMinAngle > this.turretSprite.angle + 1) {
                this.turretSprite.angle += 1;
            }
        }

        if (this.leftKey.isDown)
        {
            this.tankSprite.body.velocity.x = -this.velocity;
        }
        else if (this.rightKey.isDown)
        {
            this.tankSprite.body.velocity.x = this.velocity;
        }

        this.turretSprite.x = this.tankSprite.x + 21;
        this.turretSprite.y = this.tankSprite.y + 6;

        if (this.fireKey.isDown)
        {
            this.fire();
        }
    },

    render: function() {
    },

    fire: function() {
        if (this.game.time.now > this.fireTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
                this.bullet.reset(this.turretSprite.x, this.turretSprite.y);
                this.bullet.angle = this.turretSprite.angle;
                this.game.physics.velocityFromAngle(this.bullet.angle, this.bulletVelocity, this.bullet.body.velocity);

                this.fireTime = this.game.time.now + this.firerate;
            }
        }
    },

    resetBullet: function(bullet) {
        bullet.kill();
    }
};