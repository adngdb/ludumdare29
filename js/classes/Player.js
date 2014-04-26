App.Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.game = game;
    this.isInConstructMode;

    this.anchor.setTo(0.5, 0.5);

    this.isInConstructMode = false;

    // Enable physics on the player
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

    var key= this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    key.onDown.add(this.activateConstructMode, this);
    key.onUp.add(this.deactivateConstructMode, this);
};

// Player is a type of Phaser.Sprite
App.Player.prototype = Object.create(Phaser.Sprite.prototype);
App.Player.prototype.constructor = App.Player;

App.Player.prototype.activateConstructMode = function() {
    this.isInConstructMode = true;
};

App.Player.prototype.deactivateConstructMode = function() {
    this.isInConstructMode = false;
};

App.Player.prototype.collisionWithEnemy = function() {
    console.log('collisionWithEnemy');
};

App.Player.prototype.collisionWithTower = function() {
    console.log('collisionWithTower');
};
