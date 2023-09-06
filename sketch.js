let alien_0
function preload() {
alien_0=loadImage("ressources/alien_0.png");
//alien_1=loadImage("ressources/alien_1");
ship_0=loadImage("ressources/ship_0.png");
//ship_1=loadImage("ressources/ship_1");
//ship_2=loadImage("ressources/ship_2");

 }



function setup() 
{
	createCanvas(400, 400);
    background(0)
    ship=new ship(185, 350)
    alien=new alien (200, 500)

}

function draw(){
    background(0) 
ship.draw()
alien.draw()


}

class ship { 
    constructor(x,y){ 
        this.x= x;
        this.y= y;

    } 
    draw() { 
        this.move()
        image(ship_0 ,this.x,this.y)
    }
    move() {
        if (keyIsDown(LEFT_ARROW)){
            this.x-=5;
        }
        if (keyIsDown(RIGHT_ARROW)){
            this.x+=5;
        }
        
     } 
}

class alien { 
    constructor(x,y) {
        this.x= x;
        this.y= y;

    }
    Update() { 
        this.y+=3

    }
    draw() {
        this.Update() 
        image(alien_0, this.x,this.y)
    }
    
} 
  
 
