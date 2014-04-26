App.Player = function(game) {

    this.game = game;
    this.targetX;
    this.targetY;
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
        console.log('true');
        this.isInConstructMode = true;
    },

    deactivateConstructMode: function() {
        console.log('false');
        this.isInConstructMode = false;
    }
};
