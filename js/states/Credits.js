App.Credits = function(game) {
};

App.Credits.prototype = {

    create: function() {
        this.game.add.sprite(0, 0, 'credit_title');

        this.soundToggle = this.game.add.button(this.game.width - 74, 0, 'muteToggle', this.toggleSound, this);
        this.soundToggle.scale.set(0.5, 0.5);

        var style = { font: "32px custom", fill: "#794B23", align: "center" };
        var text1  = "Back";
        this.towerShortcut = this.game.add.text(100, 720, text1, style);
        this.towerShortcut.anchor.set(0.5);
        this.towerShortcut.inputEnabled = true;
        this.towerShortcut.events.onInputDown.add(this.returnToMainMenu, this);
        this.towerShortcut.events.onInputOver.add(this.overBackButton, this);
        this.towerShortcut.events.onInputOut.add(this.outBackButton, this);
    },

    toggleSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        this.soundMuted = !this.soundMuted;
        this.soundToggle.frame = 1 - this.soundToggle.frame;
    },

    overBackButton: function() {
        this.towerShortcut.fill = "#F39E37";
    },

    outBackButton: function() {
        this.towerShortcut.fill = "#794B23";
    },

    returnToMainMenu: function() {
        this.game.state.start('MainMenu');
    }
};
