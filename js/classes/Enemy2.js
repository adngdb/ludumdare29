App.Enemy2 = function(game, x, y, target, towers) {
    App.Enemy.call(this, game, x, y, 'enemy2');

    this.target = target;
    this.saveTowers = towers;
    this.savePlayer = this.target;

    // carac for enemy 2
    this.SPEED = 30; // in pixels per second
    this.REACH_DISTANCE = 70; // in pixels
    this.DAMAGES_TO_PLAYER = 10; // in health points
    this.DAMAGES_TO_TOWER = 10; // in health points
    this.ATTACK_COOLDOWN = 3; // in seconds
    this.MAX_HEALTH = 40;

    // This enemy's event sounds.
    this.soundAppears = this.game.add.audio('enemy_pig_appears');
    this.soundAppears.volume = 0.5;

    this.soundAttacks = this.game.add.audio('enemy_eye_attack');
    this.soundAttacks.volume = 0.3;

    this.soundDies = this.game.add.audio('enemy_pig_dies');
    this.soundDies.volume = 0.5;
};

// Enemies are a type of Phaser.Sprite
App.Enemy2.prototype = Object.create(App.Enemy.prototype);
App.Enemy2.prototype.constructor = App.Enemy2;

App.Enemy2.prototype.getNewTarget = function () {
    var closest = null;
    // for (var index = this.saveTowers.length - 1; index >= 0; index--) {
    //     var currTower = this.saveTowers.getAt(index);
    //     if (currTower.exists) {
    //         var dist = this.game.physics.arcade.distanceBetween(this, currTower);
    //         if (closest === null || dist < closest) {
    //             this.target = currTower;
    //             closest = dist;
    //         }
    //     }
    // }
    if (closest === null) {
        this.target = this.savePlayer;
    }
};
