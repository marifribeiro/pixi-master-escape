// Aliases

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

// Create a Pixi Application
let app = new Application({
  width: 592,
  height: 644,
  antialias: false,
  transparent: false,
  resolution: 1
});

/*tink (ended up not using!)
let t = new Tink(PIXI, app.renderer.view),
  pointer = t.makePointer();
*/

// PIXI canvas
document.body.appendChild(app.view);

// loader
loader
  .add("resources/images/escape.json")
  .on("progress", loadProgressHandler)
  .load(setup);

// global variables
let state, windows, bed, blocksGame, blocksInventory, boy, boyFace, box, chest, clickX, clickY, door, exit, gameScene, gameOverScene, 
id, key, message, player, room, table, tv;

function setup() {
  // game scene
  gameScene = new Container();
  gameScene.visible = true;
  app.stage.addChild(gameScene);

  // alias for sprites id
  id = resources["resources/images/escape.json"].textures;

  // room
  room = new Sprite(id["room.png"]);
  room.position.set(80, 110);
  room.width = room.width / 5;
  room.height = room.height / 5;
  room.interactive = true;
  room.on('mousedown', moveme);
  gameScene.addChild(room);

  // door
  door = new Sprite(id["door.png"]);
  door.width = door.width / 5;
  door.height = door.height / 5;
  door.x = (room.x + room.width) - (door.width * 2);
  door.y = 146;
  gameScene.addChild(door);

  // bed
  bed = new Sprite(id["bed.png"]);
  bed.width = bed.width / 5;
  bed.height = bed.height / 5;
  bed.x = (room.x + room.width) / 2;
  bed.y = 215;
  gameScene.addChild(bed);

  // table
  table = new Sprite(id["table.png"]);
  table.width = table.width / 5;
  table.height = table.height / 5;
  table.x = (room.x + room.width) - (table.width + 16);
  table.y = (room.y + room.height) - (table.height + 32);
  gameScene.addChild(table);

  // blocks
  blocksGame = new Sprite(id["blocks.png"]);
  blocksGame.width = blocksGame.width / 5;
  blocksGame.height = blocksGame.height / 5;
  blocksGame.position.set(203, 206);
  blocksGame.visible = false;
  gameScene.addChild(blocksGame);

  blocksInventory = new Sprite(id["blocks.png"]);
  blocksInventory.position.set(22, 160);
  blocksInventory.width = 42;
  blocksInventory.height = 42;
  blocksInventory.visible = false;
  gameScene.addChild(blocksInventory);

  // window
  windows = new Sprite(id["windows.png"]);
  windows.width = windows.width / 5;
  windows.height = windows.height / 5;
  windows.x = 140;
  windows.y = (blocksGame.y - windows.height) + 2;
  gameScene.addChild(windows);

  // chest
  chest = new Sprite(id["chest.png"]);
  chest.width = chest.width / 5;
  chest.height = chest.height / 5;
  chest.x = room.x + 16;
  chest.y = 350;
  gameScene.addChild(chest);

  // boy
  boy = new Sprite(id["boy.png"]);
  boy.position.set(360, 260);
  boy.width = boy.width / 5;
  boy.height = boy.height / 5;
  boy.vx = 0;
  boy.vy = 0;
  gameScene.addChild(boy);

  // key
  key = new Sprite(id["key.png"]);
  key.visible = false;
  key.width = key.width / 5;
  key.height = key.height / 5;
  key.x = 35;
  key.y = 222;
  gameScene.addChild(key);

  // tv
  tv = new Sprite(id["tv.png"]);
  tv.width = tv.width / 5;
  tv.height = tv.height / 5;
  tv.x = (room.x + room.width) / 2;
  tv.y = (room.y + room.height) - (tv.height + 32)
  gameScene.addChild(tv);

  // dialog bar

  // character box
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

  // character texts
  let charStyle = new TextStyle({
    fontFamily: "Courier New",
    fontWeight: "bold",
    fontSize: 20,
    fill: "white"
  });
  messageGame = new Text("I need to get out of the room!", charStyle);
  messageGame.position.set(194, 44);
  messageGame.wordWrap = true;
  gameScene.addChild(messageGame);

  // game over scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  // game over texts
  let style = new TextStyle({
    fontFamily: "Courier New",
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

// function game loop
function gameLoop(delta) {
  state(delta);
  //t.update();
};

// function play
function play(delta) {
  boy.x += boy.vx;
  boy.y += boy.vy;
  contain(boy, { x: 96, y: 215, width: 576, height: 590 });
  
  // move boy
  if (boy.x > clickX) {
    boy.vx = -1;
  } else if (boy.x < clickX) {
    boy.vx = 1;
  } else {
    boy.vx = 0;
  }
  
  if (boy.y > clickY) {
    boy.vy = -1;
  } else if (boy.y < clickY) {
    boy.vy = 1;
  } else {
    boy.vy = 0;
  }

  // interaction boy - chest
  if (hitTestRectangle(boy, chest)) {
    boy.vx = 0;
    boy.vy = 0;
    boy.x = boy.x + 1;
    boy.y = boy.y + 1;

    blocksInventory.visible = true;
    messageGame.position.set(194, 26);
    messageGame.text = "I found my blocks!\nIf I build them high enough\nI can climb them.";
  }

  // interaction boy - blocks
  if (hitTestRectangle(boy, blocksGame) && blocksInventory.visible) {
    blocksGame.visible = true;
    blocksInventory.visible = false;

  } else if (hitTestRectangle(boy, blocksGame) && blocksGame.visible) {
    messageGame.position.set(194, 26);
    messageGame.text = "I wonder if I can see\nabove the window...\nI found a key!";
    key.visible = true;
    // insert animation of boy above the window...

  } else if (hitTestRectangle(boy, blocksGame) && !blocksGame.visible){
    messageGame.text = "I don't know what to do here.";
  }

  // interaction boy - table
  if (hitTestRectangle(boy, table)) {
    boy.vx = 0;
    boy.vy = 0;
    boy.x = boy.x - 1;
    boy.y = boy.y - 1;
    messageGame.position.set(194, 34);
    messageGame.text = "There's a note on the table\nbut I'm five! I can't read!";
   }

  // interaction boy - door
  if (hitTestRectangle(boy, door) && !key.visible) {
    messageGame.position.set(194, 26);
    messageGame.text = "The door is locked.\nMommy must have left\na key here somewhere...";
  } else if (hitTestRectangle(boy, door) && key.visible) {
    state = end;
  }

  // interaction boy - bed
  if (hitTestRectangle(boy, bed)) {
    boy.vx = 0;
    boy.vy = 0;
    boy.y = boy.y + 1;
    if (boy.x > bed.x) { 
      boy.x + 1; 
    } else if (boy.x < bed.x + bed.length) {
      boy.x - 1;
    }
  }
};

//function end
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
