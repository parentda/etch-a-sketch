const root = document.documentElement;

const sketchContainer = document.querySelector("#sketch-container");
const gridSizeInput = document.querySelector("#grid-size input");
const gridSizeDisplay = document.querySelector("#grid-size p");

// Sketch area initialization
document.addEventListener("DOMContentLoaded", drawGrid);
gridSizeDisplay.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", (e) => {
  gridSizeDisplay.textContent = e.target.value;
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
    gridBox.classList.add("grid-box");
    sketchContainer.appendChild(gridBox);
  }
}
