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
  width: 296, 
  height: 322,                       
  antialias: false, 
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
let state, windows, boy, boyFace, bed, blocksGame, blocksInventory, chest, box, exit, keyInventory, keyGame, player, room, table, tv,
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
  room.position.set(40, 66);
  gameScene.addChild(room);

  //door
  door = new Sprite(id["door.png"]);
  door.position.set(227, 84);
  gameScene.addChild(door);

  //bed
  bed = new Sprite(id["bed.png"]);
  bed.position.set(162, 115);
  gameScene.addChild(bed);

  //table
  table = new Sprite(id["table.png"]);
  table.position.set(256, 179);
  gameScene.addChild(table);

  //tv
  tv = new Sprite(id["tv.png"]);
  tv.position.set(162, 242);
  gameScene.addChild(tv);

  //key
  keyGame = new Sprite(id["key.png"]);
  keyGame.visible = false;
  gameScene.addChild(keyGame);

  keyInventory = new Sprite(id["key.png"]);
  keyInventory.antialias = false;
  keyInventory.position.set(15, 73);
  keyInventory.width = 13;
  keyInventory.height = 24;
  keyInventory.visible = true;
  gameScene.addChild(keyInventory);

  //window
  windows = new Sprite(id["windows.png"]);
  windows.position.set(66, 84);
  gameScene.addChild(windows);

  //blocks
  blocksGame = new Sprite(id["blocks.png"]);
  blocksGame.position.set(127, 116);
  blocksGame.visible = true;
  gameScene.addChild(blocksGame);

  blocksInventory = new Sprite(id["blocks.png"]);
  blocksInventory.position.set(11, 111);
  blocksInventory.width = 21;
  blocksInventory.height = 21;
  blocksInventory.visible = true;
  gameScene.addChild(blocksInventory);

  //chest
  chest = new Sprite(id["chest.png"]);
  chest.position.set(48, 205);
  gameScene.addChild(chest);

  //boy
  boy = new Sprite(id["boy.png"]);
  boy.position.set(256, 256);
  gameScene.addChild(boy);

  //dialog bar

  //character box
  box = new Graphics();
  box.beginFill(0x626262);
  box.lineStyle(3, 0xffffff, 1);
  box.drawRect(43, 9, 50, 50);
  box.endFill();
  gameScene.addChild(box);

  boyFace = new Sprite(id["boy face.png"]);
  boyFace.position.set(52, 18);
  gameScene.addChild(boyFace);

  //character texts
  let charStyle = new TextStyle({
    fontFamily: "Courier New",
    fontWeight: "bold",
    fontSize: 12,
    fill: "white"
  });
  message = new Text("I'm five! I can't read!", charStyle);
  message.position.set(97, 27);
  gameScene.addChild(message);

  //game over scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  //game over texts
  let style = new TextStyle({
    fontFamily: "Futura",
    fontWeight: "bold",
    fontSize: 64,
    fill: "white"
  });
  message = new Text("The End!", style);
  message.x = 120,
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  state = play;
  app.ticker.add(delta => gameLoop(delta));
};

//function game loop
function gameLoop(delta){
  state(delta);
};

//function play
function play(delta){
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
  let keyInventory = {};
  keyInventory.value = value;
  keyInventory.isDown = false;
  keyInventory.isUp = true;
  keyInventory.press = undefined;
  keyInventory.release = undefined;
  //The `downHandler`
  keyInventory.downHandler = event => {
    if (event.keyInventory === keyInventory.value) {
      if (keyInventory.isUp && keyInventory.press) keyInventory.press();
      keyInventory.isDown = true;
      keyInventory.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  keyInventory.upHandler = event => {
    if (event.keyInventory === keyInventory.value) {
      if (keyInventory.isDown && keyInventory.release) keyInventory.release();
      keyInventory.isDown = false;
      keyInventory.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = keyInventory.downHandler.bind(keyInventory);
  const upListener = keyInventory.upHandler.bind(keyInventory);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  keyInventory.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return keyInventory;
};
