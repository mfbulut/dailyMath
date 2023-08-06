import { getStroke } from "https://cdn.skypack.dev/perfect-freehand";

let brushSize = 4;
function createSvgPathFromPoints(points) {
  const d = points.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...points[0], "Q"]
  );

  d.push("Z");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d.join(" "));
  return path;
}

let lines = [];
let currentLine = [];
const svg = document.querySelector("svg");

function render() {
  svg.innerHTML = "";
  lines.forEach((line) => {
    const points = getStroke(line, {
      size: brushSize,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });
    const path = createSvgPathFromPoints(points);
    svg.appendChild(path);
  });
}

function handlePointerDown(e) {
  const rect = svg.getBoundingClientRect();
  currentLine = [[e.clientX - rect.left, e.clientY - rect.top, e.pressure]];
  lines.push(currentLine);
  render();
}

function handlePointerMove(e) {
  const rect = svg.getBoundingClientRect();
  if (e.buttons === 1) {
    currentLine.push([e.clientX - rect.left, e.clientY - rect.top, e.pressure]);
    render();
  }
}

function clearDrawing() {
  lines = [];
  render();
}

function changeBrush() {
  brushSize = brushSize == 4 ? 6 : 4;
  render();
}

svg.addEventListener("pointerdown", handlePointerDown);
svg.addEventListener("pointermove", handlePointerMove);
document.getElementById("clear-button").addEventListener("click", clearDrawing);
document.getElementById("brush-button").addEventListener("click", changeBrush);
