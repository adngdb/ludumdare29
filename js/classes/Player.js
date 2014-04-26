App.Player = function(game) {

    this.game = game;
    this.isInConstructMode;
};

App.Player.prototype = {

    create: function() {
        this.sprite = this.game.add.sprite(100, 100, 'player');
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;
        this.sprite.anchor.setTo(0.5, 0.5);

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
