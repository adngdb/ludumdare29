App.VictoryMenu = function(game) {
};

App.VictoryMenu.prototype = {

    create: function() {
        var text1 = "You won !!!";
        var text2 = "Click to re-start";
        var style = { font: "22px Arial", fill: "white", align: "center" };
        this.add.text(this.world.centerX - 50, this.world.centerY - 120, text1, style);
        this.add.text(this.world.centerX - 50, this.world.centerY - 70, text2, style);

        this.input.onDown.addOnce(this.startGame, this);

        this.music = this.game.add.audio('theme_victory');
        this.music.loop = true;
        this.music.play();
    },

    init: function(score) {
        var text = "Your score : " + score;
        var style = { font: "22px Arial", fill: "white", align: "center" };
        this.add.text(this.world.centerX - 50, this.world.centerY - 20, text, style);

    },

    update: function() {
    },

    startGame: function(pointer) {
        this.game.state.start('Game');
    }

};
