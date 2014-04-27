App.Movable = function (game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);

    this.game = game;

    this.SPEED = 60; // in pixels per second

    // Enable physics on the movable.
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
};

// Movable is a type of Phaser.Sprite
App.Movable.prototype = Object.create(Phaser.Sprite.prototype);
App.Movable.prototype.constructor = App.Movable;

App.Movable.prototype.range = function (start, stop) {
    var arr = [];
    for (var i = start; i < stop; i++) {
        arr.push(i);
    };
    return arr;
};

App.Movable.prototype.getCardinalDirection = function (source, dest) {
    var dx, dy;

    if (typeof source === 'undefined') {
        dx = this.body.velocity.x;
        dy = this.body.velocity.y;
    }
    else {
        dx = dest.x - source.x;
        dy = dest.y - source.y;
    }

    var directions = 4;
    var degree = 360 / directions;
    var angle = Math.atan2(dy, dx) * 180.0 / Math.PI;
    angle = angle + degree / 2;
    if (angle < 0) {
        angle += 360;
    }

    if (angle >= 0 * degree && angle < 1 * degree) {
        return "e";
    }
    if (angle >= 1 * degree && angle < 2 * degree) {
        return "s";
    }
    if (angle >= 2 * degree && angle < 3 * degree) {
        return "w";
    }
    if (angle >= 3 * degree && angle < 4 * degree) {
        return "n";
    }
    //Should never happen:
    console.warning("It's NOT supposed to do THAT");
    return "s";
};
