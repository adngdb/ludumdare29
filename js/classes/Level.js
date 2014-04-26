Chopper.Level = function(game) {

    this.game    = game;
    this.map     = null;
    this.layer   = null;
};

Chopper.Level.prototype = {
    create: function() {
        this.game.add.sprite(0, 0, 'background');
        this.game.add.sprite(720, 0, 'background');
        this.game.add.sprite(1440, 0, 'background');

        this.map = this.game.add.tilemap('ground');
        this.map.addTilesetImage('ground', 'tiles');
        this.map.setCollisionBetween(0, 9);

        this.layer = this.map.createLayer('ground', 720, 384);

        this.game.world.setBounds(0, 0, 2160, 384);
    },

    update: function() {
    },

    render: function() {
    }
};