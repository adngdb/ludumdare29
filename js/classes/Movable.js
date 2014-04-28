App.Movable = function (game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);

    this.game = game;

    this.SPEED = 60; // in pixels per second

    // Enable physics on the movable.
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.walkSound = null;

    this.path = {
        next: null,
        prev: null,
        pathStack: []
    };
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

App.Movable.prototype.moveToObject = function (dest) {
    this.game.physics.arcade.moveToObject(this, dest, this.SPEED);
    // this.game.debug.geom(new Phaser.Line(this.body.x, this.body.y, dest.x, dest.y));

    var dir = this.getCardinalDirection();
    this.currAnim = this.animations.play('walk-' + dir, 12, true);

    if (this.walkSound) {
        this.walkSound.resume();
    }
};

App.Movable.prototype.stopMoving = function () {
    // if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
    //     return;
    // }

    this.body.velocity.setTo(0, 0);
    this.path.prev = null;
    this.path.next = null;
    this.path.pathStack = [];

    if (!this.building && !this.attacking) {
        this.animations.stop(null, true);
    }

    if (this.walkSound) {
        this.walkSound.pause();
    }
};

App.Movable.prototype.setPath = function (path) {
    if (this.path.pathStack.length !== 0) {
        this.path.pathStack = [];
    }
    this.path.pathStack = this.path.pathStack.concat(path);
};

App.Movable.prototype._preparePath = function () {
    if (this.path.pathStack.length === 0) {
        return;
    }

    if (this.path.prev === null) {
        this.path.prev = new Phaser.Point(this.body.x, this.body.y);
    }

    if (this.path.next === null) {
        this.path.next = this.path.pathStack.shift();

        this.moveToObject(this.path.next);
    }
};

App.Movable.prototype.followPath = function () {
    this._preparePath();

    if (this.path.next === null) {
        return;
    }

    var stepVector = new Phaser.Point(
        this.path.next.x - this.path.prev.x,
        this.path.next.y - this.path.prev.y
    );
    var currentVector = new Phaser.Point(
        this.path.next.x - this.body.x,
        this.path.next.y - this.body.y
    );

    if ((stepVector.x * currentVector.x < 0) || (stepVector.y * currentVector.y < 0)) {
        // It's time to proceed to the next step of the path.
        this.path.prev = null;
        this.path.next = null;

        if (this.path.pathStack.length === 0) {
            this.stopMoving();
            return;
        }

        this._preparePath();
    }
};
