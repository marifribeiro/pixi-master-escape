//Aliases

let Application = PIXI.Application,
    base = PIXI.BaseTexture,
    Container = PIXI.Container,
    Graphics = PIXI.Graphics,
    loader = PIXI.loader,
    ParticleContainer = PIXI.particles.ParticleContainer,
    Rectangle = PIXI.Rectangle,
    reset = PIXI.loader.reset,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    texture = PIXI.Texture,
    TextureCache = PIXI.utils.TextureCache;
    
//Create a Pixi Application
let app = new Application({ 
  width: 512, 
  height: 512,                       
  antialias: true, 
  transparent: false, 
  resolution: 1
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//loader
loader
  .add("resources/images/escape.json")
  .on("progress", loadProgressHandler)
  .load(setup);

//variables for functions
let state, board, boy, blocks, blocksTogether, chest, chestClosed, chestOpen, exit, key, player, room,
    door, message, gameScene, gameOverScene, enemies, id;

function setup() {
  //game scene
  gameScene = new Container();
  gameScene.visible = true;
  app.stage.addChild(gameScene);

  //alias for sprites id
  id = resources["resources/images/escape.json"].textures;

  //room
  room = new Sprite(id["room.png"]);
  gameScene.addChild(room);

  //door
  door = new Sprite(id["door.png"]);
  door.position.set(290, 239);
  gameScene.addChild(door);

  //key
  key = new Sprite(id["key.png"]);
  key.position.set(250, 250);
  gameScene.addChild(key);

  //board
  board = new Sprite(id["board.png"]);
  board.position.set(230, 240);
  gameScene.addChild(board);

  //blocks
  blocks = new Sprite(id["blocks.png"]);
  blocks.position.set(//definir onde vai ser a barra de inventário)
  blocks.visible = false;
  gameScene.addChild(blocks);

  blocksTogether = new Sprite(id["blocksTogether.png"]);
  blocksTogether.position.set(230, 339);
  gameScene.addChild(blocksTogether);
  
  //chest
  chestClosed = new Sprite(id["chestClosed.png"]);
  chestClosed.position.set(149, 354);
  gameScene.addChild(chestClosed);
  chestClosed.visible = true;

  chestOpen = new Sprite(id["chestOpen.png"]);
  chestOpen.position.set(149, 330);
  gameScene.addChild(chestOpen);
  chestOpen.visible = false;

  //boy
  boy = new Sprite(id["boy.png"]);
  boy.position.set(256, 256);
  boy.vx = 0;
  boy.vy = 0;
  gameScene.addChild(boy);

  //dialog bar

  //game over scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  //game over texts
  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  message = new Text("The End!", style);
  message.x = 120,
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  //keys to move boy
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");

  //commands for boy
  //left
  left.press = () => { 
  boy.vx = -5; 
  boy.vy = 0; 
  };
  left.release = () => { 
  if (!right.isDown && boy.vy === 0) { 
  boy.vx = 0; 
  } 
  };

  //Up
  up.press = () => {
  boy.vy = -5;
  boy.vx = 0;
  };
  up.release = () => {
  if (!down.isDown && boy.vx === 0) {
    boy.vy = 0;
  }
  };

  //Right
  right.press = () => {
  boy.vx = 5;
  boy.vy = 0;
  };
  right.release = () => {
  if (!left.isDown && boy.vy === 0) {
    boy.vx = 0;
  }
  };

  //Down
  down.press = () => {
  boy.vy = 5;
  boy.vx = 0;
  };
  down.release = () => {
  if (!up.isDown && boy.vx === 0) {
    boy.vy = 0;

  }
  };

  state = play;
  app.ticker.add(delta => gameLoop(delta));
};

//function game loop
function gameLoop(delta){
  state(delta);
};

//function play
function play(delta){
  boy.x += boy.vx;
  boy.y += boy.vy;
  
  contain(boy, {x: 2, y: 2, width: 508, height: 508});

  let boyHit = false;

  if(hitTestRectangle(boy, chestClosed)) {
    chestClosed.visible = false;
    chestOpen.visible = true;
    blocks.visible = true;
  };

};

//function end
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

// HELPER FUNCTIONS 

//function contain
function contain(sprite, container) {

  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
};

//random number inside stage
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//loader function. Logs the loaded sprites
function loadProgressHandler(loader, resource) {
  console.log("loading: " + resource.url); 
  console.log("progress: " + loader.progress + "%"); 
};

//function hit
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2; 
  r1.centerY = r1.y + r1.height / 2; 
  r2.centerX = r2.x + r2.width / 2; 
  r2.centerY = r2.y + r2.height / 2; 
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
};

//funcion Keyboard
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
};
