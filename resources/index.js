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
  width: 592, 
  height: 644,                       
  antialias: false, 
  transparent: false, 
  resolution: 1
});

//tink 
let t = new Tink(PIXI, app.renderer.view),
    pointer = t.makePointer();

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//loader
loader
  .add("resources/images/escape.json")
  .on("progress", loadProgressHandler)
  .load(setup);

//variables for functions
let state, windows, boy, boyFace, bed, blocksGame, blocksInventory, chest, box, exit, keyInventory, keyGame, player, room, table, tv,
    door, message, gameScene, gameOverScene, enemies, id, clickX, clickY;

function setup() {
  //game scene
  gameScene = new Container();
  gameScene.visible = true;
  app.stage.addChild(gameScene);

  //alias for sprites id
  id = resources["resources/images/escape.json"].textures;

  //room
  room = new Sprite(id["room.png"]);
  room.position.set(80, 110);
  room.width = room.width / 5;
  room.height = room.height / 5;
  room.interactive = true;
  room.on('mousedown', moveme);
  gameScene.addChild(room);

  //door
  door = new Sprite(id["door.png"]);
  door.width = door.width / 5;
  door.height = door.height / 5;
  door.x = (room.x + room.width) - (door.width * 2);
  door.y = 146;
  gameScene.addChild(door);

  //bed
  bed = new Sprite(id["bed.png"]);
  bed.width = bed.width / 5;
  bed.height = bed.height / 5;
  bed.x = (room.x + room.width) / 2;
  bed.y = 215;
  gameScene.addChild(bed);

  //table
  table = new Sprite(id["table.png"]);
  table.width = table.width / 5;
  table.height = table.height / 5;
  table.x = (room.x + room.width) - (table.width + 16);
  table.y = (room.y + room.height) - (table.height + 32);
  gameScene.addChild(table);

  //tv
  tv = new Sprite(id["tv.png"]);
  tv.width = tv.width / 5;
  tv.height = tv.height / 5;
  tv.x = (room.x + room.width) / 2;
  tv.y = (room.y + room.height) - (tv.height + 32)
  gameScene.addChild(tv);

  //key
  keyGame = new Sprite(id["key.png"]);
  keyGame.visible = false;
  keyGame.width = keyGame.width / 5;
  keyGame.height = keyGame.height / 5;
  gameScene.addChild(keyGame);
  t.makeInteractive(keyGame);
  keyGame.press = () => {
    if(blocksGame.visible && keyInventory.visible) {
      keyGame.visible = true;
      keyGame.x = boy.x - 10;
      keyGame.y = boy.y;
    };
  } 

  keyInventory = new Sprite(id["key.png"]);
  keyInventory.antialias = false;
  keyInventory.position.set(30, 146);
  keyInventory.width = 26;
  keyInventory.height = 48;
  keyInventory.visible = false;
  gameScene.addChild(keyInventory);

  //blocks
  blocksGame = new Sprite(id["blocks.png"]);
  blocksGame.width = blocksGame.width / 5;
  blocksGame.height = blocksGame.height / 5;
  blocksGame.position.set(203, 206);
  blocksGame.visible = false;
  gameScene.addChild(blocksGame);
  t.makeInteractive(blocksGame);
  blocksGame.press = () => {
    if(blocksInventory.visible) {
      blocksGame.visible = true;
      boy.position.set(203, 220);
      messageGame.text = "I can see above the window from\nhere!";
    } else {
      messageGame.text = "I don't know what to do here."
    };
  };

  blocksInventory = new Sprite(id["blocks.png"]);
  blocksInventory.position.set(22, 222);
  blocksInventory.width = 42;
  blocksInventory.height = 42;
  blocksInventory.visible = false;
  gameScene.addChild(blocksInventory);

  //window
  windows = new Sprite(id["windows.png"]);
  windows.width = windows.width / 5;
  windows.height = windows.height / 5;
  windows.x = 140;
  windows.y = (blocksGame.y - windows.height) + 2;
  gameScene.addChild(windows);

  //chest
  chest = new Sprite(id["chest.png"]);
  chest.width = chest.width / 5;
  chest.height = chest.height / 5;
  chest.x = room.x + 16;
  chest.y = 350;
  gameScene.addChild(chest);
  t.makeInteractive(chest);
  chest.press = () => {
     if(hitTestRectangle(boy, chest)) {
     blocksInventory.visible = true;
     messageGame.position.set(194, 26);
     messageGame.text = "I found my blocks!\nIf I build them high enough\nI can climb them.";
     };
   };

  //boy
  boy = new Sprite(id["boy.png"]);
  boy.position.set(260, 260);
  boy.width = boy.width / 5;
  boy.height = boy.height / 5;
  boy.vx = 0;
  boy.vy = 0;
  gameScene.addChild(boy);

  //dialog bar

  //character box
  box = new Graphics();
  box.beginFill(0x626262);
  box.lineStyle(3, 0xffffff, 1);
  box.drawRect(86, 10, 90, 90);
  box.endFill();
  gameScene.addChild(box);

  boyFace = new Sprite(id["boyFace.png"]);
  boyFace.position.set(95, 20);
  boyFace.width = boyFace.width / 5;
  boyFace.height = boyFace.height / 5;
  gameScene.addChild(boyFace);

  //character texts
  let charStyle = new TextStyle({
    fontFamily: "Courier New",
    fontWeight: "bold",
    fontSize: 20,
    fill: "white"
  });
  messageGame = new Text("I need to get out of the room!", charStyle);
  messageGame.position.set(194, 56);
  messageGame.wordWrap = true;
  gameScene.addChild(messageGame);

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
  t.update();
};

//function play
function play(delta){
  boy.x += boy.vx;
  boy.y += boy.vy;
  contain(boy, {x: 96, y: 215, width: 576, height: 590});
  
  //move boy
  if(boy.x > clickX) {
    boy.vx = -1;
  } else if(boy.x < clickX) {
    boy.vx = 1;
  } else {
    boy.vx = 0;
  }

  if(boy.y > clickY) {
    boy.vy = -1;
  } else if(boy.y < clickY) {
    boy.vy = 1;
  } else {
    boy.vy = 0;
  }
};

//function end
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

// HELPER FUNCTIONS 

//function move me
function moveme(xx) {
 clickX = xx.data.global.x;
 clickY = xx.data.global.y;
}

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
