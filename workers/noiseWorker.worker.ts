/// <reference lib="WebWorker" />
export const worker: DedicatedWorkerGlobalScope = self as any;

import SimplexNoise from "simplex-noise";

import {
  createListener,
  createReadyMessage,
  HostMessage,
} from "utils/noiseWorkerApi";

import {
  Color,
  setAll,
  setRowColumn,
  getNeighbors,
  getRowColumn,
  addRowColumn,
  addArray,
  Opacity,
  printArray,
} from "utils/canvas";

const listener = createListener();
worker.addEventListener("message", listener.onMessage);

let noiseWeight = 2;
let darkenMultiplier = 0.2;
let lightenMultiplier = 0.05;

let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D;
let image: ImageData;
let width: number;
let height: number;
let play: boolean;

const simplex = new SimplexNoise("abe");

const computeNextFrame = (time: number) => {
  const accumulator = new Uint8ClampedArray(image.data.length);
  setAll(accumulator, width, height, 128, 128);
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const selfValue = getRowColumn(image.data, width, row, column);
      const neighbors = getNeighbors(image.data, width, height, row, column);
      const noise = neighbors.length
        ? simplex.noise2D(
            neighbors[Math.round(Math.random() * 200) % neighbors.length].value,
            time
          ) * noiseWeight
        : 0;
      neighbors.forEach((neighbor) => {
        const diffAvg = selfValue - (neighbor.value + selfValue) / 2;
        const neighborDiff =
          diffAvg > 0
            ? diffAvg * lightenMultiplier
            : diffAvg * darkenMultiplier;
        const selfDiff =
          -1 * diffAvg > 0
            ? -1 * diffAvg * lightenMultiplier
            : -1 * diffAvg * darkenMultiplier;

        if (diffAvg) {
          addRowColumn(
            accumulator,
            width,
            neighbor.row,
            neighbor.column,
            neighborDiff + noise,
            0
          );
          addRowColumn(accumulator, width, row, column, selfDiff + noise, 0);
        }
      });
    }
  }
  addArray(image.data, accumulator, -128);
  context.putImageData(image, 0, 0);
};

listener.listen(HostMessage.Pause, (evt) => {
  play = false;
});

listener.listen(HostMessage.Play, (evt) => {
  play = true;

  const nextFrame = (time: number) => {
    computeNextFrame(time);
    if (play) {
      requestAnimationFrame(nextFrame);
    }
  };

  requestAnimationFrame(nextFrame);
});

listener.listen(HostMessage.UpdateNoise, (evt) => {
  noiseWeight = evt.data.noise;
});

listener.listen(HostMessage.UpdateLighten, (evt) => {
  lightenMultiplier = evt.data.lighten;
});

listener.listen(HostMessage.UpdateDarken, (evt) => {
  darkenMultiplier = evt.data.darken;
});

listener.listen(HostMessage.Reset, (evt) => {
  setAll(image.data, width, height, Color.White);
  setRowColumn(image.data, width, height / 2, width / 2, Color.Black);
  context.putImageData(image, 0, 0);
});

listener.listen(HostMessage.Init, (evt) => {
  canvas = evt.data.canvas;
  width = evt.data.width;
  height = evt.data.height;
  noiseWeight = evt.data.noise;
  lightenMultiplier = evt.data.lighten;
  darkenMultiplier = evt.data.darken;

  context = canvas.getContext("2d");
  image = context.getImageData(0, 0, width, height);
});

worker.postMessage(createReadyMessage());
