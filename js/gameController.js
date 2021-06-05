var GameController =
{
    // The current game state
    gameState: null,
    score: 0,
    hiScore: null,
    lives: 3,

    update: function ()
    {
        switch (this.gameState)
        {
            case "load introduction":
                Level.displayIntroduction();

                // If the user touched the screen, start a new game
                game.input.onDown.add(function ()
                {
                    Level.removeIntroduction();
                    game.input.onDown.dispose();
                    GameController.gameState = "load level";

                    // Set full screen
                    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                    game.scale.startFullScreen(false);
                });

                this.gameState = "introduction";
                break;

            // The player has finished the level, go to the next level
            case "end level":
                Level.goToNext();
                break;

            // The player has finished the game
            case "end game":
                Level.endGame();
                break;

            // Load level's objects
            case "load level":
                Level.load();
                HUD.update();
                this.gameState = "display level";
                break;

            // Display progressively the level
            case "display level":
                Level.display();
                break;

            // Before displaying monsters, show explosions
            case "start level":
                HUD.displayButtons();
                Level.displayMonsters();
                break;

            // The game has ended, reset game and show game over
            case "show game over":
                Level.resetGame();
                Level.displayGameOver();

                // If the user touched the screen, start a new game
                game.input.onDown.add(function ()
                {
                    game.input.keyboard.onPressCallback = null;
                    Level.gameOver.destroy();
                    HUD.hideButtons();
                    game.scale.stopFullScreen();
                    GameController.gameState = "load introduction";
                });

                this.gameState = "game over";
                break;

            case "playing":
                HUD.updateAirLevel();
                HUD.displayBonusMan();
                Level.updateMonsters();
                Player.update();
                break;

        }

    }

}
