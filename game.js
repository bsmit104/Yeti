class Gameplay extends Phaser.Scene {
    constructor() {
        super('gameplay');
    }

    preload() {
        this.load.path = "./assets/";
        this.load.tilemapTiledJSON('mapp', 'yetimap.json');
        this.load.image('yeti', 'yeti.png');
        this.load.image('peng', 'peng.png');
        this.load.image('fish', 'redfish.png');
        this.load.spritesheet('pacmap', 'pacmap.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        this.startTime = new Date();
        this.timer = 120; // 2 minutes in seconds

        // Update the timer every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });


        score = 0;
        // Create the score text
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', fill: '#FFFFFF' });
        // Display the initial score in the HTML <div> element
        document.getElementById('score').textContent = 'Score: ' + score;

        map = this.make.tilemap({ key: 'mapp' });
        var groundTiles = map.addTilesetImage('pacmap');
        wallLayer = map.createLayer('floor', groundTiles, 0, 0).setScale(3);
        groundLayer = map.createLayer('walls', groundTiles, 0, 0).setScale(3);
        groundLayer.setCollisionByExclusion([-1]);
        this.physics.world.bounds.width = groundLayer.width * 3;
        this.physics.world.bounds.height = groundLayer.height * 3;

        //fish = this.physics.add.sprite(330 * 3, 40 * 3, 'fish').setScale(3).setDepth(2);
        const fishPositions = [
            { x: 40 * 3, y: 40 * 3 },
            { x: 40 * 3, y: 330 * 3 },
            { x: 330 * 3, y: 330 * 3 },
            { x: 330 * 3, y: 40 * 3 }
        ];
        const fishGroup = this.add.group();
        for (let i = 0; i < fishPositions.length; i++) {
            const position = fishPositions[i];
            const redfish = this.physics.add.sprite(position.x, position.y, 'fish').setScale(3).setDepth(2);
            fishGroup.add(redfish);
        }

        player = this.physics.add.sprite(200 * 3, 200 * 3, 'yeti').setScale(3).setDepth(2);
        this.physics.add.collider(groundLayer, player);
        cursors = this.input.keyboard.createCursorKeys();

        const spritePositions = [
            { x: 100 * 3, y: 200 * 3 },
            { x: 300 * 3, y: 200 * 3 },
            { x: 100 * 3, y: 100 * 3 },
            { x: 100 * 3, y: 300 * 3 }, 
            { x: 300 * 3, y: 150 * 3 },
            { x: 200 * 3, y: 100 * 3 },
            { x: 200 * 3, y: 300 * 3 },
            { x: 150 * 3, y: 200 * 3 }
        ];

        const penguinGroup = this.add.group();
        const changeDirectionIntervals = [1000, 1500, 2000, 2500, 500, 1000, 100, 1000];

        for (let i = 0; i < spritePositions.length; i++) {
            const position = spritePositions[i];
            const escapingSprite = this.physics.add.sprite(position.x, position.y, 'peng').setScale(3).setDepth(2);
            escapingSprite.originalPosition = { x: position.x, y: position.y };
            penguinGroup.add(escapingSprite);

            const changeDirection = () => {
                const randomizeSelection = Phaser.Math.RND.between(1, 4);
                let newVelX = 0;
                let newVelY = 0;

                switch (randomizeSelection) {
                    case 1:
                        newVelX = 250;
                        break;
                    case 2:
                        newVelX = -250;
                        break;
                    case 3:
                        newVelY = 250;
                        break;
                    case 4:
                        newVelY = -250;
                        break;
                }

                escapingSprite.body.setVelocity(newVelX, newVelY);
            };

            this.time.addEvent({
                delay: changeDirectionIntervals[i],
                callback: changeDirection,
                callbackScope: this,
                loop: true
            });
        }

        this.physics.add.collider(groundLayer, penguinGroup);

        this.physics.add.collider(player, penguinGroup, this.handleCollision, null, this);
        this.physics.add.overlap(fishGroup, penguinGroup, this.handleCollision2, null, this);
    }

    handleCollision2(fish, penguin) {
        penguin.setTint(0xff0000);
        // Set the penguin to be invulnerable for 2 seconds
        penguin.isInvulnerable = true;
        this.time.delayedCall(5000, () => {
            penguin.isInvulnerable = false;
            penguin.clearTint();
        });
    }

    handleCollision(player, penguin) {
        if (penguin.isInvulnerable) {
            // Deduct points from the player
            score -= 10;
            if (score < 0) {
                score = 0; // Ensure the score doesn't go below zero
            }

            // Update the score text
            this.scoreText.setText('Score: ' + score);
        }
        else {
            penguin.setTint(0xff0000);
            // Increase the score by 10
            score += 10;
            // Update the score text
            this.scoreText.setText('Score: ' + score);
        }
        penguin.body.setVelocity(0, 0);
        penguin.setPosition(penguin.originalPosition.x, penguin.originalPosition.y);

        // Set the penguin to be invulnerable for 2 seconds
        this.time.delayedCall(500, () => {
            penguin.isInvulnerable = true;
        });
        this.time.delayedCall(5000, () => {
            penguin.isInvulnerable = false;
            penguin.clearTint();
        });
    }

    updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - this.startTime) / 1000); // Elapsed time in seconds
        const remainingTime = Math.max(this.timer - elapsedTime, 0);

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Format the time as mm:ss
        const formattedTime = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

        // Update the timer text in the HTML
        document.getElementById('timer').textContent = 'Time Left: ' + formattedTime;

        // // Check if the timer has reached zero
        // if (remainingTime === 0) {
        //     // Transition to the "Game Over" scene
        //     this.scene.start('gameOver');
        // }
        // Check if the timer has reached zero
        if (remainingTime === 0) {
            // Transition to the "Game Over" scene and pass the score as a parameter
            this.scene.start('gameOver', { score: score });
        }
    }

    update() {
        // Update the score logic
        // // For example, increment the score by 1 each update
        // this.score += 1;
        // Update the score text
        //this.scoreText.setText('Score: ' + this.score);
        // Update the score value in the HTML <div> element
        document.getElementById('score').textContent = 'Score: ' + score;


        if (cursors.left.isDown) {
            player.body.setVelocityX(-250);
        }
        else if (cursors.right.isDown) {
            player.body.setVelocityX(250);
        }
        else if (cursors.up.isDown) {
            player.body.setVelocityY(-250);
        }
        else if (cursors.down.isDown) {
            player.body.setVelocityY(250);
        }

        if (player.x < 0) {
            player.x = 1060;
            player.y = 786;
        }
        else if (player.x > game.config.width) {
            player.x = 31;
            player.y = 318;
        }
    }
}

class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('title', 'title.png');
    }
    create() {
        score = 0;
        this.cameras.main.setBackgroundColor('#8fd3f4');
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.titleob = this.add.image(
            centerX,//x
            centerY - 200,//y
            'title',//imagename
            )
            this.titleob.setScale(4) //resize
        const playText = this.add.text(centerX, centerY, 'PLAY', { fontSize: '100px', fill: '#fff' });
        playText.setInteractive();
        playText.on('pointerover', () => {
            playText.setStyle({ fill: '#3944BC' });
        });
        playText.on('pointerout', () => {
            playText.setStyle({ fill: '#fff' });
        });
        playText.on('pointerdown', () => {
            this.scene.start('gameplay');
        });
        this.tweens.add({
            targets: this.titleob,
            x: '+=' + 100,
            repeat: 2,
            yoyo: true,
            ease: 'Sine.inOut',
            duration: 100
        });
    }
    update() {

    }
}

class Gameover extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    create() {
        this.cameras.main.setBackgroundColor('#8fd3f4');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        //const score = this.game.config.globals.score || 0;
        const playText = this.add.text(centerX - 200, centerY, 'Score: ' + score, { fontSize: '50px', fill: '#fff' });
        // Display the score in the "Game Over" scene
        //document.getElementById('score').textContent = 'Score: ' + score;

        // Display the "Game Over" message
        //document.getElementById('game-container').style.display = 'none';
        //document.getElementById('game-over').style.display = 'block';
    }
}

var map;
var smap;
var player;
var fish;
var escapingSprite;
var groundLayer;
var wallLayer;
var miscLayer;
var sgroundLayer;
let score = 0;
let cursors;
var speed = 100;
let vel = 250;
let gridSize = 16;
let offset = parseInt(gridSize / 2);

var config = {
    type: Phaser.AUTO,
    pixelArt: true,
    zoom: 1,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1100,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: false
        }
    },
    input: {
        activePointers: 5
    },
    scene: [Title, Gameplay, Gameover]
};

var game = new Phaser.Game(config);