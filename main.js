enchant();

window.onload = function(){
    var game = new Core(800, 600);
	var menu_scene = new Scene();
	var play_scene = new Scene();
    game.fps = 30;
    game.preload("chara1.png", "button.png");
    var game = new Core(400, 400);
	
    game.fps = 30;
     * Core.preload
     * Set needed file lists in relative/absolute path for attributes of Core.preload
    game.preload("Background.png", "Cannon.png", "Bullet.png");
	
     * Core.onload
    game.onload = function(){
		//Define the Menu Scene
		game.pushScene(menu_scene);
        backgroundImage = new Sprite(400, 400);
        cannon = new Sprite(100, 50);
        bullet = new Sprite(50, 50);
		
		play_button = new Sprite(64, 32);
        backgroundImage.image = game.assets["Background.png"];
        cannon.image = game.assets["Cannon.png"];
        bullet.image = game.assets["Bullet.png"];

		play_button.image = game.assets["button.png"];
        backgroundImage.x = 0;
        backgroundImage.y = 0;
        
		play_button.x = 800/2 - 32;
		play_button.y = 600/2
		menu_scene.addChild(play_button);
        cannon.x = 50;
        cannon.y = 250;
        
		//Handles input for the play button
        menu_scene.addEventListener('touchstart', function(e){
			if(e.localX > play_button.x && e.localX < play_button.x + 64)
			{
				if(e.localY > play_button.y && e.localY  < play_button.y + 32)
				{
					game.popScene();
					game.pushScene(play_scene);
				}
			}
        bullet.x = 100;
        bullet.y = 0;

        backgroundImage.frame = 0;
        cannon.frame = 0;
        bullet.frame = 0;
        
        game.rootScene.addChild(backgroundImage);
        game.rootScene.addChild(cannon);
      

        /*
          Add an event to an object:

          EventTarget.addEventListener(event, listener)
         */         
        	cannon.addEventListener("touchstart", function(){
        		bullet.x = 100;
        		bullet.y = 0;
            	game.rootScene.addChild(bullet);  
        	});
		
		//Define the Play Scene
		back_button = new Sprite(32, 32);
		
		back_button.image = game.assets["button.png"];
		
		back_button.x = 0;
		back_button.y = 0;
		
		play_scene.addChild(back_button);
		
		
        bullet.addEventListener("enterframe", function(){

            this.x += 10;
            
            if(this.x >= 400)
            {
            	game.rootScene.removeChild(this);	
            }
		play_scene.addEventListener('touchstart', function(e){
			//Handles input for the back button
			if(e.localX > back_button.x && e.localX < back_button.x + 32)
			{
				if(e.localY > back_button.y && e.localY  < back_button.y + 32)
				{
					game.popScene();
					game.pushScene(menu_scene);
				}
			}
        });

    };

    game.start();
};
