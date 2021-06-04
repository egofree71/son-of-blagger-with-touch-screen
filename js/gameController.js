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

                // If the user pressed a key, start a new game
                game.input.onDown.add(function ()
                {
                    Level.removeIntroduction();
                    game.input.onDown.dispose();

                    GameController.gameState = "load level";
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
                Level.displayMonsters();
                break;

            // The game has ended, reset game and show game over
            case "show game over":
                Level.resetGame();
                Level.displayGameOver();

                // If the user pressed a key, show the introduction
                game.input.keyboard.onPressCallback = function ()
                {
                    game.input.keyboard.onPressCallback = null;
                    Level.gameOver.destroy();
                    GameController.gameState = "load introduction";
                };

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
