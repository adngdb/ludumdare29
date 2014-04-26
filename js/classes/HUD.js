App.HUD = function(game, player) {

    this.game = game;
    this.player = player;
};

App.HUD.prototype = {
    create: function() {
        this.soundToggle = this.game.add.button(this.game.width - 50, 15, 'muteToggle', this.toggleSound, this);
        this.muteSound();

        this.chooseTowerButton = this.game.add.button(this.game.width / 2, 15, 'buttonTower1', this.chooseTower, this);
        this.chooseTowerButton.type = 'tower';
    },

    update: function() {
    },

    render: function() {
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

    chooseTower: function(element) {
        this.player.setChoosenTowerType(element.type);
    }
};