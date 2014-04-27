App.Player = function (game, x, y) {
    App.Movable.call(this, game, x, y, 'player');

    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    // Create player's animations.
    this.animations.add('walk-w', this.range(0, 6));
    this.animations.add('walk-n', this.range(6, 12));
    this.animations.add('walk-s', this.range(12, 18));
    this.animations.add('walk-e', this.range(18, 24));

    // strength of player vs enemy
    this.DAMAGE_TO_ENEMY = 10;
    this.ATTACK_RANGE = 100;

    this.SPEED = 90; // in pixels per second
    this.MIN_DISTANCE_TO_MOVE = 10; // in pixels

    this.isInConstructMode = false;
    this.towerTypeToConstruct = null;

    this.body.immovable = true;
    this.destination = new Phaser.Point(x, y);

    this.walkSound = this.game.add.audio('footstep');
    this.walkSound.loop = true;
    this.walkSound.play();
    this.walkSound.pause();

    this.stickAttackSound = this.game.add.audio('stick_attack');

    // Health of the player.
    // The game is lost if that number goes under zero.
    this.health = 100;
    this.building = false;
};

// Player is a type of Phaser.Sprite
App.Player.prototype = Object.create(App.Movable.prototype);
App.Player.prototype.constructor = App.Player;

App.Player.prototype.update = function () {
    if (this.game.physics.arcade.distanceBetween(this, this.destination) < this.MIN_DISTANCE_TO_MOVE) {
        this.body.velocity.setTo(0, 0);
        this.walkSound.pause();
        this.animations.stop(null, true);
    }
};

App.Player.prototype.moveToObject = function (dest) {
    this.destination.setTo(dest.x, dest.y);
    this.game.physics.arcade.moveToObject(this, this.destination, this.SPEED);

    this.walkSound.resume();
    var dir = this.getCardinalDirection();
    this.animations.play('walk-' + dir, 12, true);
};

App.Player.prototype.activateConstructMode = function () {
    this.isInConstructMode = true;
};

App.Player.prototype.deactivateConstructMode = function () {
    this.isInConstructMode = false;
};

App.Player.prototype.hurt = function (damages) {
    this.health -= damages;
};

App.Player.prototype.tryHit = function (target) {
    if (this.game.physics.arcade.distanceBetween(this, target) < this.ATTACK_RANGE) {
        this.stickAttackSound.restart();
        target.hurt(this.DAMAGE_TO_ENEMY);
    }
};

App.Player.prototype.setChoosenTowerType = function (towerType) {
    this.towerTypeToConstruct = towerType;
    this.activateConstructMode();
};
