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
    this.towerGroup;

    this.towerHeight = 32;
    this.towerWidth  = 32;

};

App.Game.prototype = {

    preload: function() {
        this.player = new App.Player(this.game, 100, 100);
        this.enemy  = new App.Enemy(this.game, 500, 500, this.player);
        this.hud    = new App.HUD(this.game);
    },

    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.clickListener, this);

        this.game.add.existing(this.player);
        this.game.add.existing(this.enemy);
        this.hud.create();

        this.towerGroup = this.game.add.group();
    },

    update: function() {
        this.hud.update();
    },

    render: function() {
        this.hud.render();
    },

    quitGame: function(pointer) {
        this.state.start('MainMenu');
    },

    clickListener: function () {
        if (this.inArena()) {
            var length = Math.sqrt ( (this.input.x - this.player.x) * (this.input.x - this.player.x)
                             + (this.input.y - this.player.y) * (this.input.y - this.player.y) ) / 0.3;
            this.game.add.tween(this.player).to( { x: this.input.x, y: this.input.y }, length, Phaser.Easing.Linear.None, true);

            if (this.player.isInConstructMode) {
                //this.time.events.add(Phaser.Timer.SECOND * 3, this.constructTower, this);
                this.constructTower();
            }
        }
    },

    constructTower: function () {
        // // Get the first dead tower from the towerGroup
        var newTower = this.towerGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (newTower === null) {
            newTower = new App.Tower(this.game);
            this.towerGroup.add(newTower);
        }

        // Revive it
        newTower.revive();

        // Move the tower to the given coordinates
        newTower.x = this.input.x;
        newTower.y = this.input.y;
    },

    inArena: function () {
        // var inArena = true;
        var relX = this.input.x - 1000 / 2;
        var relY = this.input.y - 800 / 2;
        var width = 1000 / 2 - 120;
        var length = 800 / 2 - 80;

        var det = (relX / width) * (relX / width) + (relY / length) * (relY / length);

        if (det <= 1) {
            return true;
        } else {
            return false;
        }
    }
};
