let colors = ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7', '#9D8189'];
let centerX, centerY;
let shapes = [];
const MIN_DISTANCE = 5;

// 新增：側邊選單相關變數
let menuDiv;
const menuItems = ['第一單元作品', '測驗系統', '測驗卷筆記', '作品筆記', '淡江大學', '回到首頁'];

function setup() {
  // 將畫布改為全螢幕
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);
  ctx = drawingContext;
  centerX = width / 2;
  centerY = height / 2;

  // 建立並填充花朵陣列
  populateShapes(200);

  // 建立左側半透明白色選單
  createMenu();
}

// 新增：當視窗大小改變時，調整畫布並重新生成花朵
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  populateShapes(200);

  // 調整選單尺寸位置
  updateMenuLayout();
}

// 將原本 setup 中放置花朵的邏輯抽成函式，方便重用（例如視窗重新調整時）
function populateShapes(count = 200) {
  shapes = [];
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    const maxAttempts = 100;
    let placed = false;
    let x, y, w;
    while (!placed && attempts < maxAttempts) {
      x = random(0.1, 0.9) * width;
      y = random(0.1, 0.9) * height;
      w = width * random(0.03, 0.1);
      let isOverlapping = false;
      for (let s of shapes) {
        let d = dist(x, y, s.x, s.y);
        if (d < (w + s.w) / 2 + MIN_DISTANCE) {
          isOverlapping = true;
          break;
        }
      }
      if (!isOverlapping) {
        shapes.push(new Flower(x, y, w));
        placed = true;
      }
      attempts++;
    }
  }
}

// 新增：建立側邊選單（使用 p5 DOM）
function createMenu() {
  if (menuDiv) menuDiv.remove();

  menuDiv = createDiv();
  menuDiv.id('side-menu');
  menuDiv.style('position', 'fixed');
  menuDiv.style('left', '-150px'); // 初始位置改為 -150px
  menuDiv.style('top', '0');
  menuDiv.style('width', '150px'); // 寬度改為 150px
  menuDiv.style('height', '100vh');
  menuDiv.style('background', 'rgba(255,255,255,0.5)');
  menuDiv.style('padding', '14px 10px');
  menuDiv.style('box-shadow', '0 0 15px rgba(0,0,0,0.1)');
  menuDiv.style('z-index', '9999');
  menuDiv.style('font-family', 'sans-serif');
  menuDiv.style('user-select', 'none');
  menuDiv.style('transition', 'left 0.3s ease'); // 改為控制 left 屬性的動畫

  const ul = createElement('ul');
  ul.parent(menuDiv);
  ul.style('list-style', 'none');
  ul.style('margin', '0');
  ul.style('padding', '0');
  ul.style('width', '100%');

  menuItems.forEach((t, i) => {
    const li = createElement('li', t);
    li.parent(ul);
    li.style('padding', '12px 8px');
    li.style('cursor', 'pointer');
    li.style('color', '#000');
    li.style('transition', 'all 150ms ease');
    li.style('font-size', '20px');
    li.style('text-align', 'center');
    li.style('border-radius', '4px');
    li.style('margin-bottom', '8px');
    li.style('white-space', 'nowrap');
    li.style('position', 'relative'); // 加入相對定位

    // 為淡江大學選項加入子選單
    if (t === '淡江大學') {
      const subMenu = createElement('div');
      subMenu.parent(li);
      subMenu.style('position', 'absolute');
      subMenu.style('left', '150px'); // 在主選單右側
      subMenu.style('top', '0');
      subMenu.style('width', '150px');
      subMenu.style('background', 'rgba(255,255,255,0.5)');
      subMenu.style('border-radius', '4px');
      subMenu.style('display', 'none'); // 預設隱藏
      subMenu.style('padding', '8px');
      subMenu.style('box-shadow', '0 4px 12px rgba(0,0,0,0.1)');

      const subMenuItem = createElement('div', '教育科技學系');
      subMenuItem.parent(subMenu);
      subMenuItem.style('padding', '10px');
      subMenuItem.style('cursor', 'pointer');
      subMenuItem.style('font-size', '18px');
      subMenuItem.style('text-align', 'center');
      subMenuItem.style('border-radius', '4px');
      subMenuItem.style('transition', 'all 150ms ease');

      // 子選單滑鼠事件
      subMenuItem.mouseOver(() => {
        subMenuItem.style('color', '#ff0000');
        subMenuItem.style('background', 'rgba(255,0,0,0.04)');
      });
      subMenuItem.mouseOut(() => {
        subMenuItem.style('color', '#000000');
        subMenuItem.style('background', 'transparent');
      });
      
      // 點擊子選單項目連到特定 HackMD 頁面
      subMenuItem.mousePressed(() => {
        window.open('https://hackmd.io/CVa9x4p8RASfkVG-flZF3Q', '_blank');
      });

      // 滑鼠移入/移出主選單項目時顯示/隱藏子選單
      li.mouseOver(() => {
        li.style('color', '#ff0000');
        li.style('background', 'rgba(255,0,0,0.04)');
        subMenu.style('display', 'block');
      });

      // 主選單點擊事件仍保留
      li.mousePressed(() => {
        window.open('https://www.tku.edu.tw', '_blank');
      });

      li.mouseOut(() => {
        setTimeout(() => {
          if (!subMenu.elt.matches(':hover')) {
            li.style('color', '#000000');
            li.style('background', 'transparent');
            subMenu.style('display', 'none');
          }
        }, 100);
      });

      // 子選單的滑鼠移出事件
      subMenu.mouseOut(() => {
        setTimeout(() => {
          if (!li.elt.matches(':hover') && !subMenu.elt.matches(':hover')) {
            li.style('color', '#000000');
            li.style('background', 'transparent');
            subMenu.style('display', 'none');
          }
        }, 100);
      });

    } else {
      // 其他選單項目的原有事件處理
      li.mouseOver(() => {
        li.style('color', '#ff0000');
        li.style('background', 'rgba(255,0,0,0.04)');
      });
      li.mouseOut(() => {
        li.style('color', '#000000');
        li.style('background', 'transparent');
      });
      li.mousePressed(() => {
        if (t === '第一單元作品') {
          window.open('https://linxiaoxuan62-coder.github.io/20251014/', '_blank');
        } else {
          console.log('選單項目點擊：', t);
        }
      });
    }
  });
}

function draw() {
  background('#080a12');
  
  // 檢查滑鼠位置並控制選單滑動
  if (mouseX <= 100) {
    menuDiv.style('left', '0px');
  } else {
    menuDiv.style('left', '-150px'); // 滑出位置也改為 -150px
  }

  for (let s of shapes) {
    s.run();
  }
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function drawLeaf(x, y, w, t) {
  push();
  translate(x, y);
  scale(t, 1);
  beginShape();
  for (let a = 0; a < HALF_PI; a += TAU / 360) {
    vertex(-(w / 2) + w * cos(a), -(w / 2) + w * sin(a));
  }
  for (let a = PI; a < PI + HALF_PI; a += TAU / 360) {
    vertex((w / 2) + w * cos(a), (w / 2) + w * sin(a));
  }
  endShape();
  pop();
}

class Flower {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.animationDuration = 60;
    this.initialize();
    shuffle(colors, true);
    this.clr1 = colors[0];
    this.clr2 = colors[1];
    this.clr3 = colors[2];
  }

  show() {
    push();
    translate(this.x, this.y);
    noStroke();
    push();
    translate(0, this.w / 2);
    rotate(this.flowerSwayAngle);
    translate(0, -(this.w / 3 / 2) - (this.w / 2));
    rotate(this.petalRotation);
    fill(this.clr1);
    for (let i = 0; i < 4; i++) {
      circle(this.w / 3 / 2, this.w / 3 / 2, this.w / 3);
      rotate(TAU / 4);
    }
    fill(this.clr2);
    circle(0, 0, this.w / 3);
    pop();
    push();
    translate(0, this.w / 2);
    fill(this.clr3);
    push();
    rotate(-this.leafAngle);
    drawLeaf(this.w / 3 / 2, -this.w / 3 / 2, this.w / 3, 1);
    pop();
    rotate(this.leafAngle);
    drawLeaf(-this.w / 3 / 2, -this.w / 3 / 2, this.w / 3, -1);
    pop();
    pop();
  }

  move() {
    this.timer++;
    if (0 < this.timer && this.timer < this.animationDuration) {
      let normalizedTime = norm(this.timer, 0, this.animationDuration - 1);
      if (this.animationType === 0) {
        this.leafAngle = lerp(0, this.leafSwayAmplitude, sin(easeInOutCubic(normalizedTime) * TAU));
      } else if (this.animationType === 1) {
        this.petalRotation = lerp(0, this.petalDirection, easeInOutCubic(normalizedTime));
      } else if (this.animationType === 2) {
        this.flowerSwayAngle = lerp(0, this.flowerSwayAmplitude, sin(easeInOutCubic(normalizedTime) * TAU));
      }
    }
    if (this.animationDuration < this.timer) {
      this.initialize();
    }
  }

  initialize() {
    this.leafAngle = 0;
    this.leafSwayAmplitude = PI / 20;
    this.petalRotation = 0;
    this.petalDirection = PI * random([-1, 1]);
    this.flowerSwayAngle = 0;
    this.flowerSwayAmplitude = PI * 0.03 * random([-1, 1]);
    this.animationType = int(random(3));
    this.timer = -int(random(400));
  }

  run() {
    this.show();
    this.move();
  }
}