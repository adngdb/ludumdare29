App.Tower = function(game, x, y, type, enemyGroup) {
    Phaser.Sprite.call(this, game, x, y, 'tower');

    this.game = game;
    this.enemyGroup = enemyGroup;
    this.type = type;

    this.anchor.setTo(0.5, 0.5);

    this.REACH_DISTANCE = 80; // in pixels
    this.DAMAGES_TO_ENEMY = 10; // in health points
    this.ATTACK_COOLDOWN = 0.3; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.animations.add('attack', [0, 1, 2, 3, 0]);

    // Enable physics on the tower
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // this.body.immovable = true;
    this.body.moves = false;
    this.build = false;

    this.lastAttack = null;
};

// Tower are a type of Phaser.Sprite
App.Tower.prototype = Object.create(Phaser.Sprite.prototype);
App.Tower.prototype.constructor = App.Tower;

App.Tower.prototype.update = function() {
    // do nothing, if not build yet
    if (this.alpha == 0 || !this.build) {
        return;
    }

    // Attack the first enemy in range if the cooldown time has passed.
    if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
        var target = this.enemyGroup.getAt(0);
        var next = false;
        var index = 0;
        while(target != -1 && !next) {
            if (target.exists && this.game.physics.arcade.distanceBetween(this, target) < this.REACH_DISTANCE) {
                next = true;
            }
            else {
                target = this.enemyGroup.getAt(++index);
            }
        }

        if (target != -1) {
            target.hurt(this.DAMAGES_TO_ENEMY);
            this.lastAttack = this.game.time.now;
            this.animations.play('attack', 12);
        }
    }
}
