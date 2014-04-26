App.Player = function(game) {

    this.game = game;
    this.targetX;
    this.targetY;
};

App.Player.prototype = {

    create: function() {
        this.sprite = this.game.add.sprite(100, 100, 'player');
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;
        // this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    },

    update: function() {
            // console.log("update : POS = " + this.targetX);

        if (this.targetX-this.sprite.x < 10 && this.targetX-this.sprite.x > -10) {


            // Phaser.Rectangle.contains (this.sprite, this.targetX, this.targetY) ){
            // console.log("ICI : velocity = " + this.sprite.body.velocity.x);
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.x = this.targetX;
            this.sprite.y = this.targetY;
            // console.log("ICI : velocity = " + this.sprite.body.velocity.x);
        }
    },

    render: function() {
    }
};
