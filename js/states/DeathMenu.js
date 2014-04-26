App.DeathMenu = function(game) {
};

App.DeathMenu.prototype = {

    create: function() {
        var text1 = "You are dead !!!"
        var text2 = "Click to re-start";
        var style = { font: "22px Arial", fill: "white", align: "center" };
        this.add.text(this.world.centerX - 50, this.world.centerY - 120, text1, style);
        this.add.text(this.world.centerX - 50, this.world.centerY - 70, text2, style);

        this.input.onDown.addOnce(this.startGame, this);
    },

    update: function() {
    },

    startGame: function(pointer) {
        this.game.state.start('Game');
    }

};
