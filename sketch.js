let grid = [];
let cellSizeSlider;
let cols, rows, cellSize;
let gui;
let selectedCell = { i: -1, j: -1 };
let gridSettings = {
  showGrid: true,
  colorNames: {
    '古韵玄武黑': '#1E1B1A',
    '月净雪玉白': '#D9D9D6',
    '钟灵长青绿': '#227F46',
    '长天深霁蓝': '#013DA2',
    '千秋宫墙红': '#AB2920',
    '辉光琉璃黄': '#FA9D08'
  },
  selectedColorName: '古韵玄武黑',
  shapes: {
    '无': 0,
    '正方形': 1,
    '圆形': 2,
    '左下三角形': 3,
    '左上三角形': 4,
    '右下三角形': 5,
    '右上三角形': 6,
    '右下弧': 7,
    '左下弧': 8,
    '左上弧': 9,
    '右上弧': 10
  },
  selectedShape: '正方形', // 默认正方形
  clearShapes: function() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].shape = 0;
      }
    }
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  gui = new dat.GUI();
  gui.add(gridSettings, 'showGrid').name('显示网格');
  gui.add(gridSettings, 'selectedColorName', Object.keys(gridSettings.colorNames)).name('形状颜色');
  gui.add(gridSettings, 'selectedShape', Object.keys(gridSettings.shapes)).name('选择形状');
  gui.add(gridSettings, 'clearShapes').name('清空画布');

  cellSizeSlider = createSlider(0, 3, 0, 1);
  cellSizeSlider.position(80, 10);

  updateGridParameters();

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = { shape: 0, color: gridSettings.colorNames['古韵玄武黑'] };
    }
  }
}

function draw() {
  background(255);
  textSize(16);
  fill(0);
  text('网格大小：', 10, 25);
  textSize(16);
  fill(120);
  text('©北京师范大学未来设计学院', width - 220, height - 15);

  updateGridParameters();

  if (gridSettings.showGrid) {
    stroke(200);
    strokeWeight(0.5);
    let offsetX = (width - cols * cellSize) / 2;
    let offsetY = (height - rows * cellSize) / 2;

    for (let i = 0; i <= cols; i++) {
      let x = offsetX + i * cellSize;
      line(x, 0, x, height);
    }
    for (let j = 0; j <= rows; j++) {
      let y = offsetY + j * cellSize;
      line(0, y, width, y);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (width - cols * cellSize) / 2 + i * cellSize;
      let y = (height - rows * cellSize) / 2 + j * cellSize;
      let cell = grid[i][j];

      fill(cell.color);
      noStroke();

      switch (cell.shape) {
                 case 1:
            rect(x, y, cellSize, cellSize);
            break;
          case 2:
            ellipse(x + cellSize / 2, y + cellSize / 2, cellSize);
            break;
          case 3:
            triangle(x, y, x, y + cellSize, x + cellSize, y + cellSize);
            break;
          case 4:
            triangle(x, y, x + cellSize, y, x, y + cellSize);
            break;
          case 5:
            triangle(x, y + cellSize, x + cellSize, y + cellSize, x + cellSize, y);
            break;
          case 6:
            triangle(x, y, x + cellSize, y, x + cellSize, y + cellSize);
            break;
          case 7:
            arc(x, y, cellSize * 2, cellSize * 2, 0, PI / 2);
            break;
          case 8:
            arc(x + cellSize, y, cellSize * 2, cellSize * 2, PI / 2, PI);
            break;
          case 9:
            arc(x + cellSize, y + cellSize, cellSize * 2, cellSize * 2, PI, PI * 3 / 2);
            break;
          case 10:
            arc(x, y + cellSize, cellSize * 2, cellSize * 2, PI * 3 / 2, PI * 2);
            break;
      }

      if (i === selectedCell.i && j === selectedCell.j) {
        stroke(0, 0, 255);
        strokeWeight(2);
        noFill();
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}

function mousePressed() {
  const guiContainer = gui.domElement;
  const guiRect = guiContainer.getBoundingClientRect();
  if (mouseX >= guiRect.left && mouseX <= guiRect.right && mouseY >= guiRect.top && mouseY <= guiRect.bottom) {
    return;
  }

  let offsetX = (width - cols * cellSize) / 2;
  let offsetY = (height - rows * cellSize) / 2;
  let i = floor((mouseX - offsetX) / cellSize);
  let j = floor((mouseY - offsetY) / cellSize);

  if (i >=   0 && i < cols && j >= 0 && j < rows) {
    // 更新网格中的形状和颜色
    grid[i][j].shape = gridSettings.shapes[gridSettings.selectedShape];
    grid[i][j].color = gridSettings.colorNames[gridSettings.selectedColorName];

    selectedCell = { i, j }; // 更新选中的单元格
  }
}

function updateGridParameters() {
  const specificSizes = [20, 25, 40, 50]; // 可以调整为你希望的尺寸
  cellSize = specificSizes[cellSizeSlider.value()];
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
}
