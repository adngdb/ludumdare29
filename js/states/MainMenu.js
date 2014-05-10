App.MainMenu = function(game) {
};

App.MainMenu.prototype = {

    create: function() {
        this.titleMenu = this.game.add.sprite(0, 0, 'title_menu');

        this.soundToggle = this.game.add.button(this.game.width - 74, 0, 'muteToggle', this.toggleSound, this);
        this.soundToggle.scale.set(0.5, 0.5);

        var startButtonTexture = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'button');
        startButtonTexture.anchor.set(0.5, 0.5);

        var bitmapStartButton = this.game.add.bitmapData(369, 64);
        bitmapStartButton.ctx.beginPath();
        bitmapStartButton.ctx.rect(0, 0, 369, 64);

        var startButton = this.game.add.sprite(startButtonTexture.x, startButtonTexture.y, bitmapStartButton);
        startButton.anchor.set(0.5, 0.5);
        startButton.inputEnabled = true;
        startButton.input.priorityID = 2;
        startButton.name = "start";
        startButton.events.onInputDown.add(this.startGame, this);
        startButton.events.onInputOver.add(this.overButton, this);
        startButton.events.onInputOut.add(this.outButton, this);

        var style = { font: "64px custom", fill: "#F39E37", align: "center" };

        this.startText = this.game.add.text(startButtonTexture.x, startButtonTexture.y, "START", style);
        this.startText.anchor.set(0.5, 0.5);

        var creditsButtonTexture = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 105, 'button');
        creditsButtonTexture.anchor.set(0.5, 0.5);

        var bitmapCreditsButton = this.game.add.bitmapData(369, 64);
        bitmapCreditsButton.ctx.beginPath();
        bitmapCreditsButton.ctx.rect(0, 0, 369, 64);

        var creditsButton = this.game.add.sprite(creditsButtonTexture.x, creditsButtonTexture.y, bitmapCreditsButton);
        creditsButton.anchor.set(0.5, 0.5);
        creditsButton.inputEnabled = true;
        creditsButton.input.priorityID = 2;
        creditsButton.name = "credits";
        creditsButton.events.onInputDown.add(this.openCredits, this);
        creditsButton.events.onInputOver.add(this.overButton, this);
        creditsButton.events.onInputOut.add(this.outButton, this);

        this.creditsText = this.game.add.text(creditsButtonTexture.x, creditsButtonTexture.y, "CREDITS", style);
        this.creditsText.anchor.set(0.5, 0.5);

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
    },

    openCredits: function() {
        this.game.state.start('Credits');
    },

    overButton: function(element) {
        var fillColor = "#794B23";
        switch(element.name) {
            case "start":
                this.startText.fill = fillColor;
                break;
            case "credits":
                this.creditsText.fill = fillColor;
                break;
        }
    },

    outButton: function(element) {
        var fillColor = "#F39E37";
        switch(element.name) {
            case "start":
                this.startText.fill = fillColor;
                break;
            case "credits":
                this.creditsText.fill = fillColor;
                break;
        }
    }
};
