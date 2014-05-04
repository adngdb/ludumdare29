App.MainMenu = function(game) {
};

App.MainMenu.prototype = {

    create: function() {
        this.titleMenu = this.game.add.sprite(0, 0, 'title_menu');

        this.soundToggle = this.game.add.button(this.game.width - 74, 0, 'muteToggle', this.toggleSound, this);
        this.soundToggle.scale.set(0.5, 0.5);

        // create a new bitmap data object
        var bitmapButton = this.game.add.bitmapData(300,64);

        // draw to the canvas context like normal
        bitmapButton.ctx.beginPath();
        bitmapButton.ctx.rect(0, 0, 300, 64);

        // use the bitmap data as the texture for the sprite
        var startButton = this.game.add.sprite(360, 360, bitmapButton);
        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(this.startGame, this);

        this.menuSound = this.game.add.audio('theme_menu');
        this.menuSound.loop = true;
        this.menuSound.play();
    },

    update: function() {
    },

    startGame: function () {
        this.menuSound.stop();
        this.menuSound.volume = 0;
        this.game.state.start('Game');
    },

    toggleSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        this.soundMuted = !this.soundMuted;
        this.soundToggle.frame = 1 - this.soundToggle.frame;
    }
};
