App.HUD = function(game, player) {

    this.game = game;
    this.player = player;
};

App.HUD.prototype = {
    create: function() {
        this.soundToggle = this.game.add.button(this.game.width - 50, 15, 'muteToggle', this.toggleSound, this);
        this.soundToggle.frame = 1;

        this.chooseTower1Button = this.game.add.button(this.game.width / 2 - 180, this.game.height - 110, 'buttonTower1', this.chooseTower, this);
        this.chooseTower1Button.scale.x = 0.75;
        this.chooseTower1Button.scale.y = 0.75;
        this.chooseTower1Button.type = 'tower1';
        this.chooseTower2Button = this.game.add.button(this.chooseTower1Button.x + 128, this.chooseTower1Button.y, 'buttonTower2', this.chooseTower, this);
        this.chooseTower2Button.scale.x = 0.75;
        this.chooseTower2Button.scale.y = 0.75;
        this.chooseTower2Button.type = 'tower2';
        this.chooseTower3Button = this.game.add.button(this.chooseTower2Button.x + 128, this.chooseTower1Button.y, 'buttonTower3', this.chooseTower, this);
        this.chooseTower3Button.scale.x = 0.75;
        this.chooseTower3Button.scale.y = 0.75;
        this.chooseTower3Button.type = 'tower3';

        var oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        oneKey.onDown.add(this.shortcutChooseTower1, this);
        var twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        twoKey.onDown.add(this.shortcutChooseTower2, this);
        var threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        threeKey.onDown.add(this.shortcutChooseTower3, this);

        var style = { font: "16px Arial", fill: "cyan", align: "center" };
        var text1  = "1";
        var towerShortcut = this.game.add.text(this.chooseTower1Button.x + 64, this.chooseTower1Button.y +2, text1, style);
        towerShortcut.anchor.set(0.5);
        var text2  = "2";
        var towerShortcut = this.game.add.text(this.chooseTower2Button.x + 64, this.chooseTower2Button.y +2, text2, style);
        towerShortcut.anchor.set(0.5);
        var text3  = "3";
        var towerShortcut = this.game.add.text(this.chooseTower3Button.x + 64, this.chooseTower3Button.y +2, text3, style);
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
    },
};
