App.DeathMenu = function(game) {
};

App.DeathMenu.prototype = {

    create: function() {
//        var text1 = "You are dead !!!";
//        var text2 = "Click to re-start";
//        var style = { font: "22px Arial", fill: "white", align: "center" };
//        this.add.text(this.world.centerX - 50, this.world.centerY - 120, text1, style);
//        this.add.text(this.world.centerX - 50, this.world.centerY - 70, text2, style);

        this.gameOverBackground = this.game.add.sprite(this.world.centerX, this.world.centerY, 'game_over_menu');
        this.gameOverBackground.anchor.setTo(0.5, 0.5);

        this.input.onDown.addOnce(this.startGame, this);

        this.music = this.game.add.audio('theme_defeat');
        this.music.play();
    },

    init: function(score) {
//        var text = "Your score : " + score;
//        var style = { font: "22px Arial", fill: "white", align: "center" };
//        this.add.text(20, 20, text, style);

    },

    update: function() {
    },

    startGame: function(pointer) {
        this.music.stop();
        this.game.state.start('Game');
    }

};
