enchant();
window.onload = function(){

	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    	var menu_scene = new Scene();
    	var play_scene = new Scene();
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/cannon.png", "assets/drillball.png", "assets/tileset.png");
    game.onload = function(){
		
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		game.pushScene(menu_scene);
		
		// Display values for play_button
		play_button = new Sprite(64, 32);
		play_button.image = game.assets["assets/button.png"];
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
		
		// Creates the floor of the level (use map editor: http://enchantjs.com/resource/the-map-editor/)
		var mapFloor = new Map(16, 16);
        mapFloor.image = game.assets["assets/tileset.png"];
        mapFloor.y = 300;
        mapFloor.loadData(
            [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],	
			]
		);
		
		// Creates the test wall of the level
		var mapWall = new Map(16, 16);
		
		// Store it in an array for changing the map (game won't recognize map changes)
		mapWall.values = [
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2],
			];
		mapWall.image = game.assets["assets/tileset.png"];
		mapWall.x = 400;
		mapWall.y = 16;
		mapWall.loadData(mapWall.values);
		
		// Local constant for maximum cannon power
		const MAX_CANNON_POWER = 3;
		const CANNON_TEXT = "Cannon Power: ";
		play_scene.backgroundColor = "blue";
		
		// Binds spacebar to a-button
		game.keybind(32, 'a');
		
		// Label for cannon power
		var powerLabel = new Label(CANNON_TEXT);
		powerLabel.x = 200;
		
		// Display values for back_button
		var back_button = new Sprite(32, 32);
		back_button.image = game.assets["assets/button.png"];
		back_button.x = 0;
		back_button.y = 0;
		
      	// Physics objects follow this format: function(staticOrDynamic, density, friction, restitution, awake)
        // var floor = new PhyBoxSprite(400, 100, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);

        var cannon = new Sprite(100, 50);
        cannon.image = game.assets["assets/cannon.png"];    
		cannon.x = 50;
		cannon.y = 250; 
		cannon.power = 0.0;     		//Current cannon launch power
		cannon.buildingPower = false;	// Prevents machine gun cannon
        
        // Logic for physics steps
        play_scene.addEventListener("enterframe", function () {
        	physicsWorld.step(game.fps);
        	powerLabel.text = (CANNON_TEXT + cannon.power.toFixed(1));
        });
        
        // Logic for back_button
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

		// Logic for cannon
        cannon.addEventListener("enterframe", function(){
        	if(game.input.a && cannon.buildingPower == false) cannon.buildingPower = true;
        	else if(game.input.a && cannon.buildingPower == true)
        	{
				cannon.power += 0.1;
				if(cannon.power > MAX_CANNON_POWER) cannon.power = MAX_CANNON_POWER;
        	}
        	
        	if(!game.input.a && cannon.buildingPower == true)
        	{
        		var drill = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
       		 	drill.image = game.assets["assets/drillball.png"];
       			drill.x = (Math.cos(this.rotation * 3.14159/180) * (cannon.width / 2)) + (cannon.x + (cannon.width / 2) - (drill.width / 2));
       	 		drill.y = (Math.sin(this.rotation * 3.14159/180) * cannon.height) + (cannon.y + ((cannon.height / 2) - (drill.height / 2)));
        	
         		drill.applyImpulse(new b2Vec2(Math.cos(cannon.rotation * 3.14159/180) * cannon.power, Math.sin(cannon.rotation * 3.14159/180) * cannon.power));
       		    play_scene.addChild(drill);
  	    	 	drill.addEventListener("enterframe", function(){	
  	    	 		if (drill.intersect(mapWall)) 
  	    	 		{
  	    	 			/*
  	    	 				Bug: Only removes on first shot.
  	    	 				Bug: Crashes if you hit corners.
  	    	 				Bug: Sometimes removes incorrect blocks or not at all.
  	    	 			*/
  	    	 			
					// Remove block found at the intersection site
					var hitY = ((mapWall.y - drill.y) / 16).toFixed(0);
					var hitX = ((mapWall.x - drill.x) / 16).toFixed(0);
					
					if (hitY < 0) hitY = -hitY;
					if (hitX < 0) hitX = -hitX;
					
						mapWall.values[hitY][hitX] = (-1);
  	    	 			
  	    	 		// Loads changed array data into map for drawing
						mapWall.loadData(mapWall.values);

					// If drill velocity drops to a certain speed, remove the drill
					 if (drill.velocity.x <= 0.5 && drill.velocity.y <= 0.5) drill.destroy();
  	    	 		}
           	   	});
           	   		
           	   	cannon.buildingPower = false;
           	   	cannon.power = 0.0;
        	}
        	
        	if(game.input.up && this.rotation > -90) this.rotate(-1);					
			if(game.input.down && this.rotation < 0) this.rotate(1);
        });
        
        // Adds all items to the play_scene
        play_scene.addChild(back_button);
        play_scene.addChild(mapFloor);
        play_scene.addChild(mapWall);
        play_scene.addChild(cannon);
        play_scene.addChild(powerLabel);
    };
    game.start();
};
