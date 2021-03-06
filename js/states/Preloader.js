App.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;

    this.PLAYER_SIZE = 48;
    this.TOWER_SIZE = 64;
    this.ENEMY_SIZE = 48;
    this.BOSS_SIZE = 64;
};

App.Preloader.prototype = {

    preload: function() {
        this.background = this.add.sprite(0, 0, 'preloaderBackground');
        this.preloadBar = this.add.sprite(this.world.centerX - 380, this.world.centerY - 10, 'preloaderBar');

        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('player', 'assets/gfx/player.png', this.PLAYER_SIZE, this.PLAYER_SIZE);
        this.load.spritesheet('tower1', 'assets/gfx/tower1.png', this.TOWER_SIZE, this.TOWER_SIZE);
        this.load.spritesheet('tower2', 'assets/gfx/tower2.png', this.TOWER_SIZE, this.TOWER_SIZE);
        this.load.spritesheet('enemy1', 'assets/gfx/enemy1.png', this.ENEMY_SIZE, this.ENEMY_SIZE);
        this.load.spritesheet('enemy2', 'assets/gfx/enemy2.png', this.ENEMY_SIZE, this.ENEMY_SIZE);
        this.load.spritesheet('boss', 'assets/gfx/boss.png', this.BOSS_SIZE, this.BOSS_SIZE);

        this.load.image('background', 'assets/gfx/background.png');
        this.load.image('title_menu', 'assets/interface/menu_titre.png');
        this.load.image('game_over_menu', 'assets/interface/menu_game_over.png');
        this.load.image('victory_menu', 'assets/interface/menu_victory01.png');
        this.load.image('credit_title', 'assets/interface/credit_title.png');
        this.load.image('button', 'assets/interface/bouton_ok.png');

        this.load.spritesheet('muteToggle', 'assets/interface/sound.png', 128, 128);
        this.load.spritesheet('buttonTower1', 'assets/interface/ui-btn-tower-1.png', 128, 128);
        this.load.spritesheet('buttonTower2', 'assets/interface/ui-btn-tower-2.png', 128, 128);
        this.load.spritesheet('buttonTower3', 'assets/interface/ui-btn-tower-3.png', 128, 128);
        this.load.spritesheet('barre_vie', 'assets/interface/barre_vie.png', 289, 84);
        this.load.spritesheet('jauge_vie', 'assets/interface/jauge_vie.png', 186, 33);
        this.load.spritesheet('barre_hudingame', 'assets/interface/barre_hudingame.png', 434, 89);

        // audio for background soundtrack
        this.load.audio('theme_relax', 'assets/sfx/theme_main_relax.ogg');
        this.load.audio('theme_fight', 'assets/sfx/theme_main_fight.ogg');
        this.load.audio('theme_defeat', 'assets/sfx/theme_defeat.ogg');
        this.load.audio('theme_victory', 'assets/sfx/theme_victory.ogg');
        // audio for the player
        this.load.audio('footstep', 'assets/sfx/player_footstep.ogg');
        this.load.audio('stick_attack', 'assets/sfx/player_attack_stick.ogg');
        // audio for "pig" enemy
        this.load.audio('enemy_pig_appears', 'assets/sfx/enemy_pig_appears.ogg');
        this.load.audio('enemy_pig_attack', 'assets/sfx/enemy_pig_attack.ogg');
        this.load.audio('enemy_pig_dies', 'assets/sfx/enemy_pig_dies.ogg');
        // audio for "eye" enemy
        this.load.audio('enemy_eye_attack', 'assets/sfx/enemy_ball_attack.ogg');
        this.load.audio('enemy_eye_move', 'assets/sfx/enemy_ball_rebound.ogg');
        // audio for tower 1
        this.load.audio('tower1_appears', 'assets/sfx/tower1_appears.ogg');
        this.load.audio('tower1_bites', 'assets/sfx/tower1_bites.ogg');
        // audio for boss
        this.load.audio('boss_step', 'assets/sfx/boss_step.ogg');
        this.load.audio('boss_attack', 'assets/sfx/boss_attack.ogg');

        this.load.tilemap('access_map', 'assets/maps/access.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function() {
        var tween = this.add.tween(this.background)
            .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        var tween = this.add.tween(this.preloadBar)
            .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startGame, this);
    },

    startGame: function() {
        this.game.state.start('MainMenu');
    }

};
