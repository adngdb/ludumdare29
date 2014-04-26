App.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;
};

App.Preloader.prototype = {

    preload: function() {
        this.background = this.add.sprite(0, 0, 'preloaderBackground');
        this.preloadBar = this.add.sprite(this.world.width - (this.world.width / 2) - 150, 50, 'preloaderBar');

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('player', 'assets/gfx/player.png');

        //background
        this.load.image('background', 'assets/gfx/background.png');
    },

    create: function() {
        this.game.state.start('MainMenu');
    }

};
