App.Enemy = function(game, x, y, target) {
    Phaser.Sprite.call(this, game, x, y, 'enemy');

    this.game = game;
    this.target = target;

    this.anchor.setTo(0.5, 0.5);
    this.SPEED = 60;

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.enemy = this.game.add.sprite(500, 500, 'enemy');
};

// Enemies are a type of Phaser.Sprite
App.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
App.Enemy.prototype.constructor = App.Enemy;

App.Enemy.prototype.update = function() {
    // This enemy moves towards the player constantly. It won't try to
    // attack towers.

    this.game.physics.arcade.moveToObject(this, this.target, this.SPEED);
};
