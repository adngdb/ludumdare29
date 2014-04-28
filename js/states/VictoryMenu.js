App.VictoryMenu = function(game) {
    this.score = 0;
};

App.VictoryMenu.prototype = {

    create: function() {

        this.victoryBackground = this.game.add.sprite(this.world.centerX, this.world.centerY, 'victory_menu');
        this.victoryBackground.anchor.setTo(0.5, 0.5);

        var text1 = "You won !!!";
        var text2 = "Your score : " + this.score;
        var text3 = "Click to re-start";
        var style = { font: "32px custom", fill: "white", align: "center" };
        this.game.add.text(this.world.centerX - 50, this.world.centerY - 120, text1, style);
        this.game.add.text(this.world.centerX - 50, this.world.centerY - 70, text2, style);
        this.game.add.text(this.world.centerX - 50, this.world.centerY - 20, text3, style);

        this.input.onDown.addOnce(this.startGame, this);

        this.victorySound = this.game.add.audio('theme_victory');
        this.victorySound.loop = true;
        this.victorySound.play();
    },

    init: function(score) {
        this.score = score;
    },

    update: function() {
    },

    startGame: function(pointer) {
        this.victorySound.stop();
        this.game.state.start('Game');
    }

};
