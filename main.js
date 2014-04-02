enchant();
window.onload = function(){

	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    	var menu_scene = new Scene();
    	var play_scene = new Scene();
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/Background.png", "assets/Cannon.png", "assets/DrillBall.png");
	
    game.onload = function(){
		
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		game.pushScene(menu_scene);
		
		// Display values for play_button
		play_button = new Sprite(64, 32);
		play_button.image = game.assets["button.png"];
		play_button.x = 800/2 - 32;
		play_button.y = 600/2
		menu_scene.addChild(play_button);
		
		// Input logic for play_button
        menu_scene.addEventListener('touchstart', function(mousePos){
			if(mousePos.localX > play_button.x && mousePos.localX < play_button.x + 64)
			{
				if(mousePos.localY > play_button.y && mousePos.localY  < play_button.y + 32)
				{
					game.popScene();
					game.pushScene(play_scene);
				}
			}
        });
        
		// ----------------------
		// Define the Play Scene
		// ----------------------
		
		// Display values for back_button
		back_button = new Sprite(32, 32);
		back_button.image = game.assets["button.png"];
		back_button.x = 0;
		back_button.y = 0;
		play_scene.addChild(back_button);
		
		// Input logic for back_button
		play_scene.addEventListener('touchstart', function(mousePos){
			if(mousePos.localX > back_button.x && mousePos.localX < back_button.x + 32)
			{
				if(mousePos.localY > back_button.y && mousePos.localY  < back_button.y + 32)
				{
					game.popScene();
					game.pushScene(menu_scene);
				}
			}
        });
		
		// Local constant for maximum cannon power
		const MAX_CANNON_POWER = 3;
		
		//function(staticOrDynamic, density, friction, restitution, awake)
        var floor = new PhyBoxSprite(400, 100, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);
        floor.image = game.assets["Background.png"];
        floor.x = 0;
        floor.y = 300;
        
        var cannon = new Sprite(100, 50);
        cannon.image = game.assets["Cannon.png"];    
		cannon.x = 50;
		cannon.y = 250;
        
        game.rootScene.addChild(floor);
        game.rootScene.addChild(cannon);
        
        //Binds spacebar to 'a' button
        game.keybind(32, 'a');
        
        //Prevents machine gun cannon
        var buildingPower = false;
        var cannonPower = 0.1;
        
        game.rootScene.addEventListener("enterframe", function () {
        	physicsWorld.step(game.fps);
        });

        cannon.addEventListener("enterframe", function(){
        	if(game.input.a && buildingPower == false) buildingPower = true;
        	else if(game.input.a && buildingPower == true)
        	{
				cannonPower += 0.1;
				if(cannonPower > MAX_CANNON_POWER) cannonPower = MAX_CANNON_POWER;
        	}
        	
        	if(!game.input.a && buildingPower == true)
        	{
        		var drill = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
       		 	drill.image = game.assets["DrillBall.png"];
       			drill.x = (Math.cos(this.rotation * 3.14159/180) * (cannon.width / 2)) + (cannon.x + (cannon.width / 2) - (drill.width / 2));
       	 		drill.y = (Math.sin(this.rotation * 3.14159/180) * cannon.height) + (cannon.y + ((cannon.height / 2) - (drill.height / 2)));
        	
         		drill.applyImpulse(new b2Vec2(Math.cos(cannon.rotation * 3.14159/180) * cannonPower, Math.sin(cannon.rotation * 3.14159/180) * cannonPower));
       		    game.rootScene.addChild(drill);
  	    	 	/*
  	    	 		MEANT FOR REMOVING OBJECTS FROM THE GAME
  	    	 		
  	    	 		drill.addEventListener("enterframe", function(){
           	    	if(drill.x > 400 || drill.x < 0)
              		    drill.destroy();
           	   		})
           	   		*/
           	   	buildingPower = false;
           	   	cannonPower = 0.1;
        	}
        	
        	if(game.input.up && this.rotation > -90) this.rotate(-1);					
			if(game.input.down && this.rotation < 0) this.rotate(1);
        });
    };

    game.start();
};
