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
    this.MAX_WAVE_NUMBER = 3;
    this.waveTimer;
    this.lastWave;
    this.waveCooldown;
    this.creatingWave;

    this.score;

    this.map;
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
        this.firstLoop = false;

        this.waveTimer = null;
        this.numberWave = 1;
        this.waveCooldown = 5;
        this.lastWave = this.game.time.now;
        this.creatingWave = false;

        this.score = 0;

        this.map = this.game.add.tilemap('access_map');
        this.map.setCollisionBetween(1, 2);
        this.access_layer = this.map.createLayer('access_map');
        // this.access_layer.debug = true;

        this.walkableTiles = [3];
        this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        // this.pathfinder._easyStar.enableDiagonals();
        this.pathfinder.setGrid(this.access_layer.layer.data, this.walkableTiles);

        this.TIME_BETWEEN_PATH_COMPUTATION = 1; // in seconds
    },

    update: function() {
        // check Player : End Of Game : player dead
        if (this.player.health <= 0) {
            this.stopSound();
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
                    currEnemy.stopMoving();
                    currEnemy.kill();
                }
                else {
                    if (currEnemy.isTargeted) {
                        this.player.tryHit(currEnemy);
                        currEnemy.isTargeted = false;
                    }

                    if (
                        !currEnemy.lastPathComputation ||
                        this.game.time.elapsedSecondsSince(currEnemy.lastPathComputation) > this.TIME_BETWEEN_PATH_COMPUTATION
                    ) {
                        var targetTile = this.map.getTileWorldXY(this.player.x, this.player.y);
                        this.computePath(currEnemy, targetTile);

                        currEnemy.lastPathComputation = this.game.time.now;
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
                    if (this.musicRelax.volume <= 0.75) {
                        this.musicRelax.volume += 0.01;
                    }
                }

                if (this.numberWave > this.MAX_WAVE_NUMBER) {
                    // Max number of wave reached and ALL enemy killed => VICTORY !!!
                    this.stopSound();
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
                    if (this.musicFight.volume <= 0.75) {
                        this.musicFight.volume += 0.01;
                    }
                }
            }
        }

        // moving the player & collision
        this.game.physics.arcade.collide(this.player, this.access_layer);
        this.game.physics.arcade.collide(this.player, this.enemyGroup);
        this.game.physics.arcade.collide(this.player, this.towerGroup,
            function (player, tower) {
                if (tower.alpha == 0.9) {
                    tower.build = false;
                    tower.alpha = 1;
                    tower.init();
                    player.setBuildMode(tower);
                    player.stopMoving();
                    this.time.events.add(Phaser.Timer.SECOND * tower.CONSTRUCTION_DURATION, player.endBuildMode, player, tower);
                }
            }, null, this
        );
        this.game.physics.arcade.collide(this.enemyGroup, this.towerGroup,
            function (enemy, tower) {
                enemy.target = tower;
            }, null, this
        );
        this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);

        this.hud.update();

        // tower creation
        if (this.player.isInConstructMode) {
            // is the player in construction mode ?
            if (null == this.choosenTowerType) {
                this.choosenTowerType = this.game.add.sprite(this.input.x, this.input.y, this.player.towerTypeToConstruct);
                this.choosenTowerType.anchor.setTo(0.5, 3.0 / 4.0);
                this.choosenTowerType.alpha = 0.5;
            }

            var targetTile = this.map.getTileWorldXY(this.input.x, this.input.y);
            this.choosenTowerType.x = targetTile.worldX + targetTile.width / 2;
            this.choosenTowerType.y = targetTile.worldY + targetTile.height / 2;
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

        if (!this.player.building && !this.player.attacking) {
            var targetTile = this.map.getTileWorldXY(this.input.x, this.input.y);
            this.computePath(this.player, targetTile);

            if (this.player.isInConstructMode && targetTile.index === 3) {
                this.constructTower();
                // this.player.building = true;
            }
        }
    },

    constructTower: function () {
        // // Get the first dead tower from the towerGroup
        var newTower = this.towerGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (newTower === null) {
            newTower = new App.Tower(
                this.game,
                this.choosenTowerType.x,
                this.choosenTowerType.y,
                this.player.towerTypeToConstruct,
                this.enemyGroup
            );
            this.towerGroup.add(newTower);
        }
        else {
            // Revive it
            newTower.revive();

            // Move the tower to the given coordinates
            newTower.x = this.choosenTowerType.x;
            newTower.y = this.choosenTowerType.y;
        }

        // Add the tower to the collision map.
        var tile = this.map.getTileWorldXY(this.choosenTowerType.x, this.choosenTowerType.y);
        var surroundingTiles = [
            tile,
            this.map.getTileAbove(0, tile.x, tile.y),
            this.map.getTileBelow(0, tile.x, tile.y),
            this.map.getTileRight(0, tile.x, tile.y),
            this.map.getTileLeft(0, tile.x, tile.y),
        ];

        for (var i = surroundingTiles.length - 1; i >= 0; i--) {
            if (surroundingTiles[i]) {
                surroundingTiles[i].index = 1;
                surroundingTiles[i].collideDown = true;
                surroundingTiles[i].collideLeft = true;
                surroundingTiles[i].collideRight = true;
                surroundingTiles[i].collideUp = true;
            }
        }
        this.pathfinder.setGrid(this.access_layer.layer.data, this.walkableTiles);

        this.player.deactivateConstructMode();
        newTower.alpha = 0.9;
        newTower.setBaseBuildingFrame();
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

        var numberEnemiesInWave = this.numberWave * 5;

        this.waveTimer = this.game.time.create();
        this.waveTimer.repeat(500, numberEnemiesInWave, this.createEnemy, this, false);
        this.waveTimer.start();

        if (this.MAX_WAVE_NUMBER <= this.numberWave) {
            this.game.time.events.add(500 * Math.round(numberEnemiesInWave / 2), this.createEnemy, this, true);
        }

        this.creatingWave = true;
        this.numberWave++;
    },

    createEnemy: function(createBoss) {
        var param = Math.random();
        var newX = this.centerX + (this.RadiusX + 50) * Math.cos(param * 2 * Math.PI);
        var newY = this.centerY + (this.RadiusY + 50) * Math.sin(param * 2 * Math.PI);

        var newEnemy = this.enemyGroup.getFirstDead();
        if (createBoss) {
            newEnemy = new App.Boss(this.game, newX, newY, 'boss', this.player);
            this.enemyGroup.add(newEnemy);
        }

        if (newEnemy === null) {
            newEnemy = new App.Enemy(this.game, newX, newY, 'enemy1', this.player);
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

    computePath: function (fromObject, toTile) {
        var self = this;
        var fromTile = this.map.getTileWorldXY(fromObject.x, fromObject.y);

        this.pathfinder.setCallbackFunction(function(path) {
            path = path || [];

            if (path.length === 0) {
                return;
            }

            var i = 0;
            var ln = path.length;
            var optimizedPath = [path[0]];
            var foundACollision;

            // for (i = 0; i < ln - 1; i++) {
            //     self.game.debug.geom(new Phaser.Line(path[i].x * 16, path[i].y * 16, path[i + 1].x * 16, path[i + 1].y * 16));
            // }

            // i = 0;

            while (i < ln - 2) {
                foundACollision = false;

                for (var j = i + 2; j < ln; j++) {
                    var currentStep = path[i];
                    var nextNextStep = path[j];

                    var line = new Phaser.Line(currentStep.x * 16, currentStep.y * 16, nextNextStep.x * 16, nextNextStep.y * 16);
                    if (self.access_layer.getRayCastTiles(line, 16, true).length > 0) {
                        i = j - 1;
                        optimizedPath.push(path[i]);
                        foundACollision = true;
                        break;
                    }
                }

                if (!foundACollision) {
                    break;
                }
            }

            optimizedPath.push(path[ln - 1]);

            // for (i = 0; i < optimizedPath.length - 1; i++) {
            //     self.game.debug.geom(new Phaser.Line(optimizedPath[i].x * 16, optimizedPath[i].y * 16,
            //         optimizedPath[i + 1].x * 16, optimizedPath[i + 1].y * 16));
            // }

            optimizedPath.shift();

            // Convert tiles coordinates to real world coordinates.
            var realWorldPath = [];
            for (i = 0, ln = optimizedPath.length; i < ln; i++) {
                var step = self.map.getTile(optimizedPath[i].x, optimizedPath[i].y);
                realWorldPath.push(new Phaser.Point(step.worldX + step.width / 2, step.worldY + step.height / 2));
            };

            fromObject.stopMoving();
            fromObject.setPath(realWorldPath);
        });

        this.pathfinder.preparePathCalculation([fromTile.x, fromTile.y], [toTile.x, toTile.y]);
        this.pathfinder.calculatePath();
    },

    stopSound: function() {
        this.player.stopWalkSound();
        this.enemyGroup.callAll('stopWalkSound');
        this.musicFight.stop();
        this.musicRelax.stop();
    }
};
