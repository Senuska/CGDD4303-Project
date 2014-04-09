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

		/* Physics objects follow this format: function(staticOrDynamic, density, friction, restitution, awake)
           staticOrDynamic: Does this object move?
           Density:			Heaviness of object
           Friction:		Higher friction produces less slipperiness
           Restitution:		Bounceback of collisions
           Awake:			Object recognizes forces
        */
        
		// Creates the test floor as a group
		// To-do: Place this inside of one method or have a better way to generate terrain
		var floorGroup = new Group();
		
		for(var i = 0; i < 20; i++)
		{
        	var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.01, true);
        	block.image = game.assets["assets/tileset.png"];
        	block.frame = 0;
        	block.position = { x: i*16, y: 300 };
      		floorGroup.addChild(block);
        }
        
        for(var i = 1; i < 4; i++)
        {
        	for(var j = 0; j < 20; j++)
        	{
        		var block = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.25, true);
        		block.image = game.assets["assets/tileset.png"];
        		block.frame = 1;
        		block.position = {x: j*16, y: 300 + (i*16)};
        		floorGroup.addChild(block);
        	}	
        }
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

		// Various values for cannon
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
        		// Bug: Drill spawns correctly rotated, but then snaps back to straight orientation
        		var drill = new PhyBoxSprite(16, 16, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.3, true);
       		 	drill.image = game.assets["assets/drill.png"];
       		 	drill.frame = 0;
       		 	drill.rotation = cannon.rotation;
       			drill.x = (Math.cos(this.rotation * 3.14159/180) * (cannon.width / 2)) + (cannon.x + (cannon.width / 2) - (drill.width / 2));
       	 		drill.y = (Math.sin(this.rotation * 3.14159/180) * cannon.height) + (cannon.y + ((cannon.height / 2) - (drill.height / 2)));
        	
         		drill.applyImpulse(new b2Vec2(Math.cos(cannon.rotation * 3.14159/180) * cannon.power, Math.sin(cannon.rotation * 3.14159/180) * cannon.power));
  	    	 	drill.addEventListener("enterframe", function(){
  	    	 		
  	    	 		// To-do: Add conditions to remove drill. ie: Low velocity or cargo met.
  	    	 		this.frame = this.age % 6;
  	    	 		drill.contact(function (object) {
						object.destroy();
					});
           	   	});
           	   		
           	   	cannon.buildingPower = false;
           	   	cannon.power = 0.0;
           	   	play_scene.addChild(drill);
        	}
        	
        	if(game.input.up && this.rotation > -90) this.rotate(-1);					
			if(game.input.down && this.rotation < 0) this.rotate(1);
        });
        
        // Adds all items to the play_scene
        play_scene.addChild(back_button);
        play_scene.addChild(cannon);
        play_scene.addChild(floorGroup);
        play_scene.addChild(powerLabel);
    };
    game.start();
};
