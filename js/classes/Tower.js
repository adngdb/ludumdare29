App.Tower = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'tower');

    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    // Enable physics on the tower
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable  = true;
};

// Tower are a type of Phaser.Sprite
App.Tower.prototype = Object.create(Phaser.Sprite.prototype);
App.Tower.prototype.constructor = App.Tower;