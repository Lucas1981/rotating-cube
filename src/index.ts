import { Canvas } from "./Canvas";
import {
  create3DObjectFromJSONData,
  draw3DObject,
  rotate3DObjectY,
} from "./3d-utils";
import cubeData from "./assets/cube.json";

// Global variables for animation
let canvas: Canvas;
let cube3D: ReturnType<typeof create3DObjectFromJSONData>;
let lastFrameTime = 0;
const ROTATION_SPEED = 60; // Degrees per second

// Animation loop function (time-based, frame-rate independent)
const loop = (currentTime: number = 0): void => {
  // Calculate delta time in seconds
  const deltaTime =
    lastFrameTime === 0 ? 0 : (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  // Clear the canvas
  canvas.clearScreen();

  // Rotate based on elapsed time (frame-rate independent)
  const rotationAmount = ROTATION_SPEED * deltaTime;
  rotate3DObjectY(cube3D, rotationAmount);

  // Draw the 3D object
  draw3DObject(canvas.getCtx(), cube3D);

  // Request next frame
  requestAnimationFrame(loop);
};

// Entry point for the 3D engine
async function main(): Promise<void> {
  canvas = new Canvas("canvas");

  // Load 3D cube from JSON data
  cube3D = create3DObjectFromJSONData(cubeData);

  console.log("3D engine started - cube will rotate continuously!");

  // Start the animation loop
  loop();
}

// Initialize the engine when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  main().catch((error) => {
    console.error("Failed to run program:", error);
  });
});
