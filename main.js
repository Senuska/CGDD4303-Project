//Makes enchant.js global namespace
enchant();

window.onload = function(){

	//Sets window size of core
    var game = new Core(400, 400);
    game.fps = 30;
	
	//Preloads assets for in-game use
    game.preload("Background.png", "Cannon.png", "Bullet.png");
	
	//Code for game is set right after it begins. (First scene, starting menu, etc)
    game.onload = function(){
		
        backgroundImage = new Sprite(400, 400);
        cannon = new Sprite(100, 50);
        var bullet = new Sprite(50, 50);

        backgroundImage.image = game.assets["Background.png"];
        cannon.image = game.assets["Cannon.png"];
        bullet.image = game.assets["Bullet.png"];

        backgroundImage.x = 0;
        backgroundImage.y = 0;
        
        cannon.x = 50;
        cannon.y = 250;
        
        bullet.x = cannon.x;
        bullet.y = cannon.y;
        bullet.visible = false;
        
        game.rootScene.addChild(backgroundImage);
        game.rootScene.addChild(bullet);
        game.rootScene.addChild(cannon);
        
        //EventTarget.addEventListener(event, listener)      
        cannon.addEventListener("touchstart", function(){
        	bullet.x = cannon.x;
        	bullet.y = cannon.y;
            bullet.visible = true; 
        });
		
		cannon.addEventListener("enterframe", function(){
			if(game.input.up && this.rotation > -90) 
			{
				this.rotate(-1);
			}
			if(game.input.down && this.rotation < 0)
			{
			 	this.rotate(1);	
			}
			if(game.input.a)
			{
				bullet.x = cannon.x;
        		bullet.y = cannon.y;
            	game.rootScene.addChild(bullet);  
			}
        });
        
        bullet.addEventListener("enterframe", function(){
        	if(this.visible)
        	{
            	this.x += 10;
            	if(this.x >= 400) {
            		this.visible = false;	
            	}        		
        	}
        });
    };

    game.start();
};
