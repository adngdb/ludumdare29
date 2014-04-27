App.DeathMenu = function(game) {
    this.score = 0;
};

App.DeathMenu.prototype = {

    create: function() {

        this.gameOverBackground = this.game.add.sprite(this.world.centerX, this.world.centerY, 'game_over_menu');
        this.gameOverBackground.anchor.setTo(0.5, 0.5);

        var text1 = "You are dead !!!";
        var text2 = "Your score : " + this.score;
        var text3 = "Click to re-start";
        var style = { font: "32px custom", fill: "white", align: "center" };
        this.game.add.text(this.world.centerX - 100, this.world.centerY - 50, text1, style);
        this.game.add.text(this.world.centerX - 100, this.world.centerY, text2, style);
        this.game.add.text(this.world.centerX - 100, this.world.centerY + 50, text3, style);

        this.input.onDown.addOnce(this.startGame, this);

        this.music = this.game.add.audio('theme_defeat');
        this.music.play();
    },

    init: function(score) {
        this.score = score;

    },

    update: function() {
    },

    startGame: function(pointer) {
        this.music.stop();
        this.game.state.start('Game');
    }

};
