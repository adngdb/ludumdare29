App.Player = function(game) {

    this.game = game;
};

App.Player.prototype = {

    create: function() {
        this.sprite = this.game.add.sprite(100, 100, 'player');
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;
    },

    update: function() {

    },

    render: function() {
    }
};
