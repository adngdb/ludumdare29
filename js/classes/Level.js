App.Level = function(game) {

    this.game = game;
};

App.Level.prototype = {
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.movePlayer, this);
    },

    update: function() {
    },

    render: function() {
    },

    movePlayer: function () {
        App.Game.player.add.tween(sprite).to({ x: 600 }, 2000, Phaser.Easing.Linear.None);
    }

};
