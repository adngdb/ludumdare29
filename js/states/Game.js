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

    this.towerToConstruct = null;
    this.towerHeight = 32;
    this.towerWidth  = 32;

    this.MIN_DISTANCE_TO_BUILD_TOWER = 30; // in pixels
    this.MAX_WAVE_NUMBER = 3;

    this.numberWave;
    this.waveTimer;
    this.lastWave;
    this.waveCooldown;
    this.creatingWave;

    this.score;

    this.map;
};

App.Game.prototype = {

    preload: function() {
        this.player = new App.Player(this.game, this.world.centerX, this.world.centerY);
        this.hud = new App.HUD(this.game, this.player);

        this.RadiusX = this.world.centerX - 80;
        this.RadiusY = this.world.centerY - 120;
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

        this.allObjectsGroup = this.game.add.group();
        this.allObjectsGroup.enableBody = true;
        this.allObjectsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this.allObjectsGroup.add(this.player);

        // Create a bitmap layer to be used in tower construction mode to
        // highlight where tower can or cannot be built.
        this.highlightBitmap = this.game.add.bitmapData(this.world.width, this.world.height);
        this.game.add.sprite(0, 0, this.highlightBitmap);

        this.hud.create();

        this.towersList = new App.Collection();
        this.enemiesList = new App.Collection();

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

        // Tiles that units can walk on.
        // 3 is the default walkable tile, loaded from the JSON file.
        // 4 is used by Towers to define their immediate surroundings, where
        // other Towers cannot be built.
        this.walkableTiles = [3, 4];

        this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        // this.pathfinder._easyStar.enableDiagonals();
        this.pathfinder.setGrid(this.access_layer.layer.data, this.walkableTiles);

        this.TIME_BETWEEN_PATH_COMPUTATION = 1; // in seconds

        this.gameEnded = false;
    },

    update: function() {
        if (this.gameEnded) {
            return;
        }

        // check Player : End Of Game : player dead
        if (this.player.health <= 0) {
            // The game is over, let's pause it until we go to the next state.
            this.gameEnded = true;
            this.stopAllMovements();

            var deathTimer = this.game.time.create();
            deathTimer.add(1000, function () {
                this.stopSound();
                this.state.start('DeathMenu', true, false, this.score);
            }, this);

            deathTimer.start();
        }

        // check Enemy : dead ? newTarget ?
        for (var i = this.enemiesList.length - 1; i>=0; i--)
        {
            var currEnemy = this.enemiesList[i];
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
                        if (currEnemy.key == 'enemy2') {
                            currEnemy.getNewTarget();
                        }
                        var targetTile = this.map.getTileWorldXY(currEnemy.target.x, currEnemy.target.y);
                        this.computePath(currEnemy, targetTile);
                        currEnemy.lastPathComputation = this.game.time.now;
                    }
                }
            }
        }

        for (var i = this.towersList.length - 1; i >= 0; i--) {
            var tower = this.towersList[i];

            if (tower.exists && tower.health <= 0) {
                this.destructTower(tower);
            }
        }

        // check Wave : End of game ? new one ?
        if (!this.creatingWave) {
            // compute : are there any enemy alive ?
            var index = this.enemiesList.length - 1;
            var enemy = this.enemiesList[index];
            var win = true;
            while (win && index >= 0) {
                win = !enemy.exists;
                index--;
                enemy = this.enemiesList[index];
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
                    this.gameEnded = true;
                    this.stopAllMovements();

                    this.player.doVictoryDance();

                    var victoryTimer = this.game.time.create();
                    victoryTimer.add(2500, function () {
                        this.stopSound();
                        this.state.start('VictoryMenu', true, false, this.score);
                    }, this);

                    victoryTimer.start();
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

        // Collisions
        this.game.physics.arcade.collide(this.player, this.access_layer);
        this.game.physics.arcade.collide(this.player, this.enemiesList);
        this.game.physics.arcade.collide(this.player, this.towersList);

        for (var i = this.enemiesList.length - 1; i >= 0; i--) {
            var enemy = this.enemiesList[i];

            if (!enemy.exists) {
                continue;
            }

            this.game.physics.arcade.collide(enemy, this.towersList,
                function (enemy, tower) {
                    enemy.target = tower;
                }, null, this
            );
            this.game.physics.arcade.collide(enemy, this.enemiesList);
        };

        // Tower creation
        if (this.player.isInConstructMode) {
            // is the player in construction mode ?
            if (this.towerToConstruct === null) {
                var towerType = null;
                if (this.player.towerTypeToConstruct === 'tower1') {
                    towerType = App.Tower1;
                }
                else if (this.player.towerTypeToConstruct === 'tower2') {
                    towerType = App.Tower2;
                }
                this.towerToConstruct = new towerType(
                    this.game,
                    this.input.x,
                    this.input.y,
                    [],
                    this.map
                );

                this.towerToConstruct.alpha = 0.5;
                this.allObjectsGroup.add(this.towerToConstruct);
            }

            var targetTile = this.map.getTileWorldXY(this.input.x, this.input.y);
            this.towerToConstruct.x = targetTile.worldX + targetTile.width / 2;
            this.towerToConstruct.y = targetTile.worldY + targetTile.height / 2;

            // Show green or red rectangles where the tower can or cannot be built.
            this.highlightBitmap.context.clearRect(0, 0, this.world.width, this.world.height);

            var tiles = this.towerToConstruct.getTiles();
            for (var i = tiles.length - 1; i >= 0; i--) {
                var tile = tiles[i];
                var color = 'rgba(0, 255, 0, 0.1)';
                if (tile.index === 1 || tile.index === 4) {
                    // Unable to build here, mark it red.
                    color = 'rgba(255, 0, 0, 0.1)';
                }

                this.highlightBitmap.context.fillStyle = color;
                this.highlightBitmap.context.fillRect(tile.worldX, tile.worldY, tile.width, tile.height);
            };
            this.highlightBitmap.dirty = true;
        }
        else {
            if (null != this.towerToConstruct) {
                this.towerToConstruct.destroy();
                this.towerToConstruct = null;

                // Clear the highligh bitmap.
                this.highlightBitmap.context.clearRect(0, 0, this.world.width, this.world.height);
                this.highlightBitmap.dirty = true;
            }
        }

        for (var i = this.towersList.length - 1; i >= 0; i--) {
            var tower = this.towersList[i];

            if (!tower.exists || tower.built || tower.alpha != 0.9) {
                continue;
            }

            if (this.game.physics.arcade.distanceBetween(this.player, tower) <= this.MIN_DISTANCE_TO_BUILD_TOWER) {
                this.player.setBuildMode(tower);
                this.player.stopMoving();

                tower.built = false;
                tower.alpha = 1;
                tower.init();

                this.time.events.add(Phaser.Timer.SECOND * tower.CONSTRUCTION_DURATION, this.player.endBuildMode, this.player, tower);
            }
        };

        // Sort all objects by `y` so they get displayed correctly.
        this.allObjectsGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        this.hud.update();
    },

    render: function() {
        this.hud.render();
    },

    quitGame: function(pointer) {
        this.state.start('MainMenu');
    },

    clickListener: function (element, pointer) {
        if (Phaser.Mouse.RIGHT_BUTTON === this.input.mouse.button) {
            this.cancelConstruction();
            return;
        }

        if (this.gameEnded) {
            return;
        }

        if (!this.player.building && !this.player.attacking) {
            var targetTile = this.map.getTileWorldXY(this.input.x, this.input.y);
            if (this.player.isInConstructMode && this.towerToConstruct.canBuild()) {
                this.computePath(this.player, targetTile);
                this.constructTower();
            }
            else if (!this.player.isInConstructMode) {
                this.computePath(this.player, targetTile);
            }
        }
    },

    constructTower: function () {
        // // Get the first dead tower of the good type from the towersList
        var newTower = null;
        var index = this.towersList.length - 1;
        while (index >= 0) {
            var currTower = this.towersList[index];
            if (!currTower.exists && currTower.key === this.player.towerTypeToConstruct) {
                newTower = currTower;
                break;
            }
            index--;
        }

        // If there aren't any available, create a new one
        if (newTower === null) {
            var towerType = null;
            if (this.player.towerTypeToConstruct === 'tower1') {
                towerType = App.Tower1;
            }
            else if (this.player.towerTypeToConstruct === 'tower2') {
                towerType = App.Tower2;
            }

            newTower = new towerType(
                this.game,
                this.towerToConstruct.x,
                this.towerToConstruct.y,
                this.enemiesList,
                this.map
            );

            this.allObjectsGroup.add(newTower);
            this.towersList.push(newTower);
        }
        else {
            // Revive it
            newTower.reset();
            newTower.revive();

            // Move the tower to the given coordinates
            newTower.x = this.towerToConstruct.x;
            newTower.y = this.towerToConstruct.y;
        }

        // Add the tower to the collision map.
        newTower.createCollisions();
        this.pathfinder.setGrid(this.access_layer.layer.data, this.walkableTiles);

        this.player.deactivateConstructMode();
        newTower.alpha = 0.9;
        newTower.setBaseBuildingFrame();

        // Clear the highligh bitmap.
        this.highlightBitmap.context.clearRect(0, 0, this.world.width, this.world.height);
        this.highlightBitmap.dirty = true;
    },

    destructTower: function (tower) {
        tower.kill();

        // Remove the tower from the collision map.
        tower.removeCollisions();
        this.pathfinder.setGrid(this.access_layer.layer.data, this.walkableTiles);
    },

    cancelConstruction: function () {
        if (null != this.towerToConstruct) {
            this.towerToConstruct.destroy();
            this.towerToConstruct = null;
            this.player.deactivateConstructMode();

            // Clear the highligh bitmap.
            this.highlightBitmap.context.clearRect(0, 0, this.world.width, this.world.height);
            this.highlightBitmap.dirty = true;
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
        var newX = this.world.centerX + (this.RadiusX + 50) * Math.cos(param * 2 * Math.PI);
        var newY = this.world.centerY + (this.RadiusY + 50) * Math.sin(param * 2 * Math.PI);

        var enemyRand = Math.random();
        var enemyType = enemyRand < 0.5 ? 'enemy1' : 'enemy2';
        var newEnemy = null;
        var index = this.enemiesList.length -1;
        while (index >= 0) {
            var currEnemy = this.enemiesList[index];
            if (!currEnemy.exists && currEnemy.key === enemyType) {
                newEnemy = currEnemy;
                break;
            }
            index--;
        }
        if (createBoss) {
            newEnemy = new App.Boss(this.game, newX, newY, 'boss', this.player);
            this.allObjectsGroup.add(newEnemy);
            this.enemiesList.push(newEnemy);
        }

        if (newEnemy === null) {
            if (enemyType == 'enemy1') {
                newEnemy = new App.Enemy1(this.game, newX, newY, this.player);
            }
            else if (enemyType == 'enemy2') {
                newEnemy = new App.Enemy2(this.game, newX, newY, this.player, this.towersList);
            }
            else {
                console.log("SHOULD NEVER HAPPEN");
            }
            this.allObjectsGroup.add(newEnemy);
            this.enemiesList.push(newEnemy);
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

    stopSound: function () {
        this.player.stopWalkSound();
        for (var i = this.enemiesList.length - 1; i >= 0; i--) {
            this.enemiesList[i].stopWalkSound();
        }
        this.musicFight.stop();
        this.musicRelax.stop();
    },

    stopAllMovements: function () {
        this.player.stopMoving();
        for (var i = this.enemiesList.length - 1; i >= 0; i--) {
            this.enemiesList[i].stopMoving();
        }
    }
};
