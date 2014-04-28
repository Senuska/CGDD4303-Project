enchant();
window.onload = function(){
	
	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    var menu_scene = new Scene();
    var play_scene = new Scene();
	var scratch_scene = new Scene();
    	var how_to_play_scene = new Scene();
	var credits_scene = new Scene();
	var play_button;
	var scratch_button;
	var back_button;
	var credits_button;
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/cannon/cannon.png", "assets/tileset.png", "assets/cannon/drill.png", 
				 "assets/bar.png", "assets/HUD.png", "assets/cannon/stack.png", "assets/cannon/smoke.png", "assets/scoreHUD.png",
				 "assets/htp/drillOne.png", "assets/htp/drillTwo.png", "assets/htp/drillThree.png");
	
	// Binds spacebar to a-button
	game.keybind(32, 'a');
    game.onload = function(){
		
		//game.pushScene(menu_scene);
		game.pushScene(how_to_play_scene);
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
        play_button.addEventListener('touchstart', function(){
			game.replaceScene(play_scene);
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
		
		menu_scene.addChild(play_button);
		
		scratch_button = new Sprite(64, 32);
		scratch_button.image = game.assets["assets/button.png"];
		scratch_button.x = game.width/2 - scratch_button.width;
		scratch_button.y = game.height - scratch_button.height;
		
		scratch_button.addEventListener('touchstart', function(){
			game.replaceScene(scratch_scene);
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
		
		menu_scene.addChild(scratch_button);
		
		how_to_play_scene.addChild(instructions);

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
		
		// Array of rock objects to pass onto hardness/streak tests
		
		// Topsoil, Soil, Stone, Talc, Gypsum, Calcite, Fluorite, Apatite, Feldspar, Quartz, Topaz, Corundum
		var collectedRocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		
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
		back_button.addEventListener('touchstart', function(){
			game.replaceScene(menu_scene);
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
			if(game.input.a) game.replaceScene(menu_scene);
		});
		
		// Defines back button (for HUD)
		var back_button = new Sprite(32, 32);
		back_button.image = game.assets["assets/button.png"];
		back_button.frame = 2;
		back_button.x = 0;
		back_button.y = 0;
		back_button.addEventListener('touchstart', function(){
			game.replaceScene(menu_scene);
        });
		hud.addChild(back_button);
		
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
		cannon.ammo = 1;
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