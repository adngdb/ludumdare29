App.Game = function(game) {

    //When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game;      //a reference to the currently running game
    this.add;       //used to add sprites, text, groups, etc
    this.camera;    //a reference to the game camera
    this.cache;     //the game cache
    this.input;     //the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //for preloading assets
    this.math;      //lots of useful common math operations
    this.walkSound;     //the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //the game stage
    this.time;      //the clock
    this.tweens;    //the tween manager
    this.world;     //the game world
    this.particles; //the particle manager
    this.physics;   //the physics manager
    this.rnd;       //the repeatable random number generator
    //You can use any of these from any function within this State.
    //But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.player;
    this.hud;
    this.towerGroup;
    this.enemyGroup;

    this.choosenTowerType = null;
    this.towerHeight = 32;
    this.towerWidth  = 32;

    this.centerX = 1000 / 2;
    this.centerY = 800 / 2;
    this.RadiusX = this.centerX - 80;
    this.RadiusY = this.centerY - 120;

    this.numberWave;
    this.MAX_WAVE_NUMBER = 1;
    this.waveTimer;
    this.lastWave;
    this.waveCooldown;
    this.creatingWave;

    this.score;
};

App.Game.prototype = {

    preload: function() {
        this.player = new App.Player(this.game, this.game.world.width / 2, this.game.world.height / 2);
        this.hud    = new App.HUD(this.game, this.player);
    },

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.forceX = true;

        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.clickListener, this);

        var cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
        cKey.onDown.add(this.createEnemy, this);

        var cancelConstruction = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        cancelConstruction.onDown.add(this.cancelConstruction, this);

        this.game.add.existing(this.player);
        this.hud.create();

        this.towerGroup = this.game.add.group();
        this.towerGroup.enableBody = true;
        this.towerGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemyGroup = this.game.add.group();
        this.enemyGroup.enableBody = true;
        this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this.musicFight = this.game.add.audio('theme_fight');
        this.musicFight.loop = true;
        this.musicFight.volume = 0;
        this.musicRelax = this.game.add.audio('theme_relax');
        this.musicRelax.loop = true;
        this.musicRelax.volume = 0;
        // this.musicRelax.play();
        this.firstLoop = false;

        this.waveTimer = null;
        this.numberWave = 1;
        this.waveCooldown = 5;
        this.lastWave = this.game.time.now;
        this.creatingWave = false;

        this.score = 0;
    },

    update: function() {
        // check Player : End Of Game : player dead
        if (this.player.health <= 0) {
            this.player.stopWalkSound();
            this.musicFight.stop();
            this.musicRelax.stop();
            this.state.start('DeathMenu', true, false, this.score);
        }
        // check Enemy : dead ? newTarget ?
        for (var i = this.enemyGroup.length-1; i>=0; i--)
        {
            var currEnemy = this.enemyGroup.getAt(i);
            if (currEnemy.exists) {
                // is the enemy dead ?
                if (currEnemy.health <= 0) {
                    this.score++;
                    currEnemy.soundDies.play();
                    currEnemy.isTargeted = false;
                    currEnemy.kill();
                }
                else {
                    if (currEnemy.isTargeted) {
                        this.player.tryHit(currEnemy);
                        currEnemy.isTargeted = false;
                    }
                }
            }
        }

        // check Wave : End of game ? new one ?
        if (!this.creatingWave) {
            // compute : are there any enemy alive ?
            var index = this.enemyGroup.length-1;
            var enemy = this.enemyGroup.getAt(index);
            var win = true;
            while (win && index >= 0) {
                win = !enemy.exists;
                index--;
                enemy = this.enemyGroup.getAt(index);
            }
            if (win) {
                // if all enemy are dead
                if (this.musicFight.volume >= 0) {
                    this.musicFight.volume -= 0.01;
                    this.firstLoop = true;
                }
                else {
                    if (this.firstLoop) {
                        this.musicFight.stop();
                        this.musicRelax.play();

                        this.firstLoop = false;
                    }
                    if (this.musicRelax.volume <= 1) {
                        this.musicRelax.volume += 0.01;
                    }
                }

                if (this.numberWave > this.MAX_WAVE_NUMBER) {
                    this.player.stopWalkSound();
                    // Max number of wave reached and ALL enemy killed => VICTORY !!!
                    this.musicFight.stop();
                    this.musicRelax.stop();
                    this.state.start('VictoryMenu', true, false, this.score);
                }
                else {
                    // create next wave
                    if (!this.lastWave || this.game.time.elapsedSecondsSince(this.lastWave) > this.waveCooldown) {
                        this.createNewWave();
                        this.lastWave = this.game.time.now;
                    }
                }
            }
            else {
                // some enemy are alive : reset cooldown for next wave
                this.lastWave = this.game.time.now;
                if (this.musicRelax.volume >= 0) {
                    this.musicRelax.volume -= 0.01;
                    this.firstLoop = true;
                }
                else {
                    if (this.firstLoop) {
                        this.musicRelax.stop();
                        this.musicFight.play();
                        this.firstLoop = false;
                    }
                    if (this.musicFight.volume <= 1) {
                        this.musicFight.volume += 0.01;
                    }
                }
            }
        }

        // moving the player & collision
        this.game.physics.arcade.collide(this.player, this.enemyGroup);
        this.game.physics.arcade.collide(this.player, this.towerGroup,
            function (player, tower) {
                player.x -= player.body.deltaX();
                player.y -= player.body.deltaY();
                player.destination.setTo(player.x, player.y);
                if (tower.alpha == 0) {
                    tower.build = false;
                    tower.alpha = 1;
                    tower.init();
                    this.time.events.add(Phaser.Timer.SECOND * tower.CONSTRUCTION_DURATION,
                        function() {
                            this.player.building = false;
                            tower.build = true;
                        }, this
                    );
                }
            }, null, this
        );
        this.game.physics.arcade.collide(this.enemyGroup, this.towerGroup);
        this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);

        this.hud.update();

        // tower creation
        if (this.player.isInConstructMode) {
            // is the player in construction mode ?
            if (null == this.choosenTowerType) {
                this.choosenTowerType = this.game.add.sprite(this.input.x, this.input.y, this.player.towerTypeToConstruct);
                this.choosenTowerType.anchor.setTo(0.5, 0.5);
                this.choosenTowerType.alpha = 0.5;
            }
            this.choosenTowerType.x = this.input.x;
            this.choosenTowerType.y = this.input.y;
        }
        else {
            if (null != this.choosenTowerType) {
                this.choosenTowerType.destroy();
                this.choosenTowerType = null;
            }
        }
    },

    render: function() {
        this.hud.render();
    },

    quitGame: function(pointer) {
        this.state.start('MainMenu');
    },

    clickListener: function (element, pointer) {
        if (Phaser.Mouse.RIGHT_BUTTON == this.input.mouse.button) {
            this.cancelConstruction();
        }

        if (this.inArena() && !this.player.building) {
            this.player.moveToObject(new Phaser.Point(this.input.x, this.input.y));

            if (this.player.isInConstructMode) {
                // this.time.events.add(Phaser.Timer.SECOND * 3, this.constructTower, this);
                this.constructTower();
                this.player.building = true;
            }
        }
    },

    constructTower: function () {
        // // Get the first dead tower from the towerGroup
        var newTower = this.towerGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (newTower === null) {
            newTower = new App.Tower(this.game, this.input.x, this.input.y, this.player.towerTypeToConstruct, this.enemyGroup);
            this.towerGroup.add(newTower);
        }
        else {
            // Revive it
            newTower.revive();

            // Move the tower to the given coordinates
            newTower.x = this.input.x;
            newTower.y = this.input.y;
        }
        this.player.deactivateConstructMode();
        newTower.alpha = 0;
    },

    cancelConstruction: function () {
        if (null != this.choosenTowerType) {
            this.choosenTowerType.destroy();
            this.choosenTowerType = null;
            this.player.deactivateConstructMode();
        }
    },

    createNewWave: function() {
        if (this.waveTimer !== null) this.waveTimer.destroy();
        this.waveTimer = this.game.time.create();
        this.waveTimer.repeat(500, this.numberWave * 5, this.createEnemy, this);
        this.waveTimer.start();
        this.creatingWave = true;
        this.numberWave++;
    },

    createEnemy: function() {
        var newEnemy = this.enemyGroup.getFirstDead();
        var param = Math.random();
        var newX = this.centerX + (this.RadiusX + 50) * Math.cos(param * 2 * Math.PI);
        var newY = this.centerY + (this.RadiusY + 50) * Math.sin(param * 2 * Math.PI);
        if (newEnemy === null) {
            newEnemy = new App.Enemy(this.game, newX, newY, this.player);
            this.enemyGroup.add(newEnemy);
        }
        else {
            newEnemy.x = newX;
            newEnemy.y = newY;
            newEnemy.revive();
        }
        this.creatingWave = false;
        newEnemy.init();
    },

    inArena: function () {
        // var inArena = true;
        var relX = this.input.x - this.centerX;
        var relY = this.input.y - this.centerY;

        var det = (relX / this.RadiusX) * (relX / this.RadiusX) + (relY / this.RadiusY) * (relY / this.RadiusY);

        return (det <= 1);
    }
};
