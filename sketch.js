let grid = [];
let cellSizeSlider;
let cols, rows, cellSize;
let gui;
let selectedCell = { i: -1, j: -1 };
let gridSettings = {
  showGrid: true,
  color: '#1E1B1A',
  colorNames: {
    '古韵玄武黑': '#1E1B1A',
    '月净雪玉白': '#D9D9D6',
    '钟灵长青绿': '#227F46',
    '长天深霁蓝': '#013DA2',
    '千秋宫墙红': '#AB2920',
    '辉光琉璃黄': '#FA9D08'
  },
  selectedColorName: '古韵玄武黑',
  cellSize: 20, // 默认网格尺寸
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

  // 使用颜色名称作为下拉菜单的选项
  gui.add(gridSettings, 'selectedColorName', Object.keys(gridSettings.colorNames)).name('形状颜色').onChange(function(newColorName) {
    if (selectedCell.i >= 0 && selectedCell.j >= 0) {
      grid[selectedCell.i][selectedCell.j].color = gridSettings.colorNames[newColorName];
    }
  });

  gui.add(gridSettings, 'clearShapes').name('清空画布');

  cellSizeSlider = createSlider(0, 3, 0, 1);
  cellSizeSlider.position(80, 10);

  updateGridParameters();

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = { shape: 0, color: '#1E1B1A' };
    }
  }
}

function draw() {
  background(255);
  textSize(16); // 设置文字大小
  fill(0); // 设置文字颜色为黑色
  text('网格大小：', 10, 25); // 在画布上显示文字
  textSize(16); // 设置文字大小
  fill(120); // 设置文字颜色为黑色
  text('©北京师范大学未来设计学院', width-220, height-15); // 在画布上显示文字
  // Update grid parameters based on the slider
  updateGridParameters();

  // Draw grid lines if enabled
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

  // Draw shapes in each grid cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (width - cols * cellSize) / 2 + i * cellSize;
      let y = (height - rows * cellSize) / 2 + j * cellSize;
      let cell = grid[i][j];

      fill(cell.color);
      noStroke();
      
      // 根据cell.shape绘制不同的形状
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

      // 如果当前绘制的格子是被选中的格子，则添加蓝色描边高亮
      if (i === selectedCell.i && j === selectedCell.j) {
        stroke(0, 0, 255); // 蓝色
        strokeWeight(2);
        noFill();
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}

function mousePressed() {
  // 获取dat.GUI的DOM元素
  const guiContainer = gui.domElement;

  // 获取dat.GUI容器的位置和大小
  const guiRect = guiContainer.getBoundingClientRect();

  // 判断鼠标点击是否在dat.GUI的区域内
  if (mouseX >= guiRect.left && mouseX <= guiRect.right &&
      mouseY >= guiRect.top && mouseY <= guiRect.bottom) {
    // 鼠标点击在dat.GUI内，不执行任何操作
    return;
  }

  // 以下是画布上网格选中的逻辑
  let offsetX = (width - cols * cellSize) / 2;
  let offsetY = (height - rows * cellSize) / 2;
  let i = floor((mouseX - offsetX) / cellSize);
  let j = floor((mouseY - offsetY) / cellSize);

  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j].shape = (grid[i][j].shape + 1) % 11; // 循环形状
    selectedCell = { i, j }; // 更新选中的单元格
    
    // 更新颜色为当前在dat.GUI中选定的颜色
    const currentColor = gridSettings.colorNames[gridSettings.selectedColorName];
    grid[i][j].color = currentColor; // 使用选中的颜色更新网格颜色

    gui.__controllers.forEach(controller => {
      if(controller.property === 'color') {
        controller.setValue(currentColor);
      }
    });
  }
}


function updateGridParameters() {
  const specificSizes = [20, 25, 40, 50];
  cellSize = specificSizes[cellSizeSlider.value()];
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
}
