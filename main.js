enchant();
window.onload = function(){

	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    var menu_scene = new Scene();
    var play_scene = new Scene();
	var scratch_scene = new Scene();
	var credits_scene = new Scene();
	var play_button;
	var scratch_button;
	var back_button;
	var credits_button;
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/cannon.png", "assets/drillball.png", "assets/tileset.png", "assets/rock01.png", "assets/rock02.png", "assets/rock03.png", "assets/rock04.png", "assets/rock05.png", "assets/rock06.png", "assets/rock07.png");
    game.onload = function(){
		
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		game.pushScene(menu_scene);
		
		// Display values for play_button
		play_button = new Sprite(64, 32);
		play_button.image = game.assets["assets/button.png"];
		play_button.x = game.width/2 - play_button.width;
		play_button.y = game.height/2;
		
		// Input logic for play_button
        play_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(play_scene);
        });
		
		menu_scene.addChild(play_button);
		
		scratch_button = new Sprite(64, 32);
		scratch_button.image = game.assets["assets/button.png"];
		scratch_button.x = game.width/2 - scratch_button.width;
		scratch_button.y = game.height - scratch_button.height;
		
		scratch_button.addEventListener('touchstart', function(){
			game.replaceScene(scratch_scene);
		});
		
		menu_scene.addChild(scratch_button);
		
		// -------------------------
		// Define the Scratch Scene
		// -------------------------
		var rock01 = new Sprite(50, 50);
		rock01.image = game.assets["assets/rock01.png"];
		rock01.x = 0;
		rock01.y = 0;
		scratch_scene.addChild(rock01);
		var rock02 = new Sprite(50, 50);
		rock02.image = game.assets["assets/rock02.png"];
		rock02.x = 0;
		rock02.y = rock01.height + rock01.y;
		scratch_scene.addChild(rock02);
		var rock03 = new Sprite(50, 50);
		rock03.image = game.assets["assets/rock03.png"];
		rock03.x = 0;
		rock03.y = rock02.height + rock02.y;
		scratch_scene.addChild(rock03);
		var rock04 = new Sprite(50, 50);
		rock04.image = game.assets["assets/rock04.png"];
		rock04.x = 0;
		rock04.y = rock03.height + rock03.y;
		scratch_scene.addChild(rock04);
		var rock05 = new Sprite(50, 50);
		rock05.image = game.assets["assets/rock05.png"];
		rock05.x = 0;
		rock05.y = rock04.height + rock04.y;
		scratch_scene.addChild(rock05);
		var rock06 = new Sprite(50, 50);
		rock06.image = game.assets["assets/rock06.png"];
		rock06.x = 0;
		rock06.y = rock05.height + rock05.y;
		scratch_scene.addChild(rock06);
		var rock07 = new Sprite(50, 50);
		rock07.image = game.assets["assets/rock07.png"];
		rock07.x = 0;
		rock07.y = rock06.height + rock06.y;
		scratch_scene.addChild(rock07);
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
		
		// Display values for back_button
		back_button = new Sprite(32, 32);
		back_button.image = game.assets["assets/button.png"];
		back_button.x = 0;
		back_button.y = 0;
		
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
        
        // Logic for back_button
		back_button.addEventListener('touchstart', function(){
			game.replaceScene(menu_scene);
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
