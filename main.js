enchant();
window.onload = function(){
	
	// Creates game variable and preloads art assets for every scene
    var game = new Game(800, 600);
    var physicsWorld = new PhysicsWorld(0, 9.8);
    	var menu_scene = new Scene();
    	var play_scene = new Scene();
    game.fps = 30;
	game.preload("assets/chara1.png", "assets/button.png", "assets/cannon/cannon.png", "assets/tileset.png", "assets/cannon/drill.png", 
				 "assets/bar.png", "assets/HUD.png", "assets/cannon/stack.png", "assets/cannon/smoke.png");
	
	// Binds spacebar to a-button
	game.keybind(32, 'a');
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
           	   - Be sure to make block groups (to onload and offload based on stage coordinates to prevent lag)
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
		var blockGroupA = new Group();
		var hud = new Group();
		
		// Defines the level with blocks (for STAGE)
		stage.x = 0;
		stage.y = 0;
		stage.STAGE_ORIGIN = 0;

		for(var i = 0; i < 10; i++)
		{
			for(var j = 0; j < 50; j++)
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
      			blockGroupA.addChild(block);				
			}
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
		
		// Defines back button (for HUD)
		var back_button = new Sprite(32, 32);
		back_button.image = game.assets["assets/button.png"];
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
  	    	 			this.contact(function (object) {
  	    	 				if(object.frame == 1) cannon.cargo++;
							object.destroy();
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
        stage.addChild(blockGroupA);
        
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