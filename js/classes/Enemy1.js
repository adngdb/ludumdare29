App.Enemy1 = function(game, x, y, target) {
    App.Enemy.call(this, game, x, y, 'enemy1');

    this.target = target;
    this.savePlayer = this.target;

    // This enemy's configuration.
    this.SPEED = 60; // in pixels per second
    this.REACH_DISTANCE = 70; // in pixels
    this.DAMAGES_TO_PLAYER = 10; // in health points
    this.DAMAGES_TO_TOWER = 5; // in health points
    this.ATTACK_COOLDOWN = 2; // in seconds
    this.MAX_HEALTH = 20;

    // This enemy's event sounds.
    this.soundAppears = this.game.add.audio('enemy_pig_appears');
    this.soundAppears.volume = 0.5;

    this.soundAttacks = this.game.add.audio('enemy_pig_attack');
    this.soundAttacks.volume = 0.3;

    this.soundDies = this.game.add.audio('enemy_pig_dies');
    this.soundDies.volume = 0.5;
};

App.Enemy1.prototype = Object.create(App.Enemy.prototype);
App.Enemy1.prototype.constructor = App.Enemy1;

App.Enemy1.prototype.getNewTarget = function () {
    this.target = this.savePlayer;
};
