const sketchContainer = document.querySelector("#sketch-container");
console.log(sketchContainer);

function drawGrid(gridSize) {
  for (let i = 0; i < gridSize ** 2; i++) {
    const gridBox = document.createElement("div");
    gridBox.classList.add("grid-box");
    sketchContainer.appendChild(gridBox);
  }
}

drawGrid(100);
