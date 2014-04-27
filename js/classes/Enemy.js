App.Enemy = function(game, x, y, target) {
    App.Movable.call(this, game, x, y, 'enemy');

    this.game = game;
    this.target = target;

    this.SPEED = 60; // in pixels per second
    this.REACH_DISTANCE = 40; // in pixels
    this.DAMAGES_TO_PLAYER = 10; // in health points
    this.DAMAGES_TO_TOWER = 5; // in health points
    this.ATTACK_COOLDOWN = 2; // in seconds

    this.anchor.setTo(0.5, 0.5);

    this.lastAttack = null;
    this.health = 10;

    this.soundAppears = this.game.add.audio('enemy_pig_appears');
    this.soundAttack = this.game.add.audio('enemy_pig_attack');
    this.soundDies = this.game.add.audio('enemy_pig_dies');

};

// Enemies are a type of Phaser.Sprite
App.Enemy.prototype = Object.create(App.Movable.prototype);
App.Enemy.prototype.constructor = App.Enemy;

App.Enemy.prototype.init = function() {
    this.soundAppears.play();
    this.lastAttack = null;
    this.health = 10;
};

App.Enemy.prototype.update = function() {
    // This enemy moves towards the player constantly. It won't try to
    // attack towers.
    if (!this.exists) return;
    // If the enemy is close enough to its target.
    if (this.game.physics.arcade.distanceBetween(this, this.target) <= this.REACH_DISTANCE) {
        // Stop movement.
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // Attack the target if the cooldown time has passed.
        if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
            this.target.hurt(this.DAMAGES_TO_PLAYER);
            this.lastAttack = this.game.time.now;
            this.soundAttack.play();
        }
    }
    else {
        // Move towards the target.
        this.game.physics.arcade.moveToObject(this, this.target, this.SPEED);
    }
};

App.Enemy.prototype.hurt = function (damages) {
    this.health -= damages;
};
