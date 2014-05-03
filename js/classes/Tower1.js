App.Tower1 = function(game, x, y, enemiesList) {
    App.Tower.call(this, game, x, y, 'tower1', enemiesList);

    this.REACH_DISTANCE = 80; // in pixels
    this.DAMAGES_TO_ENEMY = 10; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.MAX_HEALTH = 20;
    this.CONSTRUCTION_HEALTH = 10;

    // Event sounds.
    this.soundAppears = this.game.add.audio('tower1_appears');

    this.soundAttacks = this.game.add.audio('tower1_bites');
    this.soundAttacks.volume = 0.7;

    // this.soundDies = this.game.add.audio(''); // does not exist yet !!!
};

// Towers 1 are a type of App.Tower
App.Tower1.prototype = Object.create(App.Tower.prototype);
App.Tower1.prototype.constructor = App.Tower1;

App.Tower1.prototype.update = function() {
    // do nothing, if not build yet
    if (!this.exists || this.alpha == 0.9 || !this.built) {
        return;
    }

    // Attack the first enemy in range if the cooldown time has passed.
    if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
        var target = this.enemiesList[0];
        var next = false;
        var index = 0;
        while (target && !next) {
            if (target.exists && this.game.physics.arcade.distanceBetween(this, target) < this.REACH_DISTANCE) {
                next = true;
            }
            else {
                target = this.enemiesList[++index];
            }
        }

        if (target) {
            this.game.time.events.add(Phaser.Timer.SECOND * 0.25,
                function() {target.hurt(this.DAMAGES_TO_ENEMY);}
                , this
            );
            this.lastAttack = this.game.time.now;
            this.animations.play('tower_attack', 18);
            this.soundAttacks.play();
        }
    }
};
