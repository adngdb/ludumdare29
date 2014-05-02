App.VictoryMenu = function(game) {
    this.score = 0;
};

App.VictoryMenu.prototype = {

    create: function() {
        this.victoryBackground = this.game.add.sprite(this.world.centerX, this.world.centerY, 'victory_menu');
        this.victoryBackground.anchor.setTo(0.5, 0.5);

        var text1 = "You won!";
        var text2 = "Score: " + this.score;
        var text3 = "Click to restart";

        var style = { font: "32px custom", fill: "white", align: "center" };
        var styleSmall = { font: "24px custom", fill: "white", align: "center" };

        this.game.add.text(this.world.centerX - 60, this.world.centerY - 50, text1, style);
        this.game.add.text(this.world.centerX - 70, this.world.centerY, text2, style);
        this.game.add.text(this.world.centerX - 90, this.world.centerY + 150, text3, styleSmall);

        this.input.onDown.addOnce(this.startGame, this);

        this.victorySound = this.game.add.audio('theme_victory');
        this.victorySound.loop = true;
        this.victorySound.play();
    },

    init: function(score) {
        this.score = score;
    },

    startGame: function(pointer) {
        this.victorySound.stop();
        this.game.state.start('Game');
    }
};
