let bullets = [];
let aliens = [];
let ship;
let currentWave = 0;
let score = 0; 
const waveConfigurations = [
    { count: 5, startY: 50, spacingX: 60 },   
    { count: 7, startY: 0, spacingX: 40 },  
    { count: 10, startY: 50, spacingX: 45 }   
];

let ship_0, ship_1, ship_2, alien_0, alien_1;

function preload() {
    ship_0 = loadImage("ressources/ship_0.png");
    ship_1 = loadImage("ressources/ship_1.png");
    ship_2 = loadImage("ressources/ship_2.png");
    alien_0 = loadImage("ressources/alien_0.png");
    alien_1 = loadImage("ressources/alien_1.png");
}

function setup() {
    createCanvas(400, 500);
    background(0);
    ship = new Ship(width / 2 - 10, height - 50);
    createWave();
}

function draw() {
    background(0);
    ship.draw();

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw();
        bullets[i].hasHit(aliens);
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    
    for (let i = aliens.length - 1; i >= 0; i--) {
        aliens[i].draw();
        aliens[i].update();
       
        if (aliens[i].x > width) {
            aliens[i].x = 0;
        } else if (aliens[i].x < 0) {
            aliens[i].x = width;
        }
      
        if (!aliens[i].alive) {
            aliens.splice(i, 1);
            score += 10;
        }
    }

    textSize(24);
    fill(255);
    text(`Score: ${score}`, 10, 30);

    const areAllAliensEliminated = aliens.length === 0;

    if (areAllAliensEliminated) {
        if (currentWave < waveConfigurations.length - 1) {
            currentWave++;
            createWave();
        } else {
            noLoop();
        }
    }
}

function createWave() {
    aliens = [];
    const waveConfig = waveConfigurations[currentWave];
    const numRows = 2 + currentWave;
    const rowSpacing = 40; 

    for (let row = 0; row < numRows; row++) {
        for (let i = 0; i < waveConfig.count; i++) {
            aliens.push(new Alien(90 + i * waveConfig.spacingX, waveConfig.startY + row * rowSpacing));
        }
    }
}

class Alien {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alienStage = 0;
        this.changeStage = 0;
        this.alive = true;
        this.locationStage = 0;
        this.diff_locationStage = 1;
        this.dx = 3;
        this.size = 20; 
    }

    draw() {
        if (this.alive) {
            image(this.alienStage === 0 ? alien_0 : alien_1, this.x, this.y, this.size, this.size);
            if (this.changeStage === 0) {
                this.alienStage++;
                if (this.alienStage > 1) {
                    this.alienStage = 0;
                }
            }
            this.changeStage++;
            if (this.changeStage > 5) {
                this.changeStage = 0;
            }
        }
    }

    update() {
        if (this.locationStage === 16) {
            this.y += 8;
            this.dx = -this.dx;
            this.locationStage++;
        } else if (this.locationStage === 47) {
            this.y += 6;
            this.dx = -this.dx;
            this.locationStage = -15;
        } else {
            this.x += this.dx;
            this.locationStage++;
            this.x = constrain(this.x, 0, width - this.size);
        }
    }
}

class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.shipStage = 0;
        this.changeStage = 0;
        this.size = 40; 
    }

    draw() {
        this.move();
        image([ship_0, ship_1, ship_2][this.shipStage], this.x, this.y, this.size, this.size);
        if (this.changeStage === 0) {
            this.shipStage = (this.shipStage + 1) % 3;
        }
        this.changeStage++;
        if (this.changeStage > 5) {
            this.changeStage = 0;
        }
    }

    move() {
        if (keyIsDown(LEFT_ARROW)) {
            this.x = constrain(this.x - 7, 0, width - this.size);
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.x = constrain(this.x + 7, 0, width - this.size);
        }
    }

    fire() {
        bullets.push(new Bullet(this.x + this.size / 2, this.y));
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hasNotHit = true;
        this.speed = 10; 
    }

    draw() {
        if (this.hasNotHit) {
            fill(0, 255, 0); 
            circle(this.x, this.y, 7);
        }
    }

    update() {
        this.y -= this.speed;
    }

    hasHit(aliens) {
        for (let i = 0; i < aliens.length; i++) {
            if (aliens[i].alive && this.hasNotHit) {
                if (
                    this.x > aliens[i].x &&
                    this.x < aliens[i].x + aliens[i].size &&
                    this.y > aliens[i].y &&
                    this.y < aliens[i].y + aliens[i].size
                ) {
                    aliens[i].alive = false;
                    this.hasNotHit = false;
                }
            }
        }
    }
}

function keyPressed() {
    if (keyCode === 32) {
        ship.fire();
    }
}
