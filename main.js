/**
 * enchant();
 * Preparation for using enchant.js.
 * (Exporting enchant.js class to global namespace.
 *  ex. enchant.Sprite -> Sprite etc..)
 *
 */
enchant();

/*
 * window.onload
 *
 * The function which will be executed after loading page.
 * Command in enchant.js such as "new Core();" will cause an error if executed before entire page is loaded.
 *
 */
window.onload = function(){
    /**
     * new Core(width, height)
     *
     * Make instance of enchant.Core class. Set window size to 320 x 320
     */
    var game = new Core(400, 400);

    /**
     * Core.fps
     *
     * Set fps (frame per second) in this game to 30.
     */
    game.fps = 30;
    /**
     * Core.preload
     *
     * You can preload all assets files before starting the game.
     * Set needed file lists in relative/absolute path for attributes of Core.preload
     */
    game.preload("Background.png", "Cannon.png", "Bullet.png");

    /**
     * Core.onload
     *
     * game.onload = function(){
     *     // code
     * }
     *
     * game.addEventListener("load", function(){
     *     // code
     * })
     */
    game.onload = function(){

        backgroundImage = new Sprite(400, 400);
        cannon = new Sprite(100, 50);
        bullet = new Sprite(50, 50);

        backgroundImage.image = game.assets["Background.png"];
        cannon.image = game.assets["Cannon.png"];
        bullet.image = game.assets["Bullet.png"];

        backgroundImage.x = 0;
        backgroundImage.y = 0;
        
        cannon.x = 50;
        cannon.y = 250;
        
        bullet.x = 100;
        bullet.y = 0;

        backgroundImage.frame = 0;
        cannon.frame = 0;
        bullet.frame = 0;
        
        game.rootScene.addChild(backgroundImage);
        game.rootScene.addChild(cannon);
      

        /*
          Add an event to an object:

          EventTarget.addEventListener(event, listener)
         */         
        	cannon.addEventListener("touchstart", function(){
        		bullet.x = 100;
        		bullet.y = 0;
            	game.rootScene.addChild(bullet);  
        	});
		
		
        bullet.addEventListener("enterframe", function(){

            this.x += 10;
            
            if(this.x >= 400)
            {
            	game.rootScene.removeChild(this);	
            }
        });

    };

    game.start();
};
