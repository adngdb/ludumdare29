App.Player = function(game) {

    this.game = game;
};

App.Player.prototype = {

    create: function() {
        this.player = this.game.add.sprite(100, 100, 'player');
        this.player.scale.x = 0.5;
        this.player.scale.y = 0.5;
    },

    update: function() {
    },

    render: function() {
    }
};
