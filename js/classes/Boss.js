App.Boss = function(game, x, y, image, target) {
    App.Enemy.call(this, game, x, y, image, target);

    this.REACH_DISTANCE = 70; // in pixels
    this.DAMAGES_TO_PLAYER = 20; // in health points
    this.DAMAGES_TO_TOWER = 10; // in health points
    this.ATTACK_COOLDOWN = 1; // in seconds
    this.MAX_HEALTH = 400;

    // walk animation
    this.animations.add('walk-e', this.range(0, 6));
    this.animations.add('walk-n', this.range(12, 18));
    this.animations.add('walk-s', this.range(24, 30));
    this.animations.add('walk-w', this.range(36, 42));
    // attack animation
    this.animations.add('attack-e', this.range(6, 12));
    this.animations.add('attack-n', this.range(18, 24));
    this.animations.add('attack-s', this.range(30, 36));
    this.animations.add('attack-w', this.range(42, 48));
    // spawn animation
    this.animations.add('spawn', this.range(48, 54));

    this.walkSound = this.game.add.audio('boss_step');
    this.walkSound.loop = true;
    this.walkSound.volume = 0.4;
    this.walkSound.play();

    this.body.setSize(24, 20, 0, 10);

    this.soundAttack = this.game.add.audio('boss_attack');
};

// Enemies are a type of Phaser.Sprite
App.Boss.prototype = Object.create(App.Enemy1.prototype);
App.Boss.prototype.constructor = App.Boss;
