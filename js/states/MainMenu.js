Chopper.MainMenu = function(game) {
};

Chopper.MainMenu.prototype = {

    create: function() {
        this.game.add.sprite(0, 0, 'background');

        var text  = "Click to start";
        var style = { font: "22px Arial", fill: "white", align: "center" };
        this.add.text(this.world.centerX - 50, this.world.centerY - 20, text, style);

        this.input.onDown.addOnce(this.startGame, this);
    },

    update: function() {
    },

    startGame: function(pointer) {
        this.game.state.start('Game');
    }

};
