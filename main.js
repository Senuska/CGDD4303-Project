enchant();

var game, physicsWorld;
const MAX_CANNON_POWER = 3;

window.onload = function(){

	//Window size of game
    game = new Game(800, 600);
    game.fps = 30;
	game.preload("Background.png", "Cannon.png", "DrillBall.png");
	
	//Code for game is set right after it begins. (First scene, starting menu, etc)
    game.onload = function(){
		
		game.rootScene.backgroundColor = "blue";
		physicsWorld = new PhysicsWorld(0, 9.8);
		
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
        
        //EventTarget.addEventListener(event, listener)        
        
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
        });
        		
		cannon.addEventListener("enterframe", function(){
			if(game.input.up && this.rotation > -90) this.rotate(-1);					
			if(game.input.down && this.rotation < 0) this.rotate(1);
        });
    };

    game.start();
};
