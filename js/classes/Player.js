App.Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    this.isInConstructMode = false;

    // Enable physics on the player
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

    // Health of the player.
    // The game is lost is that number goes under zero.
    this.health = 100;
};

// Player is a type of Phaser.Sprite
App.Player.prototype = Object.create(Phaser.Sprite.prototype);
App.Player.prototype.constructor = App.Player;

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

    if (this.health <= 0) {
        console.log('noooooooooooooo!');
    }
};
