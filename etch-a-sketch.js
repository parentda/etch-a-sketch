const root = document.documentElement;

const sketchContainer = document.querySelector("#sketch-container");
const gridSizeInput = document.querySelector("#grid-size input");
const gridSizeDisplay = document.querySelector("#grid-size p");
const drawColorPicker = document.querySelector("#draw-color-picker");
const backgroundColorPicker = document.querySelector(
  "#background-color-picker"
);
const gridToggleButton = document.querySelector("#toggle-grid-lines");
const resetButton = document.querySelector("#reset-button");
const drawButton = document.querySelector("#draw-button");
const eraserButton = document.querySelector("#eraser-button");
const randomButton = document.querySelector("#random-button");
const fillButton = document.querySelector("#fill-button");
const tintButton = document.querySelector("#tint-button");
const shadeButton = document.querySelector("#shade-button");

const hslStep = 4;
const hslBoundary = 3;
const bufferVal = 0.2;

// -----------------------------------------------------------
// Set default color picker and drawing behaviour
let penColor = drawColorPicker.value;
let penColorRGB = hexToRGB(penColor);
let backgroundColor = backgroundColorPicker.value;
let backgroundColorHSL = hexToHSL(backgroundColor);
let parsedBackgroundHSL = parseHSL(backgroundColorHSL);

let currentTotalCells = 0;
let gridSize = +gridSizeInput.value;

let drawMethod = basicDraw;

let matrix2D;

// -----------------------------------------------------------
// Allow user to manually select draw and background colors

drawColorPicker.addEventListener("input", (e) => {
  penColor = e.target.value;
  penColorRGB = hexToRGB(penColor);
});

backgroundColorPicker.addEventListener("input", (e) => {
  backgroundColor = e.target.value;
  backgroundColorHSL = hexToHSL(e.target.value);
  parsedBackgroundHSL = parseHSL(backgroundColorHSL);

  root.style.setProperty("--background-color", backgroundColor);

  const shadedGrids = document.querySelectorAll(
    "[data-tint-shade-counter][data-tint-shade-background]"
  );
  shadedGrids.forEach((cell) => {
    let tempL = parsedBackgroundHSL[2];

    const tintShadeCounter = +cell.getAttribute("data-tint-shade-counter");

    if (tempL + tintShadeCounter * hslStep >= 100 - hslBoundary - bufferVal) {
      tempL = 100 - hslBoundary;
    } else if (tempL + tintShadeCounter * hslStep <= hslBoundary + bufferVal) {
      tempL = hslBoundary;
    } else {
      tempL += tintShadeCounter * hslStep;
    }

    cell.style.backgroundColor = `hsl(${parsedBackgroundHSL[0]}, ${parsedBackgroundHSL[1]}%, ${tempL}%)`;
  });
});

drawButton.addEventListener("click", () => {
  drawMethod = basicDraw;
});

eraserButton.addEventListener("click", () => {
  drawMethod = eraseDraw;
});

randomButton.addEventListener("click", () => {
  drawMethod = randomDraw;
});

fillButton.addEventListener("click", () => {
  drawMethod = fillDraw;
});

tintButton.addEventListener("click", () => {
  drawMethod = tintDraw;
});

shadeButton.addEventListener("click", () => {
  drawMethod = shadeDraw;
});

// -----------------------------------------------------------
// Enable drawing functionality only on simultaneous click and hover

let mouseDown = false;

document.addEventListener("pointerdown", () => {
  mouseDown = true;
});

document.addEventListener("pointerup", () => {
  mouseDown = false;
});

// -----------------------------------------------------------
// Define the various drawing functions below

function changeColor(event) {
  if (event.type === "pointerdown" || mouseDown) {
    if (drawMethod !== tintDraw && drawMethod !== shadeDraw) {
      resetShading(event.target);
    }
    drawMethod(event.target);
  }
}

function basicDraw(cell) {
  cell.style.backgroundColor = penColor;
}

function eraseDraw(cell) {
  cell.removeAttribute("style");
}

function randomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function randomDraw(cell) {
  cell.style.backgroundColor = `hsl(${randomValue(0, 360)}, ${randomValue(
    80,
    100
  )}%, ${randomValue(30, 70)}%)`;
}

function fillDraw(cell) {
  const targetBackgroundColor = cell.style.backgroundColor;
  recursiveFill2(cell, targetBackgroundColor);
}

function recursiveFill(cell, targetBackgroundColor) {
  if (cell.style.backgroundColor === penColorRGB) {
    return;
  }

  cell.style.backgroundColor = penColor;
  const row = +cell.getAttribute("data-row");
  const col = +cell.getAttribute("data-col");

  const adjacentCells = [];

  adjacentCells.push(
    document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`),
    document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`),
    document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`),
    document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`)
  );

  const adjacentCellsFiltered = adjacentCells.filter(
    (unfilteredCell) =>
      unfilteredCell !== null &&
      unfilteredCell.style.backgroundColor === targetBackgroundColor
  );

  if (!adjacentCellsFiltered.length) return;

  for (const filteredCell in adjacentCellsFiltered) {
    if (
      adjacentCellsFiltered[filteredCell].style.backgroundColor ===
      targetBackgroundColor
    ) {
      recursiveFill(adjacentCellsFiltered[filteredCell], targetBackgroundColor);
    }
  }

  // adjacentCellsFiltered.forEach((filteredCell) => {
  //   if (filteredCell.style.backgroundColor === targetBackgroundColor) {
  //     recursiveFill(filteredCell, targetBackgroundColor);
  //   }
  // });

  return;

  // Create 2D array when resizing and reference that??

  // return;

  // if (row - 1 !== 0) {
  //   const upCell = document.querySelector(
  //     `[data-row="${row - 1}"][data-col="${col}"]`
  //   );
  //   adjacentCells.push(upCell);
  // }

  // if (col + 1 <= gridSize) {
  //   const rightCell = document.querySelector(
  //     `[data-row="${row}"][data-col="${col + 1}"]`
  //   );
  //   adjacentCells.push(rightCell);
  // }

  // if (row + 1 <= gridSize) {
  //   const downCell = document.querySelector(
  //     `[data-row="${row + 1}"][data-col="${col}"]`
  //   );
  //   adjacentCells.push(downCell);
  // }

  // if (col - 1 !== 0) {
  //   const leftCell = document.querySelector(
  //     `[data-row="${row}"][data-col="${col - 1}"]`
  //   );
  //   adjacentCells.push(leftCell);
  // }

  // base case - no adjacent square has the target background color
  // if () {}
  // recursive cases - any adjacent square has the target background color
}

function recursiveFill2(cell, targetBackgroundColor) {
  if (cell.style.backgroundColor === penColorRGB) {
    return;
  }

  cell.style.backgroundColor = penColor;
  const row = +cell.getAttribute("data-row");
  const col = +cell.getAttribute("data-col");

  let baseCase = true;

  let top = false;
  let right = false;
  let bottom = false;
  let left = false;

  if (
    row - 1 >= 0 &&
    matrix2D[row - 1][col].style.backgroundColor === targetBackgroundColor
  ) {
    top = true;
    baseCase = false;
  }

  if (
    col + 1 < gridSize &&
    matrix2D[row][col + 1].style.backgroundColor === targetBackgroundColor
  ) {
    right = true;
    baseCase = false;
  }

  if (
    row + 1 < gridSize &&
    matrix2D[row + 1][col].style.backgroundColor === targetBackgroundColor
  ) {
    bottom = true;
    baseCase = false;
  }

  if (
    col - 1 >= 0 &&
    matrix2D[row][col - 1].style.backgroundColor === targetBackgroundColor
  ) {
    left = true;
    baseCase = false;
  }

  if (baseCase) return;

  if (
    top &&
    matrix2D[row - 1][col].style.backgroundColor === targetBackgroundColor
  ) {
    recursiveFill2(matrix2D[row - 1][col], targetBackgroundColor);
  }

  if (
    right &&
    matrix2D[row][col + 1].style.backgroundColor === targetBackgroundColor
  ) {
    recursiveFill2(matrix2D[row][col + 1], targetBackgroundColor);
  }

  if (
    bottom &&
    matrix2D[row + 1][col].style.backgroundColor === targetBackgroundColor
  ) {
    recursiveFill2(matrix2D[row + 1][col], targetBackgroundColor);
  }

  if (
    left &&
    matrix2D[row][col - 1].style.backgroundColor === targetBackgroundColor
  ) {
    recursiveFill2(matrix2D[row][col - 1], targetBackgroundColor);
  }

  // for (const filteredCell in adjacentCellsFiltered) {
  //   if (
  //     adjacentCellsFiltered[filteredCell].style.backgroundColor ===
  //     targetBackgroundColor
  //   ) {
  //     recursiveFill(adjacentCellsFiltered[filteredCell], targetBackgroundColor);
  //   }
  // }

  // adjacentCellsFiltered.forEach((filteredCell) => {
  //   if (filteredCell.style.backgroundColor === targetBackgroundColor) {
  //     recursiveFill(filteredCell, targetBackgroundColor);
  //   }
  // });

  // return;
}

function tintDraw(cell) {
  if (!cell.style.backgroundColor) {
    cell.setAttribute("data-tint-shade-background", "true");
  }

  let tempHSL = parseHSL(
    RGBToHSL(window.getComputedStyle(cell).backgroundColor)
  );

  let tintShadeCounter;

  if (cell.getAttribute("data-tint-shade-counter")) {
    tintShadeCounter = +cell.getAttribute("data-tint-shade-counter");

    if (
      cell.getAttribute("data-tint-shade-background") &&
      parsedBackgroundHSL[2] + tintShadeCounter * hslStep <
        hslBoundary - bufferVal * 5
    ) {
      tintShadeCounter = (hslBoundary - parsedBackgroundHSL[2]) / hslStep;
    }
  } else {
    cell.setAttribute("data-tint-shade-counter", "0");
    tintShadeCounter = 0;
  }

  if (tempHSL[2] >= 100 - hslBoundary - bufferVal) {
    // do nothing
  } else {
    if (tempHSL[2] > 100 - (hslStep + hslBoundary)) {
      tempHSL[2] = 100 - hslBoundary;
      tintShadeCounter += 1;
    } else {
      tempHSL[2] += hslStep;
      tintShadeCounter += 1;
    }

    cell.setAttribute("data-tint-shade-counter", `${tintShadeCounter}`);
    cell.style.backgroundColor = `hsl(${tempHSL[0]}, ${tempHSL[1]}%, ${tempHSL[2]}%)`;
  }
}

function shadeDraw(cell) {
  if (!cell.style.backgroundColor) {
    cell.setAttribute("data-tint-shade-background", "true");
  }

  let tempHSL = parseHSL(
    RGBToHSL(window.getComputedStyle(cell).backgroundColor)
  );

  let tintShadeCounter;

  if (cell.getAttribute("data-tint-shade-counter")) {
    tintShadeCounter = +cell.getAttribute("data-tint-shade-counter");

    if (
      cell.getAttribute("data-tint-shade-background") &&
      parsedBackgroundHSL[2] + tintShadeCounter * hslStep >
        100 - hslBoundary + bufferVal * 5
    ) {
      tintShadeCounter = (100 - hslBoundary - parsedBackgroundHSL[2]) / hslStep;
    }
  } else {
    cell.setAttribute("data-tint-shade-counter", "0");
    tintShadeCounter = 0;
  }

  if (tempHSL[2] <= hslBoundary + bufferVal) {
    // do nothing
  } else {
    if (tempHSL[2] < hslStep + hslBoundary) {
      tempHSL[2] = hslBoundary;
      tintShadeCounter -= 1;
    } else {
      tempHSL[2] -= hslStep;
      tintShadeCounter -= 1;
    }
    cell.setAttribute("data-tint-shade-counter", `${tintShadeCounter}`);
    cell.style.backgroundColor = `hsl(${tempHSL[0]}, ${tempHSL[1]}%, ${tempHSL[2]}%)`;
  }
}

// -----------------------------------------------------------
// Sketch area initialization and resizing

window.addEventListener("DOMContentLoaded", drawGrid);
window.addEventListener("DOMContentLoaded", indexGrid);
window.addEventListener("DOMContentLoaded", create2DArray);

sketchContainer.classList.add("container-border-grid-on");
gridSizeDisplay.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", () => {
  gridSizeDisplay.textContent = gridSizeInput.value;
  drawGrid();
});

gridSizeInput.addEventListener("change", indexGrid);
gridSizeInput.addEventListener("change", create2DArray);

function drawGrid() {
  resetStyling();

  gridSize = +gridSizeInput.value;
  root.style.setProperty("--grid-size", gridSize);

  if (currentTotalCells > gridSize ** 2) {
    while (currentTotalCells > gridSize ** 2) {
      sketchContainer.removeChild(sketchContainer.lastChild);
      currentTotalCells -= 1;
    }
  } else if (currentTotalCells < gridSize ** 2) {
    while (currentTotalCells < gridSize ** 2) {
      const gridBox = document.createElement("div");
      gridBox.classList.add("grid-box", "grid-lines");
      gridBox.addEventListener("pointerdown", changeColor);
      gridBox.addEventListener("mouseover", changeColor);
      sketchContainer.appendChild(gridBox);
      currentTotalCells += 1;
    }
  }
}

function indexGrid() {
  const gridItems = document.querySelectorAll(".grid-box");

  let currentIndex = 0;

  for (let i = 0; i < gridSize; i += 1) {
    for (let j = 0; j < gridSize; j += 1) {
      gridItems[currentIndex].setAttribute("data-row", i);
      gridItems[currentIndex].setAttribute("data-col", j);
      currentIndex += 1;
    }
  }
}

function create2DArray() {
  const gridItems = document.querySelectorAll(".grid-box");

  matrix2D = new Array(gridSize).fill().map(() => new Array(gridSize).fill());

  let currentIndex = 0;

  for (let i = 0; i < gridSize; i += 1) {
    for (let j = 0; j < gridSize; j += 1) {
      matrix2D[i][j] = gridItems[currentIndex];
      currentIndex += 1;
    }
  }
}

// -----------------------------------------------------------
// Allow user to toggle the grid line visibility

let gridOn = true;

function toggleGridLines() {
  if (gridOn) {
    root.style.setProperty("--border-thin", "0px");
    gridOn = false;
  } else {
    root.style.setProperty("--border-thin", "1px solid var(--line-color)");
    gridOn = true;
  }
}

gridToggleButton.addEventListener("click", toggleGridLines);

// -----------------------------------------------------------
// Reset the sketch container

function resetShading(cell) {
  cell.removeAttribute("data-tint-shade-counter");
  cell.removeAttribute("data-tint-shade-background");
}

function resetStyling() {
  const gridItems = document.querySelectorAll(".grid-box");
  gridItems.forEach((cell) => {
    cell.removeAttribute("style");
    resetShading(cell);
  });
}

resetButton.addEventListener("click", resetStyling);
