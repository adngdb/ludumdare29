Chopper.HUD = function(game) {

    this.game        = game;
    this.soundToggle = null;
    this.soundMuted  = false;
};

Chopper.HUD.prototype = {
    create: function() {
        this.soundToggle = this.game.add.button(this.game.width - 30, 15, 'button', this.toggleSound, this);
        this.soundToggle.fixedToCamera = true;
        this.muteSound();

        this.game.onPause.add(this.onGamePause, this);
        this.game.onResume.add(this.onGameResume, this);
    },

    update: function() {
    },

    render: function() {
        this.game.debug.renderSpriteBody(this.soundToggle);
    },

    toggleSound: function()
    {
        if (this.game.sound._muted) {
            this.unmuteSound();
        }
        else {
            this.muteSound();
        }
    },

    unmuteSound: function() {
        this.game.sound.mute   = false;
        this.soundMuted        = false;
        this.soundToggle.frame = 1;
    },

    muteSound: function() {
        this.game.sound.mute   = true;
        this.soundMuted        = true;
        this.soundToggle.frame = 0;
    },

    onGamePause: function() {
        this.game.sound.mute = true;
    },

    onGameResume: function() {
        if (!this.soundMuted) {
            this.game.sound.mute = false;
        }
    }
};