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

let drawFunction = changeColor;

function changeColor(event) {
  if (mouseDown) {
    event.target.style.backgroundColor = "hsl(120,60%,50%";
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

gridSizeInput.addEventListener("change", drawGrid);

function drawGrid() {
  const gridSize = gridSizeInput.value;
  root.style.setProperty("--grid-size", gridSize);

  while (sketchContainer.firstChild) {
    sketchContainer.removeChild(sketchContainer.firstChild);
  }

  for (let i = 0; i < gridSize ** 2; i += 1) {
    const gridBox = document.createElement("div");
    gridBox.classList.add("grid-box", "grid-lines");
    gridBox.addEventListener("mouseover", drawFunction);
    sketchContainer.appendChild(gridBox);
  }
}

// -----------------------------------------------------------
// Allow user to toggle the grid line visibility

let gridOn = true;

function toggleGridLines() {
  sketchContainer.classList.toggle("container-border-grid-on");
  sketchContainer.classList.toggle("container-border-grid-off");

  if (gridOn) {
    root.style.setProperty("--border-thin", "0px");
    gridOn = false;
  } else {
    root.style.setProperty("--border-thin", "1px solid rgb(170, 170, 170)");
    gridOn = true;
  }
}

const gridToggleButton = document.querySelector("#toggle-grid-lines");
gridToggleButton.addEventListener("click", toggleGridLines);
