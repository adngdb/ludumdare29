App.HUD = function(game, player) {

    this.game = game;
    this.player = player;
};

App.HUD.prototype = {
    create: function() {
        this.soundToggle = this.game.add.button(this.game.width - 50, 15, 'muteToggle', this.toggleSound, this);
        this.soundToggle.frame = 1;

        var buttonBar = this.game.add.sprite(this.game.world.centerX, this.game.height - 44, 'barre_hudingame');
        buttonBar.anchor.set(0.5);

        var chooseTower1Button = this.game.add.button(this.game.width / 2 - 80, buttonBar.y + 10, 'buttonTower1', this.chooseTower, this);
        chooseTower1Button.anchor.set(0.5);
        chooseTower1Button.scale.x = 0.5;
        chooseTower1Button.scale.y = 0.5;
        chooseTower1Button.type = 'tower1';
        var chooseTower2Button = this.game.add.button(chooseTower1Button.x + 88, chooseTower1Button.y, 'buttonTower2', this.chooseTower, this);
        chooseTower2Button.anchor.set(0.5);
        chooseTower2Button.scale.x = 0.5;
        chooseTower2Button.scale.y = 0.5;
        chooseTower2Button.type = 'tower2';
        var chooseTower3Button = this.game.add.button(chooseTower2Button.x + 88, chooseTower1Button.y, 'buttonTower3', this.chooseTower, this);
        chooseTower3Button.anchor.set(0.5);
        chooseTower3Button.scale.x = 0.5;
        chooseTower3Button.scale.y = 0.5;
        chooseTower3Button.type = 'tower3';

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
        var text3  = "3";
        var towerShortcut = this.game.add.text(chooseTower3Button.x + 20, chooseTower3Button.y - 20, text3, style);
        towerShortcut.anchor.set(0.5);
    },

    update: function() {
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
        console.log("when implemented : change UI to build tower 2 and 3")
        // this.player.setChoosenTowerType(element.type);
        this.player.setChoosenTowerType('tower1');
    },

    shortcutChooseTower1: function(key) {
        this.chooseTower({'type' : 'tower1'});
    },

    shortcutChooseTower2: function(key) {
        this.chooseTower({'type' : 'tower2'});
    },

    shortcutChooseTower3: function(key) {
        this.chooseTower({'type' : 'tower3'});
    }
};
