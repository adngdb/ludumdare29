App.Tower = function(game, x, y, type, enemyGroup) {
    Phaser.Sprite.call(this, game, x, y, 'tower1');

    this.game = game;
    this.enemyGroup = enemyGroup;
    this.type = type;

    this.anchor.setTo(0.5, 3.0 / 4.0);

    this.REACH_DISTANCE = 80; // in pixels
    this.DAMAGES_TO_ENEMY = 10; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.CONSTRUCTION_DURATION = 1; // in seconds
    this.MAX_HEALTH = 20;

    // set animations for creation, attack and death
    this.animations.add('tower_creation', [5, 6, 7, 8, 9, 10]);
    this.animations.add('tower_attack', [0, 1, 2, 3, 4]);
    this.animations.add('tower_death', [11, 12, 13, 14, 15, 16]);

    // Enable physics on the tower
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // this.body.immovable = true;
    this.body.moves = false;
    this.build = false;
    this.body.setSize(32, 32, 16, 32);

    this.lastAttack = null;

    this.soundAppears = this.game.add.audio('tower1_appears');
    this.soundAttack = this.game.add.audio('tower1_bites');
    this.soundAttack.volume = 0.7;
    // this.soundDies = this.game.add.audio(''); // does not exist yet !!!

    this.health = 10;
};

// Tower are a type of Phaser.Sprite
App.Tower.prototype = Object.create(Phaser.Sprite.prototype);
App.Tower.prototype.constructor = App.Tower;

App.Tower.prototype.setBaseBuildingFrame = function() {
    this.animations.frame = 5;
};

App.Tower.prototype.buildingComplete = function() {
    this.build = true;
    this.health += this.MAX_HEALTH - 10;
};

App.Tower.prototype.init = function() {
    this.soundAppears.play();
    this.animations.play('tower_creation', 6 / this.CONSTRUCTION_DURATION);
};

App.Tower.prototype.update = function() {
    // do nothing, if not build yet
    if (this.alpha == 0.9 || !this.build || !this.exists) {
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
            this.game.time.events.add(Phaser.Timer.SECOND * 0.25,
                function() {target.hurt(this.DAMAGES_TO_ENEMY);}
                , this
            );
            this.lastAttack = this.game.time.now;
            this.animations.play('tower_attack', 18);
            this.soundAttack.play();
        }
    }
}

App.Tower.prototype.hurt = function (damages) {
    this.health -= damages;
    if (this.health <= 0) {
        this.kill();
    }
};

