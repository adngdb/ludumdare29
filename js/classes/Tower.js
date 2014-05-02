App.Tower = function(game, x, y, image, type, enemyGroup) {
    Phaser.Sprite.call(this, game, x, y, image);

    this.game = game;
    this.enemyGroup = enemyGroup;
    this.type = type;

    this.REACH_DISTANCE = 80; // in pixels
    this.DAMAGES_TO_ENEMY = 10; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.MAX_HEALTH = 20;
    this.CONSTRUCTION_HEALTH = 10;
    this.SLOW_VALUE = 0.3;

    // set animations for creation, attack and death
    this.animations.add('tower_creation', [5, 6, 7, 8, 9, 10]);
    this.animations.add('tower_attack', [0, 1, 2, 3, 4]);
    this.animations.add('tower_death', [11, 12, 13, 14, 15, 16]);

    // Enable physics on the tower
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.moves = false;
    this.body.setSize(32, 32, 1, 10);
    this.anchor.setTo(0.5, 3.0 / 4.0);

    this.health = this.CONSTRUCTION_HEALTH;
    this.lastAttack = null;
    this.built = false;

    // Expected event sounds.
    this.soundAppears = null;
    this.soundAttacks = null;
    this.soundDies = null;
};

// Tower are a type of Phaser.Sprite
App.Tower.prototype = Object.create(Phaser.Sprite.prototype);
App.Tower.prototype.constructor = App.Tower;

App.Tower.prototype.init = function() {
    this.soundAppears.play();
    this.animations.play('tower_creation', 6 / this.CONSTRUCTION_DURATION);
};

App.Tower.prototype.reset = function() {
    this.health = this.CONSTRUCTION_HEALTH;
    this.build = false;
    this.lastAttack = null;
};

App.Tower.prototype.setBaseBuildingFrame = function() {
    this.animations.frame = 5;
};

App.Tower.prototype.buildingComplete = function() {
    this.built = true;
    this.health += this.MAX_HEALTH - this.CONSTRUCTION_HEALTH;
};

App.Tower.prototype.hurt = function (damages) {
    this.health -= damages;
};
