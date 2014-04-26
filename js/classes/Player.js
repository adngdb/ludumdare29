App.Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.game = game;
    this.isInConstructMode;

    this.anchor.setTo(0.5, 0.5);

    this.isInConstructMode = false;

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
