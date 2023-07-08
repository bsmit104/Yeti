class gameplay extends Phaser.Scene {
    constructor() {
        super('level1');
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
            { x: 100 * 3, y: 300 * 3 }
        ];

        const penguinGroup = this.add.group();
        const changeDirectionIntervals = [1000, 1500, 2000, 2500];

        for (let i = 0; i < spritePositions.length; i++) {
            const position = spritePositions[i];
            const escapingSprite = this.physics.add.sprite(position.x, position.y, 'peng').setScale(3).setDepth(2);
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
    }

    update() {
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

var map;
var smap;
var player;
var fish;
var escapingSprite;
var groundLayer;
var wallLayer;
var miscLayer;
var sgroundLayer;
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
            debug: true
        }
    },
    input: {
        activePointers: 5
    },
    scene: [gameplay]
};

var game = new Phaser.Game(config);

// class gameplay extends Phaser.Scene {
//     constructor() {
//         super('level1');
//     }

//     preload() {
//         this.load.path = "./assets/";
//         // map made with Tiled in JSON format
//         this.load.tilemapTiledJSON('mapp', 'yetimap.json');
//         // tiles in spritesheet 
//         this.load.image('yeti', 'yeti.png');
//         this.load.image('peng', 'peng.png');
//         this.load.spritesheet('pacmap', 'pacmap.png', { frameWidth: 16, frameHeight: 16 });
//     }

//     create() {
//         // load the map 
//         map = this.make.tilemap({ key: 'mapp' });

//         //tiles for the ground layer
//         var groundTiles = map.addTilesetImage('pacmap');
//         //create the ground layer
//         wallLayer = map.createLayer('floor', groundTiles, 0, 0).setScale(3);
//         groundLayer = map.createLayer('walls', groundTiles, 0, 0).setScale(3);

//         //the player will collide with this layer
//         groundLayer.setCollisionByExclusion([-1]);

//         // set the boundaries of our game world
//         this.physics.world.bounds.width = groundLayer.width * 3;
//         this.physics.world.bounds.height = groundLayer.height * 3;

//         player = this.physics.add.sprite(200 * 3, 200 * 3, 'yeti');
//         player.setScale(3);
//         player.setDepth(2);

//         // player will collide with the level tiles 
//         this.physics.add.collider(groundLayer, player);

//         cursors = this.input.keyboard.createCursorKeys();

//         escapingSprite = this.physics.add.sprite(100 * 3, 200 * 3, 'peng');
//         escapingSprite.setScale(3);
//         escapingSprite.setDepth(2);

//         var escapingSprite2 = this.physics.add.sprite(300 * 3, 200 * 3, 'peng');
//         escapingSprite2.setScale(3);
//         escapingSprite2.setDepth(2);

//         var escapingSprite3 = this.physics.add.sprite(100 * 3, 100 * 3, 'peng');
//         escapingSprite3.setScale(3);
//         escapingSprite3.setDepth(2);

//         var escapingSprite4 = this.physics.add.sprite(100 * 3, 300 * 3, 'peng');
//         escapingSprite4.setScale(3);
//         escapingSprite4.setDepth(2);

//         const penguinGroup = this.add.group();

//         penguinGroup.add(escapingSprite);
//         penguinGroup.add(escapingSprite2);
//         penguinGroup.add(escapingSprite3);
//         penguinGroup.add(escapingSprite4);

//             // penguinGroup.getChildren().forEach(function(sprite) {
//             //     // Update properties or perform actions on each sprite
//             //     sprite.setVelocity(newVelX, newVelY);
//             //   });

//         // this.physics.add.collider(groundLayer, escapingSprite);
//         this.physics.add.collider(groundLayer, penguinGroup);

//         // Inside your create() method or wherever you set up your game objects
//         const CHANGE_DIRECTION_INTERVAL = 1000; // 1 second in milliseconds
//         this.time.addEvent({
//             delay: CHANGE_DIRECTION_INTERVAL,
//             callback: changeDirection,
//             callbackScope: this,
//             loop: true
//         });

//         // Define the changeDirection function
//         function changeDirection() {
//             // Code to change the direction of the object goes here
//             // For example, you can generate a new random direction
//             const randomizeSelection = Phaser.Math.RND.between(1, 4);
//             let newVelX = 0;
//             let newVelY = 0;

//             switch (randomizeSelection) {
//                 case 1:
//                     newVelX = 250;
//                     newVelY = 0;
//                     break;
//                 case 2:
//                     newVelX = -250;
//                     newVelY = 0;
//                     break;
//                 case 3:
//                     newVelX = 0;
//                     newVelY = 250;
//                     break;
//                 case 4:
//                     newVelX = 0;
//                     newVelY = -250;
//                     break;
//             }
//             escapingSprite.body.setVelocity(newVelX, newVelY);
//         }

//         // Inside your create() method or wherever you set up your game objects
//         const CHANGE_DIRECTION_INTERVAL2 = 1500; // 1 second in milliseconds
//         this.time.addEvent({
//             delay: CHANGE_DIRECTION_INTERVAL,
//             callback: changeDirection2,
//             callbackScope: this,
//             loop: true
//         });

//         // Define the changeDirection function
//         function changeDirection2() {
//             // Code to change the direction of the object goes here
//             // For example, you can generate a new random direction
//             const randomizeSelection = Phaser.Math.RND.between(1, 4);
//             let newVelX = 0;
//             let newVelY = 0;

//             switch (randomizeSelection) {
//                 case 1:
//                     newVelX = 250;
//                     newVelY = 0;
//                     break;
//                 case 2:
//                     newVelX = -250;
//                     newVelY = 0;
//                     break;
//                 case 3:
//                     newVelX = 0;
//                     newVelY = 250;
//                     break;
//                 case 4:
//                     newVelX = 0;
//                     newVelY = -250;
//                     break;
//             }
//             escapingSprite2.body.setVelocity(newVelX, newVelY);
//         }

//         // Inside your create() method or wherever you set up your game objects
//         const CHANGE_DIRECTION_INTERVAL3 = 2000; // 1 second in milliseconds
//         this.time.addEvent({
//             delay: CHANGE_DIRECTION_INTERVAL,
//             callback: changeDirection3,
//             callbackScope: this,
//             loop: true
//         });

//         // Define the changeDirection function
//         function changeDirection3() {
//             // Code to change the direction of the object goes here
//             // For example, you can generate a new random direction
//             const randomizeSelection = Phaser.Math.RND.between(1, 4);
//             let newVelX = 0;
//             let newVelY = 0;

//             switch (randomizeSelection) {
//                 case 1:
//                     newVelX = 250;
//                     newVelY = 0;
//                     break;
//                 case 2:
//                     newVelX = -250;
//                     newVelY = 0;
//                     break;
//                 case 3:
//                     newVelX = 0;
//                     newVelY = 250;
//                     break;
//                 case 4:
//                     newVelX = 0;
//                     newVelY = -250;
//                     break;
//             }
//             escapingSprite3.body.setVelocity(newVelX, newVelY);
//         }

//         // Inside your create() method or wherever you set up your game objects
//         const CHANGE_DIRECTION_INTERVAL4 = 2500; // 1 second in milliseconds
//         this.time.addEvent({
//             delay: CHANGE_DIRECTION_INTERVAL,
//             callback: changeDirection4,
//             callbackScope: this,
//             loop: true
//         });

//         // Define the changeDirection function
//         function changeDirection4() {
//             // Code to change the direction of the object goes here
//             // For example, you can generate a new random direction
//             const randomizeSelection = Phaser.Math.RND.between(1, 4);
//             let newVelX = 0;
//             let newVelY = 0;

//             switch (randomizeSelection) {
//                 case 1:
//                     newVelX = 250;
//                     newVelY = 0;
//                     break;
//                 case 2:
//                     newVelX = -250;
//                     newVelY = 0;
//                     break;
//                 case 3:
//                     newVelX = 0;
//                     newVelY = 250;
//                     break;
//                 case 4:
//                     newVelX = 0;
//                     newVelY = -250;
//                     break;
//             }
//             escapingSprite4.body.setVelocity(newVelX, newVelY);
//         }
//     }

//     update() {

//         if (cursors.left.isDown) {
//             player.body.setVelocityX(-250);
//             // console.log("x: ", player.x);
//         }
//         else if (cursors.right.isDown) {
//             player.body.setVelocityX(250);
//             // console.log("x: ", player.x);
//         }
//         else if (cursors.up.isDown) {
//             player.body.setVelocityY(-250);
//             // console.log("y: ", player.y);
//         }
//         else if (cursors.down.isDown) {
//             player.body.setVelocityY(250);
//             // console.log("y: ", player.y);
//         }
//         if (player.x < 0) {
//             player.x = 1060;
//             player.y = 786
//         }
//         else if (player.x > game.config.width) {
//             player.x = 31;
//             player.y = 318;
//         }

//         if (escapingSprite.x < 0) {
//             escapingSprite.x = 1060;
//             escapingSprite.y = 786
//         }
//         else if (escapingSprite.x > game.config.width) {
//             escapingSprite.x = 31;
//             escapingSprite.y = 318;
//         }
//     }
// }


// // tame the javashrek
// 'use strict';

// var map;
// var smap;
// var player;
// var escapingSprite;
// var groundLayer;
// var wallLayer;
// var miscLayer;
// var sgroundLayer;
// let cursors;
// var speed = 100;
// let vel = 250;
// let gridSize = 16;
// let offset = parseInt(gridSize / 2);

// var config = {
//     type: Phaser.AUTO,
//     pixelArt: true,
//     //roundPixels: true,
//     zoom: 1,
//     scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//         width: 1100,
//         height: 1080
//     },
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: {
//                 x: 0,
//                 y: 0
//             },
//             debug: true
//         }
//     },
//     input: {
//         activePointers: 5
//     },
//     scene: [gameplay]
//     //{
//     // key: 'main',
//     // preload: preload,
//     // create: create,
//     // update: update
//     //}
// };
// var game = new Phaser.Game(config);