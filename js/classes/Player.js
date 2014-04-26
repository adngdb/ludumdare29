App.Player = function(game) {

    this.game = game;
    this.isInConstructMode;
};

App.Player.prototype = {

    create: function() {
        this.player = this.game.add.sprite(100, 100, 'player');
        this.player.scale.x = 0.5;
        this.player.scale.y = 0.5;

        this.isInConstructMode = false;

        var key= this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        key.onDown.add(this.activateConstructMode, this);
        key.onUp.add(this.deactivateConstructMode, this);
    },

    update: function() {

    },

    render: function() {
    },

    activateConstructMode: function() {
        this.isInConstructMode = true;
    },

    deactivateConstructMode: function() {
        this.isInConstructMode = false;
    }
};
