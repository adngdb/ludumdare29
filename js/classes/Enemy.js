App.Enemy = function (game, x, y, image) {
    App.Movable.call(this, game, x, y, image);

    // Default configuration.
    this.SPEED = 60; // in pixels per second
    this.REACH_DISTANCE = 70; // in pixels
    this.DAMAGES_TO_PLAYER = 10; // in health points
    this.DAMAGES_TO_TOWER = 5; // in health points
    this.ATTACK_COOLDOWN = 2; // in seconds
    this.MAX_HEALTH = 20;

    // Animations.
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
    // spawn animation
    this.animations.add('spawn', this.range(48, 54));

    // Phaser parameters.
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(24, 20, 0, 10);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.clickListener, this);

    // Internal variables.
    this.health = this.MAX_HEALTH;
    this.lastAttack = null;
    this.isTargeted = false;
    this.lastPathComputation = null;
    this.attacking = false;
    this.currAnim = null;
    this.speedModif = 1;
    this.speedModifTimer = null;
    this.spawned = false;

    // Expected event sounds.
    this.soundAppears = null;
    this.soundAttacks = null;
    this.soundDies = null;
};

// Enemies are a type of App.Movable.
App.Enemy.prototype = Object.create(App.Movable.prototype);
App.Enemy.prototype.constructor = App.Enemy;

App.Enemy.prototype.init = function () {
    // Initialize parameters.
    this.health = this.MAX_HEALTH;
    this.lastAttack = null;
    this.lastPathComputation = null;
    this.spawned = false;
    this.speedModif = 1;
    this.speedModifTimer = null;

    // Make it spawn.
    this.soundAppears.play();
    this.currAnim = this.animations.play('spawn', 12);

    // Give it a target.
    this.getNewTarget();
};

App.Enemy.prototype.clickListener = function (element, pointer) {
    this.isTargeted = true;
};

App.Enemy.prototype.hurt = function (damages) {
    this.health -= damages;
};

App.Enemy.prototype.update = function() {
    // This enemy moves towards the player constantly. It won't try to
    // attack towers.

    if (!this.exists) {
        return;
    }

    if (!this.spawned) {
        if (this.currAnim.isFinished) {
            this.spawned = true;
            this.moveToObject(new Phaser.Point(this.game.world.centerX, this.game.world.centerY))
        }
        else {
            return;
        }
    }

    if (this.speedModifTimer !== null) {
        if (this.game.time.elapsedSecondsSince(this.speedModifTimer) > 2) {
            // last freeze more than 2sec before => unfreeze
            this.speedModif = 1;
            this.lastPathComputation = null;
        }
    }

    if (this.attacking && this.currAnim && this.currAnim.isFinished) {
        this.attacking = false;
    }

    // If the enemy is close enough to its target.
    if (this.game.physics.arcade.distanceBetween(this, this.target) <= this.REACH_DISTANCE) {
        // Stop movement.
        this.stopMoving();

        // Attack the target if the cooldown time has passed.
        if (
            (
                !this.lastAttack ||
                this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN
            ) &&
            this.target.health !== 0
        ) {
            this.attacking = true;
            this.animations.stop(null, true);
            var dir = this.getCardinalDirection(this, this.target);
            this.currAnim = this.animations.play('attack-' + dir, 12);
            this.soundAttacks.play();
            if (this.target === this.savePlayer) {
                this.target.hurt(this.DAMAGES_TO_PLAYER);
            }
            else {
                this.target.hurt(this.DAMAGES_TO_TOWER);
            }
            this.lastAttack = this.game.time.now;
        }
    }

    // reset target if killed (by this enemy or another one)
    if (this.target.health <= 0) {
        this.getNewTarget();
    }

    this.followPath();
};
