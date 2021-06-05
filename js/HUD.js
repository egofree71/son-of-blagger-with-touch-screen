var HUD =
{
    // Width of a character in pixels
    charWidth: 16,

    // Score displayed in the hud
    HUDScore: null,
    HUDHiscore: null,

    // Lives displayed in the hud
    HUDLives: null,
    HUDLevel: null,
    airLevelRectangle: null,

    // Counter used to decrease the air level
    counter: 36,
    bonusManSprite: null,
    // Game controller buttons
    leftButton: null,
    rightButton: null,
    upButton: null,

    colorCounter: 3,
    colorIndex: 0,
    increaseColorIndex: true,

    init: function ()
    {
        // Initialize HUD
        game.camera.height = 200;

        // Draw the black background
        var background = game.add.graphics();
        background.beginFill(0x000000, 1);
        background.drawRect(0, game.camera.height, game.camera.width, game.camera.height);
        background.fixedToCamera = true;

        // Display the background of the air level
        var myBitmap = game.add.bitmapData(this.charWidth * 38 - this.charWidth * 6, this.charWidth);
        var grd = myBitmap.context.createLinearGradient(0, 0, this.charWidth * 38, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "#399aff");
        myBitmap.context.fillStyle = grd;
        myBitmap.context.fillRect(0, 0, this.charWidth * 38, this.charWidth);

        var sprite = game.add.sprite(this.charWidth * 6, game.camera.height + this.charWidth, myBitmap);
        sprite.fixedToCamera = true;

        // Draw air level
        this.airLevelRectangle = game.add.graphics();
        this.airLevelRectangle.beginFill(0x000000, 1);
        this.airLevelRectangle.drawRect(this.charWidth * 6 + 16, game.camera.height + this.charWidth + 4, Level.airLevel, this.charWidth - 8);
        this.airLevelRectangle.endFill();
        this.airLevelRectangle.fixedToCamera = true;

        this.drawText("air", 2, 1, 0x399aff);

        this.bonusManSprite = game.add.sprite(this.charWidth * 2, game.camera.height + this.charWidth * 3, 'bonusMan');
        this.hideBonusMan();
        this.bonusManSprite.fixedToCamera = true;

        // create virtual game controller buttons 
        this.leftButton = game.add.button(this.charWidth * 3, game.camera.height + this.charWidth * 6 - 5, 'leftButton', null, this, 0, 1, 0, 1);
        this.leftButton.fixedToCamera = true;
        this.leftButton.events.onInputDown.add(function () { Player.leftButton = true; });
        this.leftButton.events.onInputUp.add(function () { Player.leftButton = false; });
        this.leftButton.events.onInputOver.add(function () { Player.leftButton = true; });
        this.leftButton.events.onInputOut.add(function () { Player.leftButton = false; })

        this.rightButton = game.add.button(this.charWidth * 11, game.camera.height + this.charWidth * 6 - 5, 'rightButton', null, this, 0, 1, 0, 1);
        this.rightButton.fixedToCamera = true;
        this.rightButton.events.onInputDown.add(function () { Player.rightButton = true; });
        this.rightButton.events.onInputUp.add(function () { Player.rightButton= false; });
        this.rightButton.events.onInputOver.add(function () { Player.rightButton = true; });
        this.rightButton.events.onInputOut.add(function () { Player.rightButton = false; })

        this.upButton = game.add.button(this.charWidth * 30, game.camera.height + this.charWidth * 6 - 5, 'upButton', null, this, 0, 1, 0, 1);
        this.upButton.fixedToCamera = true;
        this.upButton.events.onInputDown.add(function () { Player.jumpButton = true; });
        this.upButton.events.onInputUp.add(function () { Player.jumpButton= false; });
        this.upButton.events.onInputOver.add(function () { Player.jumpButton = true; });
        this.upButton.events.onInputOut.add(function () { Player.jumpButton = false; })

        this.hideButtons();

        this.drawText("lives", 2, 4, 0x808080);
        this.HUDLives = this.drawText(('00' + GameController.lives).substr(-2), 8, 4);

        this.drawText("score", 14, 4, 0x808080);
        this.HUDScore = this.drawText(('000000' + GameController.score).substr(-6), 20, 4);

        this.drawText("level", 30, 4, 0x808080);
        this.HUDLevel = this.drawText(('00' + Level.level).substr(-2), 36, 4);
    },

    // If there is a 'bonus man', display the 'bonus man' sprite, and change its color
    displayBonusMan: function ()
    {
        if (Level.bonusMan)
        {
            this.colorCounter -= 1;

            if (this.colorCounter == 0)
            {
                this.colorCounter = 3;

                if (this.increaseColorIndex)
                    this.colorIndex += 1;
                else
                    this.colorIndex -= 1;

                if (this.colorIndex == 3)
                    this.increaseColorIndex = false;

                if (this.colorIndex == 0)
                    this.increaseColorIndex = true;
            }

            this.bonusManSprite.tint = Data.bonusManColors[this.colorIndex];

        }
    },

    // Hide the bonus man sprite
    hideBonusMan: function ()
    {
        this.bonusManSprite.tint = 0x000000;
    },

    // Display the game controller buttons
    displayButtons: function ()
    {
        this.leftButton.tint = 0xffffff;
        this.rightButton.tint = 0xffffff;
        this.upButton.tint = 0xffffff;
    },

    // Hide the game controller buttons
    hideButtons: function ()
    {
        this.leftButton.tint = 0x000000;
        this.rightButton.tint = 0x000000;
        this.upButton.tint = 0x000000;
    },

    // Decrease air level and display it
    updateAirLevel: function ()
    {
        if (GameController.gameState != "playing") return;

        this.counter -= 1;

        if (this.counter == 0)
        {
            this.counter = 36;
            Level.airLevel -= 1;
        }

        if (Level.airLevel <= 0)
        {
            Player.kill();
            return;
        }

        this.displayAirLevel();

    },

    clearAirLevel: function ()
    {
        this.airLevelRectangle.clear();
    },

    displayAirLevel: function ()
    {
        // Display the air bar
        this.airLevelRectangle.clear();
        this.airLevelRectangle.beginFill(0x000000, 1);
        this.airLevelRectangle.drawRect(this.charWidth * 6 + 16, game.camera.height + this.charWidth + 4, Level.airLevel, this.charWidth - 8);
        this.airLevelRectangle.endFill();
    },

    // Update the lives display
    displayLives: function ()
    {
        this.HUDLives.text = ('00' + GameController.lives).substr(-2);
    },

    // Update the score display
    displayScore: function ()
    {
        this.HUDScore.text = ('000000' + GameController.score).substr(-6);
    },

    // Update the level display
    displayLevelInfo: function ()
    {
        this.HUDLevel.text = ('00' + level).substr(-2);
    },

    // Update all HUD infromation
    update: function ()
    {
        this.HUDLives.text = ('00' + GameController.lives).substr(-2);
        this.HUDScore.text = ('000000' + GameController.score).substr(-6);
        this.HUDLevel.text = ('00' + Level.level).substr(-2);
    },

    // Draw a text within the hud
    drawText: function (text, x, y, color)
    {
        var font = game.add.retroFont('blaggerFont', 16, 16, Phaser.RetroFont.TEXT_SET2);
        font.text = text;
        var image = game.add.image(this.charWidth * x, game.camera.height + this.charWidth * y, font);

        // If color is not defined, use white
        if (!color)
            image.tint = 0xFFFFFF;
        else
            image.tint = color;

        image.anchor.set(0);
        image.fixedToCamera = true;

        return font;
    }

}
