enchant();

window.onload = function(){
    var game = new Core(320, 320);

    game.fps = 15;
    game.preload("chara1.png");
    game.onload = function(){
        bear = new Sprite(32, 32);

        bear.image = game.assets["chara1.png"];

        bear.x = 0;
        bear.y = 0;

        bear.frame = 0;
        game.rootScene.addChild(bear);

        game.rootScene.addEventListener('touchstart', function(e){
            bear.x = e.localX
			bear.y = e.localY
        });
		
		game.rootScene.addEventListener('touchmove', function(e){
            bear.x = e.localX
			bear.y = e.localY
        });
    };

    game.start();
};
