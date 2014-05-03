enchant();
window.onload = function(){
	
	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
	// Creates the different scenes used throughout the game
    var menu_scene = new Scene();
    var play_scene = new Scene();
	var scratch_scene = new Scene();
    var how_to_play_scene = new Scene();
	var credits_scene = new Scene();
	var options_scene = new Scene();
	// Credits (labels are placeholders)
	var credits01 = new Label("Credits:");
	var credits02 = new Label("Cameron Herbert");
	var credits03 = new Label("Samuel Erik Swanson");
	var credits04 = new Label("Chad Rush");
	var credits04 = new Label("Special Thanks:");
	var credits05 = new Label("Mrs. Stormi Johnson's 3rd Grade Class");
	/* 
	   Array of rock objects to pass onto hardness/streak tests	
	   Topsoil, Soil, Stone, Talc, Gypsum, Calcite, Fluorite, Apatite, Feldspar, Quartz, Topaz, Corundum
	*/ 
	var collectedRocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	// Default button variables
	var play_button;
	var scratch_button;
	var back_button;
	var credits_button;
    game.fps = 30;
	game.preload("assets/button.png", "assets/cannon/cannon.png", "assets/tileset.png", "assets/cannon/drill.png", "assets/bar.png", "assets/HUD.png", 
				"assets/cannon/stack.png", "assets/cannon/smoke.png", "assets/htp/drillOne.png", "assets/scoreHUD.png", "assets/play_button_small.png", 
				"assets/back_button_small.png", "assets/credits_button_small.png", "assets/options_button_small.png", "assets/htp/drillTwo.png", 
				"assets/htp/drillThree.png");
	
	
	// Binds spacebar to a-button
	game.keybind(32, 'a');
    game.onload = function(){
		
		//game.pushScene(menu_scene);
		game.pushScene(how_to_play_scene);
		// ----------------------
		// Define the Menu Scene
		// ----------------------
		
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
		
		// Display values for scratch_button
		scratch_button = new Sprite(64, 32);
		scratch_button.image = game.assets["assets/button.png"];
		scratch_button.x = game.width/2 - scratch_button.width;
		scratch_button.y = game.height - scratch_button.height;
		menu_scene.addChild(scratch_button);
		
		// Input logic for scratch_button
		scratch_button.addEventListener('touchstart', function(){
			game.replaceScene(scratch_scene);
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
		
		// -------------------------
		// Define Scratch Scene
		// -------------------------

		
		// Display values for back_button
		var sc_back_button = new Sprite(147, 30);
		sc_back_button.image = game.assets["assets/back_button_small.png"];
		sc_back_button.x = 0;
		sc_back_button.y = game.height - sc_back_button.height;
		scratch_scene.addChild(sc_back_button);
		
		// Input logic for back_button
		sc_back_button.addEventListener('touchstart', function(){
			game.replaceScene(menu_scene);
        });
		
        // -------------------------
		// Define How To Play Scene
		// -------------------------
		var instructions = new Sprite(609, 457);
		instructions.x = 0;
		instructions.y = 0;
		instructions.index = 1;
		instructions.isDown = false;
		instructions.addEventListener("enterframe", function(){
		
			if(game.input.a && !this.isDown) 
			{
				this.index++;
				this.isDown = true;	
			}
			else if(!game.input.a) this.isDown = false;
		
			if(this.index == 1) this.image = game.assets["assets/htp/drillOne.png"];
			else if(this.index == 2 ) this.image = game.assets["assets/htp/drillTwo.png"];
			else if(this.index == 3) this.image = game.assets["assets/htp/drillThree.png"];
			else game.replaceScene(menu_scene);
		});
		
		
		
		how_to_play_scene.addChild(instructions);
		
		game.pushScene(how_to_play_scene);

		// -------------------------
		// Define the Scratch Scene
		// -------------------------
		
		
		
		// -------------------------
		// Define the Options Scene
		// -------------------------
		
		// Display values for o_back_button
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
           [x] Level Design (at least one level)
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
        
        // Class that creates a single block chunks (5 x 25) based on an input type
    	var BlockChunk = enchant.Class.create(enchant.Group, {
       	 	initialize: function(x, y, chunkType) {
       	 		enchant.Group.call(this);

      	     		for(var i = 0; i < 5; i++)
					{
						for(var j = 0; j < 25; j++)
						{	
							if(chunkType == 1)
							{	
								if(i == 0) 
								{
									var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
									block.frame = 0;
								}
								else
								{
								 	var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
			 						block.frame = 1;	
								}									
							}	
							else if(chunkType == 2)
							{
								var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
								
								if(rand(20) == 1) block.frame = 4;
								else block.frame = 1;
							}
							else if(chunkType == 3)
							{
								if(i <= 1) 
								{
									var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
									
									if(rand(30) == 1) block.frame = 5;
									else block.frame = 1;
								}
								else
								{
								 	var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
								 	
								 	if(rand(40) == 1) block.frame = 6;
								 	else block.frame = 2;	
								}
							}
							else if(chunkType == 4)
							{
								var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
								
								if(rand(70) == 1) block.frame = 9;
								else if(rand(60) == 1) block.frame = 8;
								else if(rand(50) == 1) block.frame = 7;
							    block.frame = 2;
							}
							else if(chunkType == 5)
							{
								if(i < 4) 
								{
									var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
									
									if(rand(100) == 1) block.frame = 12;
									else if(rand(90) == 1) block.frame = 11;
									else if(rand(80) == 1) block.frame = 10;
									else block.frame = 2;
								}
								else
								{
								 	var block = new PhyBoxSprite(32, 32, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0, true);
			 						block.frame = 3;	
								}
							}
							
							block.image = game.assets["assets/tileset.png"];
       	 					block.position = {x: ((j*32) + x), y: ((i*32) + y)};
      						this.addChild(block);			
						}
				}      	     		
				
				this.bottom = (32 * 5) + y;
				this.right = (32 * 25) + x;
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
        				if(this.left < (-stage.x + game.width) || this.top < (-stage.y + game.height))
        				{
        					stage.addChild(this);
        					this.isActive = true;      					
        				}
        			}
        		});
        		
				blockGroup.push(this);
       	 	}
    	});

		/*-------------------------------
		   Chunk Types:
			1) Top Soil
			2) All Dirt
			3) Dirt/Stone
			4) All Stone
			5) Stone with bottom layer
		  -------------------------------*/
		
		var blockChunk;
		
		// This nested loop creates super flat level!
		for(var i = 0; i < 5; i++)
		{
			for(var j = 0; j < 2; j++)
			{
				blockChunk = new BlockChunk((j * 800), 300 + (i * 160), (i + 1));
			}	
		}
        
        // Loads all block chunks into the "stage"
        for(var i = 0; i < 10; i++)
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
		var hudScore = new Sprite(400, 400);
		hudScore.image = game.assets["assets/scoreHUD.png"];
		hudScore.x = 100;
		hudScore.y = 100;
		hudScore.addEventListener("enterframe", function(){
			if(game.input.a) game.replaceScene(scratch_scene);
		});

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
		cannon.gameOver = false;
		cannon.ammo = 4;
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
  	    	 					collectedRocks[object.frame]++;
								object.destroy();
  	    	 				}
						});
						
						if((game.width / 2 - this.x) <= 0) stage.x = (game.width / 2 - this.x);
						if((game.height / 2 - this.y) <= 0) stage.y = (game.height / 2 - this.y);

						//Possibly edit this to add velocity constraint
						if(cannon.cargo >= 1000 || this.age >= 200) 
						{
							this.destroy();
							if(cannon.ammo != 0) cannon.canFire = true;
							else cannon.gameOver = true;
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
		for(var i = 0; i < cannon.ammo; i++)
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
        	
        	// Add final score details and rocks collected here
        	if(cannon.gameOver) 
        	{
        		stage.removeChild(cannon);
        		stage.removeChild(cannonSmoke);
        		stage.removeChild(cannonStack);
        		stage.addChild(hudScore);
        		hudLabel.x = hudScore.x + 100;
        		hudLabel.y = hudScore.y + 71;
        		
        		var totalScore = 0;
        		
        		for(var i = 0; i < 11; i++)
        		{
        			totalScore += (collectedRocks[i] * ((i + 1) * 5));
        		}
        		
        		hudLabel.text = ("x  " + collectedRocks[0] + " = " + collectedRocks[0] * 5 + "<br/>" +
        						 "x  " + collectedRocks[1] + " = " + collectedRocks[1] * 10 + "<br/>" +
        						 "x  " + collectedRocks[2] + " = " + collectedRocks[2] * 15 + "<br/>" +
        						 "x  " + collectedRocks[3] + " = " + collectedRocks[3] * 20 + "<br/>" +
        						 "x  " + collectedRocks[4] + " = " + collectedRocks[4] * 25 + "<br/>" +
        						 "x  " + collectedRocks[5] + " = " + collectedRocks[5] * 30 + "<br/>" +
        						 "x  " + collectedRocks[6] + " = " + collectedRocks[6] * 35 + "<br/>" +
        						 "x  " + collectedRocks[7] + " = " + collectedRocks[7] * 40 + "<br/>" +
        						 "x  " + collectedRocks[8] + " = " + collectedRocks[8] * 45 + "<br/>" +
        						 "x  " + collectedRocks[9] + " = " + collectedRocks[9] * 50 + "<br/>" +
        						 "x  " + collectedRocks[10] + " = " + collectedRocks[10] * 55 + "<br/>" +
        						 "x  " + collectedRocks[11] + " = " + collectedRocks[11] * 60 + "<br/>" +
        						 totalScore);
        	}
        });
        
        // Adds groups to play_scene
        play_scene.addChild(stage);
        play_scene.addChild(hud);
    };
    game.start();
};

function rand(num){
    return Math.floor(Math.random() * num);
}