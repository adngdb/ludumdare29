App.Level = function(game) {

    this.game = game;
};

App.Level.prototype = {
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
    },

    update: function() {
    },

    render: function() {
    }
};