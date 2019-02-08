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