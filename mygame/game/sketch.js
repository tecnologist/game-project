/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
var game_score;
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees_x;
var collectable;
var canyon;
var cloud;
var bird;
var flag_Pole;
var lives;
var platforms;
var enemies;


var jumpSound;
var fallingSound;
var coinSound;
var levelComplete;
var backgroundMusic;
var s;

 function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    fallingSound=loadSound('assets/falling sound.wav');
    coinSound=loadSound('assets/coin2.mp3');
    levelComplete=loadSound('assets/levelup3.wav');
    backgroundMusic=loadSound('assets/background.mp3');
    deathSound=loadSound('assets/deathsound.wav')
    
    jumpSound.setVolume(0.1);
    fallingSound.setVolume(0.1);
    backgroundMusic.setVolume(0.2);
    levelComplete.setVolume(0.1);
    
}






function setup()
{   
    
	createCanvas(1024, 576);
    
    //s.play();
    floorPos_y = height * 3/4;
    lives=3;
    
    startGame();
    backgroundMusic.loop();
    
  
}



function draw()

{
    
  
  background(100, 155, 255); // fill the sky blue
 
  
  // draw lives counter 
    
  fill(255);
  noStroke();
  textSize(15);
    
  for(var i=0;i<lives;i++)
    {
        push();
        noStroke();
        fill(200,100,100);
        ellipse(25+i*37,42,15);
    
        fill(255,0,0);
        rect(18+(i*37),50,15,18);
    
        fill(0);
        rect(32+(i*37),66,6,6);
        rect(14+(i*37),66,6,6);
    
        stroke(0);
        strokeWeight(3);
        line(33+(i*37),55,39+(i*37),46);
        line(18+(i*37),55,11+(i*37),47);
        pop();
        
   }
    
    
     
    text("Game Score :"+" "+game_score,20,20);//draw game score counter
    
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    
    push();
    translate(scrollPos,0);
    
   
    
    
    
	// Draw clouds.
    drawCloud();
    
	// Draw mountains.
    drawMountain();
    
	// Draw trees.
    drawTrees();
    
    //function draw birds
    drawBird();
    
    //function flag pole
    renderFlagpole();
    
    
    
	// Draw canyons.
    
    for(var j=0;j<canyon.length;j++)
        {
            if(isPlummeting==false)
                {
                    drawCanyon(canyon[j]);
                    checkCanyon(canyon[j]);
                }
            else{
                  isPlummeting=false;
                }
        }
    
    
    for(var i=0;i<platforms.length;i++)
    {
        platforms[i].draw();
        
        
    }
    
    
	// Draw collectable items.
    for(var i=0;i<collectable.length;i++)
        {
            if(collectable[i].isFound==false)
             {
            
                 drawCollectable(collectable[i]);
                 checkCollectable(collectable[i]);
             }
             else
             {
               collectable[i].isFound=true;
             }
            
    
    
    
    
    
    checkPlayerDie()
    
    
             
        }
   
       

      
     for (var i=0;i<enemies.length;i++)
        {
            enemies[i].draw();
            var isContact=enemies[i].checkContact(gameChar_world_x,gameChar_y)
           if(isContact)
               {
                  backgroundMusic.stop();
                   if(lives>0)
                  {
                   deathSound.play();
                   startGame()
                   backgroundMusic.loop();
                   lives-=1;
                   break;
                  }
               }
        }
     
   pop();
    
    
    
     if(lives<1)
           {
              backgroundMusic.stop();
              stroke(0);
              fill("red");
              textSize(40);
              text("Game over. Press space to continue.",width/4,height/2)
              return
          }
          
    
      if(flag_Pole.isReached)
        {   
            stroke(0);
            fill("cyan");
            textSize(40);
            text("Level complete. Press space to continue.",width/5,height/2)
            levelComplete.play();
            noLoop();
            return
            
        }
    
   
	// Draw game character.
	
	drawGameChar();
    
    
  
	// Logic to make the game character move or the background scroll.
    
	if(isLeft)
	{
        
		if(gameChar_x > width * 0.2)
		{   
            if(gameChar_y<floorPos_y+5)
            {
             gameChar_x-= 2;
            }
        else{
              gameChar_x-=0;
            }
		}
		else
		{
          if(gameChar_y<floorPos_y+5)
            {
			scrollPos += 3;
            }
           else{
                 gameChar_x-=0;
               }
		}
	}

	if(isRight)
	{   
        
		if(gameChar_x < width * 0.8)
		{
            if(gameChar_y<floorPos_y+5)
            {
            gameChar_x+= 2;
            }
            else
            {
                gameChar_x+=0;
            }
		}
		else
		{
            if(gameChar_y<floorPos_y+5)
              {
			    scrollPos -= 3; // negative for moving against the background
              }
            else
                {
                  gameChar_x+=0
                }
       
		}
        
	}

	// Logic to make the game character rise and fall.
    
    if(gameChar_y<floorPos_y)
             {
                 var isContact=false;
                 for(var i=0;i<platforms.length;i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x,gameChar_y)==true)
                    {
                        isFalling=false;
                        isContact=true;
                        
                         break;
                    }
                    
                }
                 
                if(isContact==false)
                {
                  gameChar_y+=1;
            
                  isFalling=true;
                }
             }
             else 
              {
                 isFalling=false;
             
               }
    
    if(flag_Pole.isReached==false )
    {
        checkFlagpole();
    }
    
   

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    


}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
   
     if(key == 'A' || keyCode == 37)
         
	   {  
        
		   isLeft = true;
        
	     
       }

	if(key == 'D' || keyCode == 39)
	  {
		   isRight = true;
           
      }
    
    if(keyCode==32&&gameChar_y==floorPos_y)
      {
            
          
            gameChar_y=gameChar_y-100;
            jumpSound.play();
          
      }
 
  
}

function keyReleased()
{
    
	if(key == 'A' || keyCode == 37)
	  {
		  isLeft = false;
          
	  }

	if(key == 'D' || keyCode == 39)
	  {
		  isRight = false;
          
	  }
}




// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.


function drawGameChar()
{
    
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x,gameChar_y-60,25);
        
        fill(255,0,0);
        rect(gameChar_x-5,gameChar_y-48,10,28);                        
        stroke(0);
        strokeWeight(3);
        line(gameChar_x-7,gameChar_y-45,gameChar_x-20,gameChar_y-50);
        line(gameChar_x-8,gameChar_y-43,gameChar_x-15,gameChar_y-40);
        noStroke();
    
        fill(0);
        rect(gameChar_x-14,gameChar_y-26,10,10);
        rect(gameChar_x-10,gameChar_y-22,10,10);
    }
    
	else if(isRight && isFalling)
        
	{
		// add your jumping-right code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x,gameChar_y-60,25);
    
        fill(255,0,0);
        rect(gameChar_x-5,gameChar_y-48,10,28);
    
        stroke(0);
        strokeWeight(3);
        line(gameChar_x+3,gameChar_y-40,gameChar_x+15,gameChar_y-55);
        line(gameChar_x+6,gameChar_y-40,gameChar_x+15,gameChar_y-45);
        noStroke();
    
        fill(0);
        rect(gameChar_x+4,gameChar_y-26,10,10);
        rect(gameChar_x+1,gameChar_y-22,10,10);
	}
    
	else if(isLeft)
	{
		// add your walking left code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x-2,gameChar_y-45,25);
    
        fill(255,0,0);
        rect(gameChar_x-5,gameChar_y-33,10,28);
    
        fill(0);
        rect(gameChar_x+4,gameChar_y-8,10,10);
        rect(gameChar_x-10,gameChar_y-10,10,10);
    
        stroke(0);
        strokeWeight(3);
        line(gameChar_x-4,gameChar_y-25,gameChar_x-14/*231*/,gameChar_y-20/*317*/);
        line(gameChar_x+12,gameChar_y-15,gameChar_x+6/*251*/,gameChar_y-25/*312*/);
        noStroke();
        
	}
    
	else if(isRight)
	{
		// add your walking right code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x,gameChar_y-45,25);
    
        fill(255,0,0);
        rect(gameChar_x-5,gameChar_y-33,10,28);
        
        fill(0);
        rect(gameChar_x+1,gameChar_y-11,10,10);
        rect(gameChar_x-12,gameChar_y-6,10,10);
        
        stroke(0);
        strokeWeight(3);
        line(gameChar_x+3,gameChar_y-25,gameChar_x+16/*61*/,gameChar_y-23/*317*/);
        line(gameChar_x-6,gameChar_y-26,gameChar_x-12/*29*/,gameChar_y-13/*322*/);
        noStroke(); 
        

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x,gameChar_y-60,25);
    
        fill(255,0,0);
        rect(gameChar_x-12,gameChar_y-48,23,30);
    
        fill(0);
        rect(gameChar_x+10,gameChar_y-24,10,10);
        rect(gameChar_x-20,gameChar_y-24,10,10);
    
        stroke(0);
        strokeWeight(3);
        line(gameChar_x+10,gameChar_y-40,gameChar_x+15,gameChar_y-55);
        line(gameChar_x-10,gameChar_y-40,gameChar_x-15,gameChar_y-55);
        
        
    }
    
    
	else
	{
		// add your standing front facing code
        
        noStroke();
        fill(200,100,100);
        ellipse(gameChar_x,gameChar_y-50,25);
    
        fill(255,0,0);
        rect(gameChar_x-12,gameChar_y-38,25,33);
    
        fill(0);
        rect(gameChar_x+5,gameChar_y-5,10,10);
        rect(gameChar_x-14,gameChar_y-5,10,10);
        
        
        
        
    }         
         
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.


 function drawCloud()
{
    for(var i=0;i<cloud.length;i++)
     {
        noStroke();
	    fill(255);
        ellipse(cloud[i].cloud_Posx+40,cloud[i].cloud_Posy,50,50);
        ellipse(cloud[i].cloud_Posx+80,cloud[i].cloud_Posy,80,70);
        ellipse(cloud[i].cloud_Posx+120,cloud[i].cloud_Posy,50,50);
     }
    
}
// Function to draw mountains objects.

function drawMountain()
{
    
     for(i=0;i<mountain.length;i++)
      {
         noStroke();
          
	     fill(130,97,40);
          
         triangle(mountain[i].pos_x+0,mountain[i].pos_y+432,
                  mountain[i].pos_x+120,mountain[i].pos_y+230,
                  mountain[i].pos_x+230,mountain[i].pos_y+432);
          
         triangle(mountain[i].pos_x-120,mountain[i].pos_y+432,
                  mountain[i].pos_x+20,mountain[i].pos_y+150,
                  mountain[i].pos_x+200,mountain[i].pos_y+432)//mountain
     }
}
// Function to draw trees objects.
function drawTrees()
   {
    for(i=0;i<trees.length;i++)
      {
        noStroke();
        fill(110,90,30);
        rect(trees[i],floorPos_y-97,25,105);
        fill(0,155,0);
        ellipse(trees[i]-20,floorPos_y-97,75,75);
        ellipse(trees[i]+50,floorPos_y-97,75,75);
        ellipse(trees[i]+15,floorPos_y-129,90,105);}//tree
      }
// Function to draw bird objects
function drawBird()
      {
        
       for(i=0;i<bird.length;i++)
          {
          
          noFill();
          stroke(0);
          strokeWeight(1)
          beginShape();
          vertex(bird[i].bird_Posx,bird[i].bird_Posy);
          vertex(bird[i].bird_Posx+15,bird[i].bird_Posy+10);
          vertex(bird[i].bird_Posx+30,bird[i].bird_Posy);
          endShape();
          noStroke();
    
    
          stroke(0);
          beginShape();
          vertex(bird[i].bird_Posx+20,bird[i].bird_Posy+20);
          vertex(bird[i].bird_Posx+35,bird[i].bird_Posy+30);
          vertex(bird[i].bird_Posx+50,bird[i].bird_Posy+20);
          endShape();bird[i]
    noStroke();
          
          }
          
      }
       

     
// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
   {
    noStroke();
    
    fill(100,155,255);
    rect(t_canyon.x_pos+245,432,t_canyon.width,154);
       
    fill(150,117,60);
    triangle(t_canyon.x_pos+245,432,t_canyon.x_pos+225,576,t_canyon.x_pos+245,576);
    triangle(t_canyon.x_pos+245,432,t_canyon.x_pos+245,576,t_canyon.x_pos+265,432);
       
    fill(150,117,60);
    triangle(t_canyon.x_pos+t_canyon.width+245,432,
             t_canyon.x_pos+t_canyon.width+245,576,
             t_canyon.x_pos+t_canyon.width+225,432);
       
    triangle(t_canyon.x_pos+t_canyon.width+245,432,
             t_canyon.x_pos+t_canyon.width+265,576,
             t_canyon.x_pos+t_canyon.width+245,576);
       
    fill(100,155,255);//canyon
   }



 
// Function to check character is over a canyon.

function checkCanyon(t_canyon)
    {
      if( gameChar_world_x>t_canyon.x_pos+285
          &&gameChar_world_x<t_canyon.x_pos+t_canyon.width+207
          &&gameChar_y>=floorPos_y)
         
          {  
            isPlummeting=true;   
          }
        
      else if(gameChar_y>floorPos_y)
          {
            isPlummeting=true;
            
          }
        
      if(isPlummeting==true)
          {
            gameChar_y+=1;
            backgroundMusic.stop()
            fallingSound.play();
            if(gameChar_y>height+20)
            {
             fallingSound.stop();
            }
            
          }
        
    }
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    push();
    fill(255,255,0);
    noStroke();
    ellipse(t_collectable.x_pos+200,t_collectable.y_pos-42,t_collectable.size+20);
    fill(255,215,0);
    noStroke()
    ellipse(t_collectable.x_pos+200,t_collectable.y_pos-42,t_collectable.size+13)
    
    stroke(0);
    strokeWeight(1.5);
    textSize(t_collectable.size+10);
    text('£',t_collectable.x_pos+197-t_collectable.size*0.25,t_collectable.y_pos-39+t_collectable.size/2.7);//collectable
    noStroke();
    pop();
}

// Function to check character has collected an item.


function checkCollectable(t_collectable)

{
  if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos+200,t_collectable.y_pos)<=t_collectable.size+22 )
      
    {
        t_collectable.isFound=true;
        
        coinSound.play();
        game_score+=1;
    }    
}
 
function renderFlagpole()
    { 
        push();
        
        fill("brown");
        rect(flag_Pole.pos_x,50,10,floorPos_y-50);
        
        if(flag_Pole.isReached)
            {
               fill("pink");
               rect(flag_Pole.pos_x+10,floorPos_y-382,80,80);
               backgroundMusic.stop();
     }
        else
            {
               fill("pink");
               rect(flag_Pole.pos_x+10,floorPos_y-80,80,80);
                
            }


        
pop();
    
    }




function checkFlagpole()
 {
    var d=abs(gameChar_world_x-flag_Pole.pos_x);
    
    if(d<15)
        {
            flag_Pole.isReached=true;
            
        }
    
 }

function Enemy(x,y,range)
{
    this.x=x;
    this.y=y;
    this.range=range;
    this.currentX=x;
    this.inc=1;
    this.update=function()
    {
      this.currentX+=this.inc;
    if(this.currentX>=this.x+this.range)
        {
            this.inc=-1;
        }
    else if(this.currentX<this.x)
     {
         this.inc=1;
     }
    }
    this.draw=function()
    {
        this.update();
        
        fill(255,random(0,255),random(0,255));
        //head
        ellipse(this.currentX,this.y,50,50);
       
       //horns
       fill(0);
       beginShape()
       vertex(this.currentX+25,this.y);
       vertex(this.currentX+25,this.y-30);
       vertex(this.currentX+20,this.y-7.5);
       endShape();
        
       fill(0);
       beginShape()
       vertex(this.currentX-25,this.y);
       vertex(this.currentX-25,this.y-30);
       vertex(this.currentX-20,this.y-7.5);
       endShape();
        
       //eyebrows
       stroke(0);
       line(this.currentX+5,this.y-5,this.currentX+18,this.y-10);
       line(this.currentX-5,this.y-5,this.currentX-18,this.y-10);
        
        //nose
        line(this.currentX-6,this.y+12,this.currentX,this.y);
        line(this.currentX+5,this.y+12,this.currentX,this.y);
        
        fill(0);
        ellipse(this.currentX-3,this.y+12,3,3)
        ellipse(this.currentX+3,this.y+12,3,3)
        
       
        //eyes
        fill(255);
        ellipse(this.currentX+9,this.y,10,10);
        ellipse(this.currentX-9,this.y,10,10);
        fill('red');
        ellipse(this.currentX+9,this.y,5,5);
        ellipse(this.currentX-9,this.y,5,5);        
        stroke(0);
        
        
        noFill();
        beginShape();
        vertex(this.currentX-8,this.y+15);
        vertex(this.currentX-6,this.y+19);
        vertex(this.currentX-4,this.y+15);
        vertex(this.currentX-2,this.y+19);
        vertex(this.currentX,this.y+15);
        vertex(this.currentX+2,this.y+19);
        vertex(this.currentX+4,this.y+15);
        vertex(this.currentX+6,this.y+19);
        vertex(this.currentX+8,this.y+15);
        
        endShape();
        
       
       
    }
    this.checkContact=function(gc_x,gc_y)
    {
       var d=dist(gc_x,gc_y,this.currentX,this.y);
        if(d<38)
        {
            return true;
        }
        return false;
    }
}

function createplatform(x,y,length)
{

  var p={
    x:x,
    y:y,
    length:length,
    draw:function(){
        noStroke();
        fill(203,115,65);
        rect(this.x,this.y,this.length,20);
        
        
        stroke(2);
        line(this.x,this.y+10,this.x+(this.length-2),this.y+10);
        line(this.x+30,this.y,this.x+30,this.y+10);
        line(this.x+60,this.y,this.x+60,this.y+10);
        line(this.x+10,this.y+10,this.x+10,this.y+20);
        line(this.x+40,this.y+10,this.x+40, this.y+20);
        line(this.x+70,this.y+10,this.x+70,this.y+20);
       
    },
   checkContact:function(gc_x,gc_y){
       
      if(gc_x>this.x-25&&gc_x<this.x+this.length+25){
        var d= this.y-gc_y;
        
       if(d<5&&d>=0)
       {
         return true;  
       }
    }
      
    else
      {
         return false; 
      }   
  }

}

return p;

}






function checkPlayerDie()
 {
    
    var isFallen= false;
          
        if(gameChar_y>height)
            {
               isFallen=true; 
                
            }
          
        if(isFallen==true)
            {
              
              lives-=1;
              
                   
                if(lives>0)
                   {  
                      
                      startGame();
                      backgroundMusic.loop();
                      
                   }    
                else
                   { 
                      
                      lives=0;
                      
                   }
            
            }
          
  }






function startGame()
{
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
           
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
     //initialize array for cloud
    cloud=[
            {cloud_Posx:200,cloud_Posy:150},
            {cloud_Posx:2000,cloud_Posy:100},
          ];
    
    //initialize array for collectable
    trees=[-1033,-750,100,300,500,1000,1200,1650,1850];
    
    //initialize array for collectable
    collectable=[
                 {x_pos: 100, y_pos: floorPos_y, size:5,isFound:false},
                 {x_pos: 500, y_pos: floorPos_y, size:5,isFound:false},
                 {x_pos: 800, y_pos: floorPos_y, size:5,isFound:false},
                 {x_pos: -500, y_pos: floorPos_y, size:5,isFound:false},
                 {x_pos: -750, y_pos: floorPos_y+10, size:5,isFound:false},
                 {x_pos: 1500, y_pos: floorPos_y+15, size:5,isFound:false},
                 {x_pos: 1900, y_pos: floorPos_y+17, size:5,isFound:false},
                 {x_pos: 2800, y_pos: floorPos_y, size:5,isFound:false}
                 
                ];
    
    // Initialise arrays of canyon
    canyon= [
              {x_pos: -800, width: 250},
              {x_pos: 400, width: 250},
              {x_pos: -800, width: 250},
              {x_pos: 2000, width: 250}
              
            ];
    
    // Initialise arrays of mountain
    mountain=[
              {pos_x:0,pos_y:0},
              {pos_x:1500,pos_y:0},
              {pos_x:2900,pos_y:0},
              {pos_x:-1500,pos_y:0},
             ];
    //initialize arrays of mountain
    bird=[
          {bird_Posx:300,bird_Posy:90},
          {bird_Posx:600,bird_Posy:180},
          {bird_Posx:900,bird_Posy:90},
          {bird_Posx:2000,bird_Posy:180},
          {bird_Posx:1800,bird_Posy:90},
          {bird_Posx:-1600,bird_Posy:180},
          {bird_Posx:-2600,bird_Posy:180}
        ]
        
    platforms =[];
    platforms.push(createplatform(-250,floorPos_y-85,100));
    platforms.push(createplatform(-500,floorPos_y-85,100));
    platforms.push(createplatform(1290,floorPos_y-85,100));
    platforms.push(createplatform(-1000,floorPos_y-85,100));
    platforms.push(createplatform(1970,floorPos_y-85,100));
    platforms.push(createplatform(2570,floorPos_y-85,100));
    
    
    enemies=[];
    enemies.push(new Enemy(100,floorPos_y-10,100));
    enemies.push(new Enemy(1000,floorPos_y-10,200));
    enemies.push(new Enemy(-1000,floorPos_y-10,250));
    enemies.push(new Enemy(-500,floorPos_y-110,100));
    enemies.push(new Enemy(2500,floorPos_y-10,200));
    

    
    game_score=0; 
    
    flag_Pole={pos_x:3000,isReached:false}; 
    
    
    
}


