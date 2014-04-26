Chopper = {};

Chopper.Boot = function(game) {
};

Chopper.Boot.prototype = {

    preload: function() {
        this.load.image('preloaderBackground', 'assets/interface/preloader_background.gif');
        this.load.image('preloaderBar', 'assets/interface/preloader_bar.png');
    },

    create: function() {
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

        this.game.input.maxPointers = 1;

        if(this.game.device.desktop)
        {
            //If you have any desktop specific settings, they can go in here
            this.game.stage.scale.pageAlignHorizontally = true;
        }
        else
        {
            //Same goes for mobile settings.
            //In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }

        //By this point the preloader assets have loaded to the cache, we've set the game settings
        //So now let's start the real preloader going
        this.game.state.start('Preloader');
    }
};
