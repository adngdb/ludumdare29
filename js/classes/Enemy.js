App.Enemy = function(game, x, y, target) {
    App.Movable.call(this, game, x, y, 'enemy');

    this.game = game;
    this.target = target;

    this.SPEED = 60; // in pixels per second
    this.REACH_DISTANCE = 70; // in pixels
    this.DAMAGES_TO_PLAYER = 10; // in health points
    this.DAMAGES_TO_TOWER = 5; // in health points
    this.ATTACK_COOLDOWN = 2; // in seconds
    this.MAX_HEALTH = 20;

    // walk animation
    this.animations.add('walk-w', this.range(0, 6));
    this.animations.add('walk-e', this.range(12, 18));
    this.animations.add('walk-n', this.range(24, 30));
    this.animations.add('walk-s', this.range(36, 42));
    // attack animation
    this.animations.add('attack-w', [6, 7, 8, 9, 10, 11, 6]);
    this.animations.add('attack-e', [18, 19, 20, 21, 22, 23, 18]);
    this.animations.add('attack-n', [30, 31, 32, 33, 34, 35, 30]);
    this.animations.add('attack-s', [42, 43, 44, 45, 46, 47, 42]);

    this.anchor.setTo(0.5, 0.5);

    this.lastAttack = null;
    this.health = this.MAX_HEALTH;
    this.isTargeted = false;

    this.soundAppears = this.game.add.audio('enemy_pig_appears');
    this.soundAppears.volume = 0.5;
    this.soundAttack = this.game.add.audio('enemy_pig_attack');
    this.soundAttack.volume = 0.3;
    this.soundDies = this.game.add.audio('enemy_pig_dies');
    this.soundDies.volume = 0.5;

    this.inputEnabled = true;
    this.events.onInputDown.add(this.clickListener, this);

    this.lastPathComputation = null;
};

// Enemies are a type of Phaser.Sprite
App.Enemy.prototype = Object.create(App.Movable.prototype);
App.Enemy.prototype.constructor = App.Enemy;

App.Enemy.prototype.init = function() {
    this.soundAppears.play();
    this.lastAttack = null;
    this.health = this.MAX_HEALTH;
};

App.Enemy.prototype.update = function() {
    // This enemy moves towards the player constantly. It won't try to
    // attack towers.

    if (!this.exists) {
        return;
    }

    // If the enemy is close enough to its target.
    if (this.game.physics.arcade.distanceBetween(this, this.target) <= this.REACH_DISTANCE) {
        // Stop movement.
        this.stopMoving();

        // Attack the target if the cooldown time has passed.
        if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
            this.target.hurt(this.DAMAGES_TO_PLAYER);
            this.lastAttack = this.game.time.now;
            this.soundAttack.play();

            var dir = this.getCardinalDirection(this, this.target);
            this.animations.stop(null, true);
            this.animations.play('attack-' + dir, 12);
        }
    }

    this.followPath();
};

App.Enemy.prototype.clickListener = function (element, pointer) {
    this.isTargeted = true;
};

App.Enemy.prototype.hurt = function (damages) {
    this.health -= damages;
};
