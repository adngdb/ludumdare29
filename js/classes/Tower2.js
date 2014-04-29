App.Tower2 = function(game, x, y, type, enemyGroup) {
    Phaser.Sprite.call(this, game, x, y, 'tower2');

    this.game = game;
    this.enemyGroup = enemyGroup;
    this.type = type;

    this.anchor.setTo(0.5, 3.0 / 4.0);

    this.REACH_DISTANCE = 150; // in pixels
    this.DAMAGES_TO_ENEMY = 5; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.MAX_HEALTH = 100;
    this.SLOW_VALUE = 0.3;

    // set animations for creation, attack and death
    this.animations.add('tower_creation', [5, 6, 7, 8, 9, 10]);
    this.animations.add('tower_attack', [0, 1, 2, 3, 4]);
    this.animations.add('tower_death', [11, 12, 13, 14, 15, 16]);

    // Enable physics on the tower
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // this.body.immovable = true;
    this.body.moves = false;
    this.build = false;
    this.body.setSize(32, 32, 1, 10);

    this.lastAttack = null;

    this.soundAppears = this.game.add.audio('tower1_appears');
    this.soundAttack = this.game.add.audio('tower1_bites');
    this.soundAttack.volume = 0.7;
    // this.soundDies = this.game.add.audio(''); // does not exist yet !!!

    this.health = 10;
};

// Tower are a type of Phaser.Sprite
App.Tower2.prototype = Object.create(Phaser.Sprite.prototype);
App.Tower2.prototype.constructor = App.Tower2;

App.Tower2.prototype.reset = function() {
    this.health = this.MAX_HEALTH;
    this.build = false;

},

App.Tower2.prototype.setBaseBuildingFrame = function() {
    this.animations.frame = 5;
};

App.Tower2.prototype.buildingComplete = function() {
    this.build = true;
    this.health += this.MAX_HEALTH - 10;
};

App.Tower2.prototype.init = function() {
    this.soundAppears.play();
    this.animations.play('tower_creation', 6 / this.CONSTRUCTION_DURATION);
};

App.Tower2.prototype.update = function() {
    // do nothing, if not build yet
    if (this.alpha == 0.9 || !this.build || !this.exists) {
        return;
    }

    // slow all enemy in range if the cooldown time has passed.
    if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
        var attacked = false;
        for (var index = this.enemyGroup.length - 1; index>=0; index--) {
            var currEnemy = this.enemyGroup.getAt(index);
            if (currEnemy.exists && this.game.physics.arcade.distanceBetween(this, currEnemy) < this.REACH_DISTANCE) {
                if (currEnemy.speedModif != this.SLOW_VALUE) {
                    currEnemy.speedModif = this.SLOW_VALUE;
                    currEnemy.lastPathComputation = null;
                }
                currEnemy.speedModifTimer = this.game.time.now;
                attacked = true;
            }
        }
        if (attacked) {
            this.lastAttack = this.game.time.now;
            this.animations.play('tower_attack', 18);
            this.soundAttack.play();
        }
    }
}

App.Tower2.prototype.hurt = function (damages) {
    this.health -= damages;
};

