App.HUD = function(game, player) {

    this.game = game;
    this.player = player;
    this.lifeGauge;
    this.lifeGaugeMaxSize;
};

App.HUD.prototype = {
    create: function() {
        this.soundToggle = this.game.add.button(this.game.width - 74, 0, 'muteToggle', this.toggleSound, this);
        this.soundToggle.scale.set(0.5, 0.5);

        var buttonBar = this.game.add.sprite(this.game.world.centerX, this.game.height - 44, 'barre_hudingame');
        buttonBar.anchor.set(0.5);

        var lifeBackgroundBar = this.game.add.sprite(this.game.world.centerX, 48, 'barre_hudingame');
        lifeBackgroundBar.anchor.set(0.5);
        lifeBackgroundBar.angle = 180;
        lifeBackgroundBar.scale.x = 1.1;
        lifeBackgroundBar.scale.y = 1.2;

        var lifeBar = this.game.add.sprite(lifeBackgroundBar.x, lifeBackgroundBar.y - 5, 'barre_vie');
        lifeBar.anchor.set(0.5);

        this.lifeGauge = this.game.add.sprite(lifeBar.x - 59, lifeBar.y - 13, 'jauge_vie');
        this.lifeGauge.cropEnabled = true;
        this.lifeGaugeMaxSize = this.lifeGauge.width;

        this.updateLifeGauge();

        var chooseTower1Button = this.game.add.button(this.game.width / 2 - 60, buttonBar.y + 10, 'buttonTower1', this.chooseTower, this);
        chooseTower1Button.anchor.set(0.5);
        chooseTower1Button.scale.x = 0.5;
        chooseTower1Button.scale.y = 0.5;
        chooseTower1Button.type = 'tower1';
        var chooseTower2Button = this.game.add.button(chooseTower1Button.x + 108, chooseTower1Button.y, 'buttonTower2', this.chooseTower, this);
        chooseTower2Button.anchor.set(0.5);
        chooseTower2Button.scale.x = 0.5;
        chooseTower2Button.scale.y = 0.5;
        chooseTower2Button.type = 'tower2';

        var oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        oneKey.onDown.add(this.shortcutChooseTower1, this);
        var twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        twoKey.onDown.add(this.shortcutChooseTower2, this);
        var threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        threeKey.onDown.add(this.shortcutChooseTower3, this);

        var style = { font: "16px custom", fill: "#794B23", align: "center" };
        var text1  = "1";
        var towerShortcut = this.game.add.text(chooseTower1Button.x + 20, chooseTower1Button.y - 20, text1, style);
        towerShortcut.anchor.set(0.5);
        var text2  = "2";
        var towerShortcut = this.game.add.text(chooseTower2Button.x + 20, chooseTower2Button.y - 20, text2, style);
        towerShortcut.anchor.set(0.5);
    },

    update: function() {
        this.updateLifeGauge();
    },

    render: function() {
    },

    toggleSound: function()
    {
        this.game.sound.mute = !this.game.sound.mute;
        this.soundMuted = !this.soundMuted;
        this.soundToggle.frame = 1 - this.soundToggle.frame;
    },

    chooseTower: function(element) {
        this.player.setChoosenTowerType(element.type);
    },

    shortcutChooseTower1: function(key) {
        this.chooseTower({'type' : 'tower1'});
    },

    shortcutChooseTower2: function(key) {
        this.chooseTower({'type' : 'tower2'});
    },

    shortcutChooseTower3: function(key) {
        console.log("when implemented : change UI to build tower 3")
        this.chooseTower({'type' : 'tower1'});
        // this.chooseTower({'type' : 'tower3'});
    },

    updateLifeGauge: function() {
        var croppedWidth = (this.player.health / this.player.maxHealth) * this.lifeGaugeMaxSize;
        this.lifeGauge.crop({x : 0, y : 0 , width : croppedWidth, height : this.lifeGauge.height});
    }
};
