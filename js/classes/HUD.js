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

        var tKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
        tKey.onDown.add(this.shortcutChooseTower, this);

        var text  = "T";
        var style = { font: "16px Arial", fill: "white", align: "center" };
        var towerShortcut = this.game.add.text(this.chooseTowerButton.x + 18, this.chooseTowerButton.y + 45, text, style);
        towerShortcut.anchor.set(0.5);
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
    },

    shortcutChooseTower: function(key) {
        switch(key.keyCode) {
            case Phaser.Keyboard.T:
                this.chooseTower({'type' : 'tower'});
                break;
        }
    }
};