const root = document.documentElement;

const sketchContainer = document.querySelector("#sketch-container");
const gridSizeInput = document.querySelector("#grid-size input");
const gridSizeDisplay = document.querySelector("#grid-size p");
const drawColorPicker = document.querySelector("#draw-color-picker");
const backgroundColorPicker = document.querySelector(
  "#background-color-picker"
);
const eraserButton = document.querySelector("#eraser-button");
const rainbowButton = document.querySelector("#rainbow-button");

// -----------------------------------------------------------
// Set default color picker and drawing behaviour
let penColor = drawColorPicker.value;
let backgroundColor = backgroundColorPicker.value;

let drawMethod = basicDraw;

// -----------------------------------------------------------
// Allow user to manually select draw and background colors

drawColorPicker.addEventListener("input", (e) => {
  penColor = e.target.value;
  drawMethod = basicDraw;
});

backgroundColorPicker.addEventListener("input", (e) => {
  backgroundColor = e.target.value;
  root.style.setProperty("--background-color", backgroundColor);
});

eraserButton.addEventListener("click", () => {
  drawMethod = eraseDraw;
});

rainbowButton.addEventListener("click", () => {
  drawMethod = rainbowDraw;
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
    drawMethod(event);
    console.log(drawMethod);
  }
}

function basicDraw(event) {
  event.target.style.backgroundColor = penColor;
}

function eraseDraw(event) {
  event.target.removeAttribute("style");
}

function rainbowDraw(event) {
  function randomRGBValue() {
    return Math.floor(Math.random() * 255);
  }
  event.target.style.backgroundColor = `rgb(${randomRGBValue()},${randomRGBValue()},${randomRGBValue()})`;
}

// -----------------------------------------------------------
// Sketch area initialization and resizing

window.addEventListener("DOMContentLoaded", drawGrid);
sketchContainer.classList.add("container-border-grid-on");
gridSizeDisplay.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", () => {
  gridSizeDisplay.textContent = gridSizeInput.value;
});

gridSizeInput.addEventListener("input", drawGrid);

// function drawGrid() {
//   const gridSize = gridSizeInput.value;
//   root.style.setProperty("--grid-size", gridSize);

//   while (sketchContainer.firstChild) {
//     sketchContainer.removeChild(sketchContainer.firstChild);
//   }

//   for (let i = 0; i < gridSize ** 2; i += 1) {
//     const gridBox = document.createElement("div");
//     gridBox.classList.add("grid-box", "grid-lines");
//     gridBox.addEventListener("pointerdown", changeColor);
//     gridBox.addEventListener("mouseover", changeColor);
//     sketchContainer.appendChild(gridBox);
//   }
// }

let currentTotalCells = 0;

function drawGrid() {
  const gridSize = gridSizeInput.value;
  const targetGridDimensions = gridSizeInput.value;
  root.style.setProperty("--grid-size", gridSize);

  if (currentTotalCells > targetGridDimensions ** 2) {
    while (currentTotalCells > targetGridDimensions ** 2) {
      sketchContainer.removeChild(sketchContainer.lastChild);
      currentTotalCells -= 1;
    }
  } else if (currentTotalCells < targetGridDimensions ** 2) {
    while (currentTotalCells < targetGridDimensions ** 2) {
      const gridBox = document.createElement("div");
      gridBox.classList.add("grid-box", "grid-lines");
      gridBox.addEventListener("pointerdown", changeColor);
      gridBox.addEventListener("mouseover", changeColor);
      sketchContainer.appendChild(gridBox);
      currentTotalCells += 1;
    }
  }
  resetStyling();
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

const gridToggleButton = document.querySelector("#toggle-grid-lines");
gridToggleButton.addEventListener("click", toggleGridLines);

// -----------------------------------------------------------
// Reset the sketch container

const resetButton = document.querySelector("#reset-button");

function resetStyling() {
  const gridItems = document.querySelectorAll(".grid-box");
  gridItems.forEach((cell) => {
    cell.removeAttribute("style");
  });
}

resetButton.addEventListener("click", resetStyling);
