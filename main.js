enchant();
window.onload = function(){

	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    	var menu_scene = new Scene();
    	var play_scene = new Scene();
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/cannon.png", "assets/tileset.png", "assets/drill.png");
    game.onload = function(){
		
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		game.pushScene(menu_scene);
		
		// Display values for play_button
		play_button = new Sprite(64, 32);
		play_button.image = game.assets["assets/button.png"];
		play_button.x = game.width/2 - 32;
		play_button.y = game.height/2
		menu_scene.addChild(play_button);
		
		// Input logic for play_button
        play_button.addEventListener('touchstart', function(){
			game.replaceScene(play_scene);
        });
        
		// ----------------------
		// Define the Play Scene
		// ----------------------

		/* Physics objects follow this format: function(staticOrDynamic, density, friction, restitution, awake)
           staticOrDynamic: Move or stationary
           Density:			Heaviness of object
           Friction:		Higher friction produces less slipperiness
           Restitution:		Rebound amount
           Awake:			Object recognizes forces
        */
        
        /*
           Cameron's To-Do List of Stuff To Do:
           [x] Update physics boxes along with images for blocks
           [ ] Level Design (at least one level)
           [ ] Rotate drill correctly and remove 'snapback bug'
           [ ] Add conditions to remove drill. ie: Low velocity or cargo met.
           [x] Prevent drill movement after it reaches center screen (while shooting, stop movement)
           [ ] HUD update (make it look better, maybe bars for power and age)
           [x] Prevent multiple drill shots
           [ ] Update cannon image (Make it LOOK BETTA)
           [ ] Add interface for scrolling through map before firing (waypoints?)
        */
        
		// Creates the stage group to hold level blocks and cannon
		var stage = new Group();
		stage.x = 0;
		stage.y = 0;
		stage.STAGE_ORIGIN = 0;

		for(var i = 0; i < 10; i++)
		{
			for(var j = 0; j < 20; j++)
			{
				if(i == 0) 
				{
					var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
					block.frame = 0;
				}
				else
				{
				 	var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.25, true);
				 	block.frame = 1;	
				}

        		block.image = game.assets["assets/tileset.png"];
        		block.position = {x: (j*16), y: ((i*16) + 300)};
      			stage.addChild(block);				
			}
        }
        
		// Local constant for maximum cannon power
		const MAX_CANNON_POWER = 3;
		const CANNON_TEXT = "Cannon Power: ";
		const AMMO_TEXT = "Drills Remaining: ";
		const CARGO_TEXT = "Total Cargo: ";
		play_scene.backgroundColor = "blue";
		
		// Binds spacebar to a-button
		game.keybind(32, 'a');
		
		// Label for 'HUD'
		var hudLabel = new Label("");
		hudLabel.x = 200;
		
		// Display values for back_button
		var back_button = new Sprite(32, 32);
		back_button.image = game.assets["assets/button.png"];
		back_button.x = 0;
		back_button.y = 0;

		// Various values for cannon
        var cannon = new Sprite(100, 50);
        cannon.image = game.assets["assets/cannon.png"];    
		cannon.x = 50;
		cannon.y = 250; 
		cannon.power = 0.0;     		//Current cannon launch power
		cannon.buildingPower = false;	// Prevents machine gun cannon
		cannon.canFire = true;
		cannon.ammo = 3;
		cannon.cargo = 0;
        
        // Logic for physics steps
        play_scene.addEventListener("enterframe", function () {
        	physicsWorld.step(game.fps);
        	hudLabel.text = (CANNON_TEXT + cannon.power.toFixed(1) + " | " + AMMO_TEXT + cannon.ammo + " |                  	   " + CARGO_TEXT + cannon.cargo + "/100");
        });
        
        // Logic for back_button
		back_button.addEventListener('touchstart', function(){
			game.replaceScene(menu_scene);
        });

		// Logic for cannon
        cannon.addEventListener("enterframe", function(){
        	if(game.input.a && !cannon.buildingPower && cannon.canFire) cannon.buildingPower = true;
        	else if(game.input.a && cannon.buildingPower)
        	{
				cannon.power += 0.1;
				if(cannon.power > MAX_CANNON_POWER) cannon.power = MAX_CANNON_POWER;
        	}
        	
        	if(!game.input.a && cannon.buildingPower && cannon.canFire)
        	{
        		cannon.canFire = false;
        		
        		if(cannon.ammo > 0)
        		{
        			cannon.ammo -= 1;
        			var drill = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.3, true);
       		 		drill.image = game.assets["assets/drill.png"];
       		 		drill.frame = 0;
       		 		drill.rotation = cannon.rotation;
       				drill.x = (Math.cos(this.rotation * 3.14159/180) * (cannon.width / 2)) + (cannon.x + (cannon.width / 2) - (drill.width / 2));
       	 			drill.y = (Math.sin(this.rotation * 3.14159/180) * cannon.height) + (cannon.y + ((cannon.height / 2) - (drill.height / 2)));
        	
       		  		drill.applyImpulse(new b2Vec2(Math.cos(cannon.rotation * 3.14159/180) * cannon.power, Math.sin(cannon.rotation * 3.14159/180) * cannon.power));
  	    		 	drill.addEventListener("enterframe", function(){
  	    	 		
  	    	 			this.frame = this.age % 6;
  	    	 			drill.contact(function (object) {
  	    	 				if(object.frame == 1) cannon.cargo++;
							object.destroy();
						});
						
						if((game.width / 2 - drill.x) <= 0) stage.x = (game.width / 2 - drill.x);
						if((game.height / 2 - drill.y) <= 0) stage.y = (game.height / 2 - drill.y);

						//Possibly edit this to add velocity constraint
						if(cannon.cargo >= 100 || this.age >= 100) 
						{
							drill.destroy();
							cannon.canFire = true;
							stage.x = stage.STAGE_ORIGIN;
							stage.y = stage.STAGE_ORIGIN;
						}
           	   		});

           	   		stage.addChild(drill);        			
        		}
        		
        		cannon.power = 0.0;
           	   	cannon.buildingPower = false;
        	}
        	
        	if(game.input.up && this.rotation > -90) this.rotate(-1);					
			if(game.input.down && this.rotation < 0) this.rotate(1);
        });
        
        stage.addChild(cannon);
        
        // Adds all items to the play_scene
        play_scene.addChild(back_button);
        play_scene.addChild(stage);
        play_scene.addChild(hudLabel);
    };
    game.start();
};