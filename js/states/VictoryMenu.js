App.VictoryMenu = function(game) {
};

App.VictoryMenu.prototype = {

    create: function() {
//        var text1 = "You won !!!";
//        var text2 = "Click to re-start";
//        var style = { font: "22px Arial", fill: "white", align: "center" };
//        this.add.text(this.world.centerX - 50, this.world.centerY - 120, text1, style);
//        this.add.text(this.world.centerX - 50, this.world.centerY - 70, text2, style);

        this.background = this.game.add.sprite(0, 0, 'background');

        this.victoryBackground = this.game.add.sprite(this.world.centerX, this.world.centerY, 'victory_menu');
        this.victoryBackground.anchor.setTo(0.5, 0.5);

        this.input.onDown.addOnce(this.startGame, this);

        this.victorySound = this.game.add.audio('theme_victory');
        this.victorySound.play();

        this.mainSound = this.game.add.audio('theme_fight');
        this.mainSound.loop = true;
        this.time.events.add(this.victorySound.duration, function () { this.mainSound.play(); }, this);
    },

    init: function(score) {
//        var text = "Your score : " + score;
//        var style = { font: "22px Arial", fill: "white", align: "center" };
//        this.add.text(this.world.centerX - 50, this.world.centerY - 20, text, style);

    },

    update: function() {
    },

    startGame: function(pointer) {
        this.mainSound.stop();
        this.game.state.start('Game');
    }

};
