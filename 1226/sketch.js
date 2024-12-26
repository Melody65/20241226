let images = []; // 左邊角色的圖片陣列
let images2 = []; // 右邊角色的圖片陣列
let bgImage; // 背景圖片
let currentFrame = 0;
let currentFrame2 = 0;
let frameDelay = 5;
let frameCount = 0;

// 角色移動相關變數
let char1X = 0;
let char1Y = 0;
let char2X = 0;
let char2Y = 0;
let isJumping = false;
let isJumping2 = false;
let jumpPower = -15;
let ySpeed = 0;
let ySpeed2 = 0;
let gravity = 0.8;
let moveSpeed = 5;

// 角色面向（1為右，-1為左）
let char1Direction = 1;  // P1 一開始面向右
let char2Direction = -1; // P2 一開始面向左

// 子彈相關變數
let bullets = [];
let bullets2 = [];
let bulletSpeed = 10;
let canShoot = true;
let canShoot2 = true;
let shootCooldown = 20;
let cooldownTimer = 0;
let cooldownTimer2 = 0;

// 生命值變數
let health1 = 100;
let health2 = 100;

function preload() {
  bgImage = loadImage('123.jpg');
  for (let i = 0; i < 9; i++) {
    images[i] = loadImage(i + '.png');
  }
  for (let i = 9; i < 18; i++) {
    images2[i-9] = loadImage(i + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // 設定初始位置
  char1X = width/3;
  char1Y = height/2 + 30;
  char2X = width*2/3;
  char2Y = height/2 + 30;
  // 設定初始面向
  char1Direction = 1;  // P1 面向右
  char2Direction = -1; // P2 面向左
}

function draw() {
  // 繪製背景
  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);
  imageMode(CENTER);
  
  handleCharacter1Movement();
  handleCharacter2Movement();
  updateBullets();
  
  // 繪製左邊角色（根據面向翻轉）
  push();
  translate(char1X, char1Y);
  scale(char1Direction, 1);
  image(images[currentFrame], 0, 0);
  pop();
  
  // 繪製右邊角色（根據面向翻轉）
  push();
  translate(char2X, char2Y);
  scale(char2Direction, 1);
  image(images2[currentFrame2], 0, 0);
  pop();
  
  // 更新動畫
  frameCount++;
  if (frameCount >= frameDelay) {
    currentFrame = (currentFrame + 1) % images.length;
    currentFrame2 = (currentFrame2 + 1) % images2.length;
    frameCount = 0;
  }
  
  // 顯示生命值
  fill(255);
  textSize(24);
  textAlign(LEFT);
  text("P1: " + health1, 20, 30);
  textAlign(RIGHT);
  text("P2: " + health2, width - 20, 30);
}

function handleCharacter1Movement() {
  if (isJumping) {
    char1Y += ySpeed;
    ySpeed += gravity;
    if (char1Y >= height/2 + 30) {
      char1Y = height/2 + 30;
      isJumping = false;
      ySpeed = 0;
    }
  }
  
  if (keyIsDown(87) && !isJumping) { // W
    isJumping = true;
    ySpeed = jumpPower;
  }
  if (keyIsDown(65)) { // A
    char1X -= moveSpeed;
    char1Direction = -1;  // 向左移動時面向左
  }
  if (keyIsDown(68)) { // D
    char1X += moveSpeed;
    char1Direction = 1;   // 向右移動時面向右
  }
  if (keyIsDown(70) && canShoot) { // F
    bullets.push({
      x: char1X + (30 * char1Direction),
      y: char1Y,
      dir: char1Direction
    });
    canShoot = false;
    cooldownTimer = shootCooldown;
  }
  
  if (!canShoot) {
    cooldownTimer--;
    if (cooldownTimer <= 0) canShoot = true;
  }
  
  char1X = constrain(char1X, 50, width-50);
}

function handleCharacter2Movement() {
  if (isJumping2) {
    char2Y += ySpeed2;
    ySpeed2 += gravity;
    if (char2Y >= height/2 + 30) {
      char2Y = height/2 + 30;
      isJumping2 = false;
      ySpeed2 = 0;
    }
  }
  
  if (keyIsDown(UP_ARROW) && !isJumping2) {
    isJumping2 = true;
    ySpeed2 = jumpPower;
  }
  if (keyIsDown(LEFT_ARROW)) {
    char2X -= moveSpeed;
    char2Direction = -1;  // 向左移動時面向左
  }
  if (keyIsDown(RIGHT_ARROW)) {
    char2X += moveSpeed;
    char2Direction = 1;   // 向右移動時面向右
  }
  if (keyIsDown(32) && canShoot2) { // 空白鍵
    bullets2.push({
      x: char2X + (30 * char2Direction),
      y: char2Y,
      dir: char2Direction
    });
    canShoot2 = false;
    cooldownTimer2 = shootCooldown;
  }
  
  if (!canShoot2) {
    cooldownTimer2--;
    if (cooldownTimer2 <= 0) canShoot2 = true;
  }
  
  char2X = constrain(char2X, 50, width-50);
}

function updateBullets() {
  // 更新左邊角色的子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.x += bulletSpeed * bullet.dir;
    
    // 檢查是否擊中右邊角色
    let d = dist(bullet.x, bullet.y, char2X, char2Y);
    if (d < 40) {
      health2 -= 10;
      bullets.splice(i, 1);
      continue;
    }
    
    if (bullet.x < 0 || bullet.x > width) {
      bullets.splice(i, 1);
      continue;
    }
    
    fill(255, 0, 0);
    noStroke();
    circle(bullet.x, bullet.y, 10);
  }
  
  // 更新右邊角色的子彈
  for (let i = bullets2.length - 1; i >= 0; i--) {
    let bullet = bullets2[i];
    bullet.x += bulletSpeed * bullet.dir;
    
    // 檢查是否擊中左邊角色
    let d = dist(bullet.x, bullet.y, char1X, char1Y);
    if (d < 40) {
      health1 -= 10;
      bullets2.splice(i, 1);
      continue;
    }
    
    if (bullet.x < 0 || bullet.x > width) {
      bullets2.splice(i, 1);
      continue;
    }
    
    fill(0, 0, 255);
    noStroke();
    circle(bullet.x, bullet.y, 10);
  }
  
  // 確保生命值不會低於0
  health1 = constrain(health1, 0, 100);
  health2 = constrain(health2, 0, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
