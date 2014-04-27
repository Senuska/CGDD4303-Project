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
	game.preload("assets/chara1.png", "assets/button.png", "assets/play_button_small.png", "assets/back_button_small.png", "assets/credits_button_small.png", "assets/options_button_small.png", "assets/tileset.png", "assets/cannon/cannon.png", "assets/tileset.png", "assets/cannon/drill.png", 
				 "assets/bar.png", "assets/HUD.png", "assets/cannon/stack.png", "assets/cannon/smoke.png");
	
	
	// Binds spacebar to a-button
	game.keybind(32, 'a');
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
		var c_back_button = new Sprite(147, 30);
		c_back_button.image = game.assets["assets/back_button_small.png"];
		c_back_button.x = 0;
		c_back_button.y = game.height - c_back_button.height;
		
		// Input logic for back_button
		c_back_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(menu_scene);
        });
		
		
		credits_scene.addChild(credits01);
		credits_scene.addChild(credits02);
		credits_scene.addChild(credits03);
		credits_scene.addChild(credits04);
		credits_scene.addChild(credits05);
		credits_scene.addChild(c_back_button);
		
		// -------------------------
		// Define the Options Scene
		// -------------------------
		
		options_scene.addChild(test_button);
		
		var o_back_button = new Sprite(147, 30);
		o_back_button.image = game.assets["assets/back_button_small.png"];
		o_back_button.x = 0;
		o_back_button.y = game.height - o_back_button.height;
		
		// Input logic for back_button
		o_back_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(menu_scene);
        });
		options_scene.addChild(o_back_button);
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
           	   [x] Be sure to make block groups (to onload and offload based on stage coordinates to prevent lag)
           [ ] Rotate drill correctly and remove 'snapback bug'
           [ ] Add conditions to remove drill, like low velocity or cargo met.
           [x] Prevent drill movement after it reaches center screen (while shooting, stop movement)
           [x] HUD update (make it look better, maybe bars for power and age)
           [x] Prevent multiple drill shots
           [x] Update cannon image (Make it LOOK BETTA)
           [ ] Add interface for scrolling through map before firing (possibly...)
        */
        
        // Local constant for maximum cannon power
		const MAX_CANNON_POWER = 3;
		play_scene.backgroundColor = "blue";
		
		// Creates the groups to hold various objects
		var stage = new Group();
		var blockGroup = [];
		var hud = new Group();
		
		// Defines the level with blocks (for STAGE)
		stage.x = 0;
		stage.y = 0;
		stage.STAGE_ORIGIN = 0;
        
        // Class that creates a single block chunk (10 x 50)
    	var BlockChunk = enchant.Class.create(enchant.Group, {
       	 	initialize: function(x, y, chunkType) {
       	 		enchant.Group.call(this);

      	     	if(chunkType == 1)
      	     	{
      	     		for(var i = 0; i < 10; i++)
					{
						for(var j = 0; j < 50; j++)
						{
							if(i == 0) 
							{
								var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
								block.frame = 0;
							}
							else if(i <= 9)
							{
							 	var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
				 				block.frame = 1;	
							}	

      	 	 				block.image = game.assets["assets/tileset.png"];
      	 	 				block.position = {x: ((j*16) + x), y: ((i*16) + y)};
      						this.addChild(block);				
						}
					}      	     		
      	     	}
				
				this.bottom = (16 * 10) + y;
				this.right = (16 * 50) + x;
				this.left = x;
				this.top = y;
				this.isActive = true;
				
				// Removing images prevents lag
        		this.addEventListener("enterframe", function(){
        			if(this.right < -stage.x || this.bottom < -stage.y) 
        			{
        				stage.removeChild(this);
        				this.isActive = false;
       			 	}
        	
        			if(this.isActive == false) 
        			{
        				stage.addChild(this);
        				this.isActive = true;
        			}
        		});
        		
				blockGroup.push(this);
       	 	}
    	});

		for(var i = 0; i < 6; i++)
		{
			var blockChunk = new BlockChunk(0, 300 + (i * 160), 1);	
		} 
        
        for(var i = 0; i < 6; i++)
		{
			stage.addChild(blockGroup[i]);
		}
		
		// Defines player stat picture and text (for HUD)
		var hudPic = new Sprite(200, 50);
		hudPic.image = game.assets["assets/HUD.png"];
		hudPic.x = 90;
		hudPic.y = 0;
		var hudLabel = new Label();
		hudLabel.text = "0 / 100";
		hudLabel.x = 220;
		hudLabel.y = 27;
		hud.addChild(hudPic);
		hud.addChild(hudLabel);
		
		// Display values for back_button
		var p_back_button = new Sprite(147, 30);
		p_back_button.image = game.assets["assets/back_button_small.png"];
		p_back_button.x = 0;
		p_back_button.y = game.height - p_back_button.height;
		
		// Input logic for back_button
		p_back_button.addEventListener('touchstart', function(mousePos){
			game.replaceScene(menu_scene);
        });
		hud.addChild(p_back_button);
		
		// Defines cannon power bar (for HUD)
        var powerBar = new Bar(50, 325);
        powerBar.image = game.assets["assets/bar.png"];
       	powerBar.maxvalue = 96;
        powerBar.value = 0;
        powerBar.addEventListener("enterframe", function() {
				this.value = (cannon.power * 32);
            });
        hud.addChild(powerBar);
        
        // Defines cannon object (for STAGE)
        var cannon = new Sprite(100, 50);
        cannon.image = game.assets["assets/cannon/cannon.png"];    
		cannon.x = 50;
		cannon.y = 215; 
		cannon.power = 0.0;
		cannon.buildingPower = false;
		cannon.canFire = true;
		cannon.ammo = 3;
		cannon.cargo = 0;

        cannon.addEventListener("enterframe", function(){
        	if(game.input.a && !cannon.buildingPower && cannon.canFire) cannon.buildingPower = true;
        	else if(game.input.a && cannon.buildingPower && cannon.power < MAX_CANNON_POWER) cannon.power += 0.1;
        	
        	if(!game.input.a && cannon.buildingPower && cannon.canFire)
        	{
        		cannon.canFire = false;
        		
        		if(cannon.ammo > 0)
        		{
        			cannon.ammo -= 1;
        			var drill = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.3, true);
       		 		drill.image = game.assets["assets/cannon/drill.png"];
       		 		drill.frame = 0;
       		 		drill.rotation = cannon.rotation;
       				drill.x = (Math.cos(this.rotation * 3.14159/180) * (cannon.width / 2)) + (cannon.x + (cannon.width / 2) - (drill.width / 2));
       	 			drill.y = (Math.sin(this.rotation * 3.14159/180) * cannon.height) + (cannon.y + ((cannon.height / 2) - (drill.height / 2)));
       	 			
       		  		drill.applyImpulse(new b2Vec2(Math.cos(cannon.rotation * 3.14159/180) * cannon.power, Math.sin(cannon.rotation * 3.14159/180) * cannon.power));
  	    		 	drill.addEventListener("enterframe", function(){
  	    	 		
  	    	 			this.frame = this.age % 6;
  	    	 			//this.angle = this.age;
  	    	 			this.contact(function (object) {
  	    	 				if(object.frame != 3)
  	    	 				{
  	    	 					cannon.cargo++;
								object.destroy();
  	    	 				}
						});
						
						if((game.width / 2 - this.x) <= 0) stage.x = (game.width / 2 - this.x);
						if((game.height / 2 - this.y) <= 0) stage.y = (game.height / 2 - this.y);

						//Possibly edit this to add velocity constraint
						if(cannon.cargo >= 1000 || this.age >= 200) 
						{
							this.destroy();
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
     
        var cannonStack = new Sprite(114, 103);
        cannonStack.image = game.assets["assets/cannon/stack.png"];
        cannonStack.x = cannon.x - 35;
        cannonStack.y = cannon.y - 25;
        
        var cannonSmoke = new Sprite(40, 46);
        cannonSmoke.image = game.assets["assets/cannon/smoke.png"];
        cannonSmoke.x = cannonStack.x + 52;
        cannonSmoke.y = cannonStack.y - 47;
        cannonSmoke.addEventListener("enterframe", function() {
        	this.frame = (this.age/4) % 6;
        });
   
        stage.addChild(cannon);
        stage.addChild(cannonSmoke);
        stage.addChild(cannonStack);
                
        // Defines drill sprites (for HUD)
		for(var i = 0; i < 3; i++)
		{
			var drillLife = new Sprite(16, 16);
			drillLife.image = game.assets["assets/cannon/drill.png"];
			drillLife.frame = 0;
			drillLife.rotation = 90;
			drillLife.ID = i;
			drillLife.x = 216 + (16 * i);
			drillLife.y = 7;
			drillLife.addEventListener("enterframe", function() {
				if(cannon.ammo <= this.ID) this.remove();
				else this.frame = this.age % 6;
			});
			hud.addChild(drillLife);
		}
        
        // Logic for physics steps
        play_scene.addEventListener("enterframe", function () {
        	physicsWorld.step(game.fps);
        	hudLabel.text = (cannon.cargo + " / 100");
        });
        
        // Adds groups to play_scene
        play_scene.addChild(stage);
        play_scene.addChild(hud);
    };
    game.start();
};