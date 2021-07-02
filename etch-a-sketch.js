const root = document.documentElement;

const sketchContainer = document.querySelector("#sketch-container");
const gridSizeInput = document.querySelector("#grid-size input");
const gridSizeDisplay = document.querySelector("#grid-size p");

let mouseDown = false;

window.addEventListener("pointerdown", () => {
  mouseDown = true;
});

window.addEventListener("pointerup", () => {
  mouseDown = false;
});

// Sketch area initialization
window.addEventListener("DOMContentLoaded", drawGrid);
gridSizeDisplay.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", () => {
  gridSizeDisplay.textContent = gridSizeInput.value;
});

gridSizeInput.addEventListener("change", drawGrid);

function changeColor(event) {
  if (mouseDown) {
    event.target.style.backgroundColor = "black";
  }
}

function drawGrid() {
  const gridSize = gridSizeInput.value;
  root.style.setProperty("--grid-size", gridSize);

  while (sketchContainer.firstChild) {
    sketchContainer.removeChild(sketchContainer.firstChild);
  }

  for (let i = 0; i < gridSize ** 2; i += 1) {
    const gridBox = document.createElement("div");
    gridBox.classList.add("grid-box");
    gridBox.addEventListener("mouseover", changeColor);
    sketchContainer.appendChild(gridBox);
  }
}
