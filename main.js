enchant();

window.onload = function(){

    var game = new Core(400, 400);
    game.fps = 30;
    game.preload("Background.png", "Cannon.png", "Bullet.png");

}

    game.onload = function(){

    game.start();
}
