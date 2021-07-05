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
const tintButton = document.querySelector("#tint-button");
const shadeButton = document.querySelector("#shade-button");

const hslStep = 4;
const hslBoundary = 3;
const hslMaxSteps = Math.round((100 - hslBoundary * 2) / hslStep);
const bufferVal = 0.2;

// -----------------------------------------------------------
// Set default color picker and drawing behaviour
let penColor = drawColorPicker.value;
let backgroundColor = backgroundColorPicker.value;
let backgroundColorHSL = hexToHSL(backgroundColor);
let parsedBackgroundHSL = parseHSL(backgroundColorHSL);

let currentTotalCells = 0;

let drawMethod = basicDraw;

// -----------------------------------------------------------
// Allow user to manually select draw and background colors

drawColorPicker.addEventListener("input", (e) => {
  penColor = e.target.value;
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

    if (tempL + tintShadeCounter * hslStep >= 100 - hslBoundary) {
      tempL = 100 - hslBoundary;
    } else if (tempL[2] + tintShadeCounter * hslStep <= hslBoundary) {
      tempL = hslBoundary;
    } else {
      tempL += tintShadeCounter * hslStep;
    }

    cell.style.backgroundColor = `hsl(${parsedBackgroundHSL[0]}, ${parsedBackgroundHSL[1]}%, ${tempL}%)`;
  });
});

// backgroundColorPicker.addEventListener("change", (e) => {
//   backgroundColorHSL = hexToHSL(e.target.value);

//   // keep better track of the tint-shade-counter - 0 is nothing, less is shaded. more is tinted
// });

drawButton.addEventListener("click", () => {
  drawMethod = basicDraw;
});

eraserButton.addEventListener("click", () => {
  drawMethod = eraseDraw;
});

randomButton.addEventListener("click", () => {
  drawMethod = randomDraw;
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
    // event.target.removeAttribute("data-tint-shade-background");
    drawMethod(event);
  }
}

function basicDraw(event) {
  event.target.style.backgroundColor = penColor;
}

function eraseDraw(event) {
  event.target.removeAttribute("style");
}

function randomDraw(event) {
  function randomRGBValue() {
    return Math.floor(Math.random() * 255);
  }
  event.target.style.backgroundColor = `rgb(${randomRGBValue()},${randomRGBValue()},${randomRGBValue()})`;
}

function tintDraw(event) {
  if (!event.target.style.backgroundColor) {
    event.target.setAttribute("data-tint-shade-background", "true");
  }

  let tempHSL = parseHSL(
    RGBToHSL(window.getComputedStyle(event.target).backgroundColor)
  );

  let tintShadeCounter;

  if (event.target.getAttribute("data-tint-shade-counter")) {
    tintShadeCounter = +event.target.getAttribute("data-tint-shade-counter");
    if (
      event.target.getAttribute("data-tint-shade-background") &&
      parsedBackgroundHSL[2] + tintShadeCounter * hslStep >
        100 - hslBoundary + bufferVal * 5
    ) {
      tintShadeCounter = (100 - hslBoundary - parsedBackgroundHSL[2]) / hslStep;
    }
  } else {
    event.target.setAttribute("data-tint-shade-counter", "0");
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

    event.target.setAttribute("data-tint-shade-counter", `${tintShadeCounter}`);
    event.target.style.backgroundColor = `hsl(${tempHSL[0]}, ${tempHSL[1]}%, ${tempHSL[2]}%)`;
  }
}

function shadeDraw(event) {
  if (!event.target.style.backgroundColor) {
    event.target.setAttribute("data-tint-shade-background", "true");
  }

  let tempHSL = parseHSL(
    RGBToHSL(window.getComputedStyle(event.target).backgroundColor)
  );

  let tintShadeCounter;

  if (event.target.getAttribute("data-tint-shade-counter")) {
    tintShadeCounter = +event.target.getAttribute("data-tint-shade-counter");
    if (
      event.target.getAttribute("data-tint-shade-background") &&
      parsedBackgroundHSL[2] + tintShadeCounter * hslStep <
        hslBoundary - bufferVal * 5
    ) {
      tintShadeCounter = (hslBoundary - parsedBackgroundHSL[2]) / hslStep;
      console.log(tintShadeCounter);
    }
  } else {
    event.target.setAttribute("data-tint-shade-counter", "0");
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
    event.target.setAttribute("data-tint-shade-counter", `${tintShadeCounter}`);
    event.target.style.backgroundColor = `hsl(${tempHSL[0]}, ${tempHSL[1]}%, ${tempHSL[2]}%)`;
  }
}

// -----------------------------------------------------------
// Sketch area initialization and resizing

window.addEventListener("DOMContentLoaded", drawGrid);
sketchContainer.classList.add("container-border-grid-on");
gridSizeDisplay.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", () => {
  gridSizeDisplay.textContent = gridSizeInput.value;
  drawGrid();
});

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

function drawGrid() {
  let stylesReset = false;
  if (!stylesReset) {
    resetStyling();
    stylesReset = true;
  }

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

function resetStyling() {
  const gridItems = document.querySelectorAll(".grid-box");
  gridItems.forEach((cell) => {
    cell.removeAttribute("style");
    cell.removeAttribute("data-tint-shade-counter");
    cell.removeAttribute("data-tint-shade-background");
  });
}

resetButton.addEventListener("click", resetStyling);
