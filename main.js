enchant();
window.onload = function(){

	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
	// Creates the different scenes used throughout the game
    var menu_scene = new Scene();
	var credits_scene = new Scene();
	var options_scene = new Scene();
    var play_scene = new Scene();
	var streak_scene = new Scene();
	var scratch_scene = new Scene();
	var credits01 = new Label("Credits:");
	var credits02 = new Label("Cameron Herbert");
	var credits03 = new Label("Samuel Erik Swanson");
	var credits04 = new Label("Chad Rush");
	var credits04 = new Label("Special Thanks:");
	var credits05 = new Label("Mrs. Stormi Johnson's 3rd Grade Class");
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/play_button_small.png", "assets/back_button_small.png", "assets/credits_button_small.png", "assets/options_button_small.png", "assets/cannon.png", "assets/drillball.png", "assets/tileset.png");
    game.onload = function(){
		
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		game.pushScene(menu_scene);
		
		// Making a test button to see what is causing the issue with the other buttons not working
		var test_button = new Sprite(64, 32);
		test_button.image = game.assets["assets/button.png"];
		test_button.x = 0;
		test_button.y = 0;
		//menu_scene.addChild(test_button);
		test_button.addEventListener('touchstart', function(){
			test_button.x++;
		});
		
		
		// Display values for play_button
		var play_button = new Sprite(143, 30);
		play_button.image = game.assets["assets/play_button_small.png"];
		play_button.x = game.width/2 - (play_button.width/2);
		play_button.y = game.height/2;
		menu_scene.addChild(play_button);
		
		// Input logic for play_button
        play_button.addEventListener('touchstart', function(){
			game.replaceScene(play_scene);
        });
        
		// Display values for options_button
		var options_button = new Sprite(237, 30);
		options_button.image = game.assets["assets/options_button_small.png"];
		options_button.x = game.width/2 -(options_button.width/2);
		options_button.y = game.height/2 + 45;
		menu_scene.addChild(options_button);
		
		// Input logic for options_button
        options_button.addEventListener('touchstart', function(){
			game.replaceScene(options_scene);
        });
		
		// Display values for credits_button
		var credits_button = new Sprite(237, 30);
		credits_button.image = game.assets["assets/credits_button_small.png"];
		credits_button.x = game.width/2 -(credits_button.width/2);
		credits_button.y = game.height/2 + 90;
		menu_scene.addChild(credits_button);
		
		// Input logic for credits_button
        credits_button.addEventListener('touchstart', function(){
			game.replaceScene(credits_scene);
        });
		
		// Display values for back_button
		var back_button = new Sprite(147, 30);
		back_button.image = game.assets["assets/back_button_small.png"];
		back_button.x = 0;
		back_button.y = game.height - back_button.height;
		
		// Input logic for back_button
		back_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(menu_scene);
        });
		
		// -------------------------
		// Define the Credits Scene
		// -------------------------
		credits01.x = game.width/2 - credits01.width/2;
		credits01.y = 50;
		
		credits02.x = game.width/2 - credits02.width/2;
		credits02.y = credits01.y + credits01.height + 15;
		
		credits03.x = game.width/2 - credits03.width/2;
		credits03.y = credits02.y + credits02.height + 15;
		
		credits04.x = game.width/2 - credits04.width/2;
		credits04.y = credits03.y + credits03.height + 15;
		
		credits05.x = game.width/2 - credits05.width/2;
		credits05.y = credits04.y + credits04.height + 15;
		
		// Display values for back_button
		var cback_button = new Sprite(147, 30);
		cback_button.image = game.assets["assets/back_button_small.png"];
		cback_button.x = 0;
		cback_button.y = game.height - back_button.height;
		
		// Input logic for back_button
		cback_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(menu_scene);
        });
		
		
		credits_scene.addChild(credits01);
		credits_scene.addChild(credits02);
		credits_scene.addChild(credits03);
		credits_scene.addChild(credits04);
		credits_scene.addChild(credits05);
		credits_scene.addChild(cback_button);
		
		// -------------------------
		// Define the Options Scene
		// -------------------------
		
		options_scene.addChild(test_button);
		options_scene.addChild(back_button);
		// ----------------------
		// Define the Play Scene
		// ----------------------
		
		// Creates the floor of the level
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
		var mapValues = [
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
		mapWall.loadData(mapValues);
		
		// Local constant for maximum cannon power
		const MAX_CANNON_POWER = 3;
		const CANNON_TEXT = "Cannon Power: ";
		play_scene.backgroundColor = "blue";
		
		// Binds spacebar to a-button
		game.keybind(32, 'a');
		
		// Label for cannon power
		var powerLabel = new Label(CANNON_TEXT);
		powerLabel.x = 200;
		
		
      	// Physics objects follow this format: function(staticOrDynamic, density, friction, restitution, awake)
        // var floor = new PhyBoxSprite(400, 100, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);

        var cannon = new Sprite(100, 50);
        cannon.image = game.assets["assets/cannon.png"];    
		cannon.x = 50;
		cannon.y = 250; 
		cannon.power = 0.1;     		//Current cannon launch power
		cannon.buildingPower = false;	// Prevents machine gun cannon
        
        // Logic for physics steps
        play_scene.addEventListener("enterframe", function () {
        	physicsWorld.step(game.fps);
        	powerLabel.text = (CANNON_TEXT + cannon.power);
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
						/* Do math to figure out where drill is compared to block array
							
							mapValues[(drill.x / 16)][(drill.y / 16)] = (-1);
  	    	 			*/
  	    	 			
  	    	 			/* Reloads changed array to map for drawing!
  	    	 			
							mapWall.loadData(mapValues);
						*/
						
						/* Evaluate right conditions to remove drill with
						
  	    	 				drill.destroy();
  	    	 			*/
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
