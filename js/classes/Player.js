App.Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    this.SPEED = 90; // in pixels per second
    this.MIN_DISTANCE_TO_MOVE = 10; // in pixels

    this.isInConstructMode = false;
    this.towerTypeToConstruct = null;

    // Enable physics on the player
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.destination = new Phaser.Point(x, y);

    this.sound = this.game.add.audio('footstep');
    this.sound.loop = true;
    // this.sound.play();

    // Health of the player.
    // The game is lost if that number goes under zero.
    this.health = 100;
};

// Player is a type of Phaser.Sprite
App.Player.prototype = Object.create(Phaser.Sprite.prototype);
App.Player.prototype.constructor = App.Player;

App.Player.prototype.update = function () {
    if (this.game.physics.arcade.distanceBetween(this, this.destination) > this.MIN_DISTANCE_TO_MOVE) {
        this.game.physics.arcade.moveToObject(this, this.destination, this.SPEED);
    }
    else {
        this.body.velocity.setTo(0, 0);
    }
};

App.Player.prototype.activateConstructMode = function () {
    this.isInConstructMode = true;
};

App.Player.prototype.deactivateConstructMode = function () {
    this.isInConstructMode = false;
};

App.Player.prototype.collisionWithEnemy = function() {
    console.log('collisionWithEnemy');
};

App.Player.prototype.collisionWithTower = function() {
    console.log('collisionWithTower');
};

App.Player.prototype.hurt = function (damages) {
    this.health -= damages;
};

App.Player.prototype.setChoosenTowerType = function (towerType) {
    this.towerTypeToConstruct = towerType;
    this.activateConstructMode();
};
