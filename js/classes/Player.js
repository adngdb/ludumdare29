App.Player = function (game, x, y) {
    App.Movable.call(this, game, x, y, 'player');

    this.game = game;

    this.anchor.setTo(0.5, 3.0 / 4.0);

    // Create player's animations : walk
    this.animations.add('walk-w', this.range(0, 6));
    this.animations.add('walk-n', this.range(18, 24));
    this.animations.add('walk-s', this.range(36, 42));
    this.animations.add('walk-e', this.range(54, 60));
    // Animation for attack mode
    this.animations.add('attack-w', [6, 7, 8, 9, 10, 11, 6]);
    this.animations.add('attack-n', [24, 25, 26, 27, 28, 29, 24]);
    this.animations.add('attack-s', [42, 43, 44, 45, 46, 47, 42]);
    this.animations.add('attack-e', [60, 61, 62, 63, 64, 65, 60]);
    // Animation for building mode
    this.animations.add('build-w', this.range(12, 18)); //[12, 13, 14, 15, 16, 17, 12]);
    this.animations.add('build-n', this.range(30, 36)); //[30, 31, 32, 33, 34, 35, 30]);
    this.animations.add('build-s', this.range(48, 54)); //[48, 49, 50, 51, 52, 53, 48]);
    this.animations.add('build-e', this.range(66, 72)); //[66, 67, 68, 69, 70, 71, 66]);
    // Animation for death
    this.animations.add('death-w', this.range(72, 78));
    this.animations.add('death-e', this.range(78, 84));
    this.animations.add('death-n', this.range(84, 90));
    this.animations.add('death-s', this.range(90, 96));

    this.animations.frame = 42;

    this.currAnim = null;

    // strength of player vs enemy
    this.DAMAGE_TO_ENEMY = 10;
    this.ATTACK_RANGE = 100;
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.lastAttack = this.game.time.now;

    this.SPEED = 90; // in pixels per second
    this.MIN_DISTANCE_TO_MOVE = 10; // in pixels

    this.isInConstructMode = false;
    this.towerTypeToConstruct = null;

    this.body.immovable = true;
    this.body.setSize(24, 20, 0, 10);
    this.destination = new Phaser.Point(x, y);

    this.walkSound = this.game.add.audio('footstep');
    this.walkSound.volume = 0.50;
    this.walkSound.loop = true;
    this.walkSound.play();
    this.walkSound.pause();

    this.stickAttackSound = this.game.add.audio('stick_attack');
    this.stickAttackSound.volume = 1;

    // Health of the player.
    // The game is lost if that number goes under zero.
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.building = false;
    this.attacking = false;
};

// Player is a type of Phaser.Sprite
App.Player.prototype = Object.create(App.Movable.prototype);
App.Player.prototype.constructor = App.Player;

App.Player.prototype.update = function () {
    this.followPath();
    if (this.attacking && this.currAnim.isFinished) {
        this.attacking = false;
    }
};

App.Player.prototype.setBuildMode = function(target) {
    var dir = this.getCardinalDirection(this, target);
    this.currAnim = this.animations.play('build-' + dir, 12, true);
    this.walkSound.pause();
    this.building = true;
};

App.Player.prototype.endBuildMode = function(target) {
    this.animations.stop(null, true);
    this.building = false;
    target.buildingComplete();
};

App.Player.prototype.activateConstructMode = function () {
    this.isInConstructMode = true;
};

App.Player.prototype.deactivateConstructMode = function () {
    this.isInConstructMode = false;
};

App.Player.prototype.hurt = function (damages) {
    this.health -= damages;

    if (this.health <= 0) {
        this.currAnim = this.animations.play('death-' + this.currentCardinalDirection, 12);
    }
};

App.Player.prototype.tryHit = function (target) {

    if (!this.lastAttack || this.game.time.elapsedSecondsSince(this.lastAttack) > this.ATTACK_COOLDOWN) {
        if (this.game.physics.arcade.distanceBetween(this, target) < this.ATTACK_RANGE) {
            var dir = this.getCardinalDirection(this, target);
            this.currAnim = this.animations.play('attack-' + dir, 12);
            this.game.time.events.add(Phaser.Timer.SECOND * 0.25,
                function() {target.hurt(this.DAMAGE_TO_ENEMY); }
                , this
            );
            this.stickAttackSound.play();
            this.walkSound.pause();
            this.lastAttack = this.game.time.now;
            this.body.velocity.setTo(0, 0);
            this.attacking = true;
        }
    }
};

App.Player.prototype.setChosenTowerType = function (towerType) {
    this.towerTypeToConstruct = towerType;
    this.activateConstructMode();
};
