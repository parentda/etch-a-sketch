const root = document.documentElement;

const sketchContainer = document.querySelector("#sketch-container");
const gridSizeInput = document.querySelector("#grid-size input");
const gridSizeDisplay = document.querySelector("#grid-size p");

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
  if (event.type === "pointerdown") {
    event.target.style.backgroundColor = "hsl(98.6,54.4%,40.4%)"; // change this to drawFunction and have the various draw functions return an hsl value
  } else if (mouseDown) {
    event.target.style.backgroundColor = "hsl(98.6,54.4%,40.4%)";
  }
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
  reset();
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

function reset() {
  const gridItems = document.querySelectorAll(".grid-box");
  gridItems.forEach((cell) => {
    cell.removeAttribute("style");
  });
}

resetButton.addEventListener("click", reset);
