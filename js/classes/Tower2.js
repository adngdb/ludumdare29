App.Tower2 = function(game, x, y, enemiesList, map) {
    App.Tower.call(this, game, x, y, 'tower2', enemiesList, map);

    this.REACH_DISTANCE = 150; // in pixels
    this.DAMAGES_TO_ENEMY = 5; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.MAX_HEALTH = 100;
    this.CONSTRUCTION_HEALTH = 10;
    this.SLOW_VALUE = 0.3;

    // Event sounds.
    this.soundAppears = this.game.add.audio('tower1_appears');

    this.soundAttacks = this.game.add.audio('tower1_bites');
    this.soundAttacks.volume = 0.7;

    // this.soundDies = this.game.add.audio(''); // does not exist yet !!!
};

// Towers 2 are a type of App.Tower
App.Tower2.prototype = Object.create(App.Tower.prototype);
App.Tower2.prototype.constructor = App.Tower2;

App.Tower2.prototype.update = function() {
    // do nothing, if not build yet
    if (!this.exists || this.alpha == 0.9 || !this.built) {
        return;
    }

    // slow all enemy in range if the cooldown time has passed.
    if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
        var attacked = false;
        for (var index = this.enemiesList.length - 1; index>=0; index--) {
            var currEnemy = this.enemiesList[index];
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
            this.soundAttacks.play();
        }
    }
};
