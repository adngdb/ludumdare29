App.Game = function(game) {

    //When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game;      //a reference to the currently running game
    this.add;       //used to add sprites, text, groups, etc
    this.camera;    //a reference to the game camera
    this.cache;     //the game cache
    this.input;     //the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //for preloading assets
    this.math;      //lots of useful common math operations
    this.sound;     //the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //the game stage
    this.time;      //the clock
    this.tweens;    //the tween manager
    this.world;     //the game world
    this.particles; //the particle manager
    this.physics;   //the physics manager
    this.rnd;       //the repeatable random number generator
    //You can use any of these from any function within this State.
    //But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.enemy;
    this.player;
    this.hud;
    this.towers;

    this.towerHeight = 32;
    this.towerWidth  = 32;

};

App.Game.prototype = {

    preload: function() {
        this.player = new App.Player(this.game);
        this.enemy  = new App.Enemy(this.game);
        this.hud    = new App.HUD(this.game);
    },

    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.clickListener, this);

        this.player.create();
        this.enemy.create();
        this.hud.create();

        this.towers = this.game.add.group();
    },

    update: function() {
        this.player.update();
        this.enemy.update();
        this.hud.update();
    },

    render: function() {
        this.player.render();
        this.enemy.render();
        this.hud.render();
    },

    quitGame: function(pointer) {
        this.state.start('MainMenu');
    },

    clickListener: function () {
        if (this.inArena(this.game.input.position)) {
            this.game.add.tween(this.player.sprite).to( { x: this.input.x, y: this.input.y }, 2000, Phaser.Easing.Linear.None, true);

            if (this.player.isInConstructMode) {
                this.createTower();
            }
        }
    },

    createTower: function () {
        console.log("create tower");
        console.log(this.towers.length);
        var tower  = this.towers.create(position.x - this.towerHeight, position.y - this.towerWidth, 'tower');
        tower.name = 'tower' + this.towers.length;
    },

    inArena: function (position) {
        var inArena = false;

        return inArena;
    }
};
