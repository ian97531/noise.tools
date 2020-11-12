/// <reference lib="WebWorker" />
export const worker: DedicatedWorkerGlobalScope = self as any;

import {
  createListener,
  createReadyMessage,
  HostMessage,
} from "utils/noiseWorkerApi";

import { Color, Offset, Opacity, getIndexForRowColumn } from "utils/canvas";

import { randomNoise2Dto1D, valueNoise2Dto1D } from "utils/noise";
import { vec2, multiply, divide } from "utils/vectors";

const listener = createListener();
worker.addEventListener("message", listener.onMessage);

let v1 = 12.9898;
let v2 = 78.233;
let a = 43758.5453123;

let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D;
let image: ImageData;
let width: number;
let height: number;
let play: boolean;

const computeNextFrame = (time: number) => {
  const data = image.data;
  const res = vec2(width, height);
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const xy = multiply(divide(vec2(row, column), res), 10);
      const random = valueNoise2Dto1D(xy) * 255;
      const index = getIndexForRowColumn(width, row, column);
      data[index + Offset.Red] = random;
      data[index + Offset.Green] = random;
      data[index + Offset.Blue] = random;
      data[index + Offset.Opacity] = 255;
    }
  }
  context.putImageData(image, 0, 0);
};

listener.listen(HostMessage.Pause, (evt) => {
  play = false;
});

listener.listen(HostMessage.Play, (evt) => {
  play = true;

  const nextFrame = (time: number) => {
    computeNextFrame(time);
    // if (play) {
    //   requestAnimationFrame(nextFrame);
    // }
  };

  requestAnimationFrame(nextFrame);
});

listener.listen(HostMessage.UpdateV1, (evt) => {
  v1 = evt.data.v1;
});

listener.listen(HostMessage.UpdateV2, (evt) => {
  v2 = evt.data.v2;
});

listener.listen(HostMessage.UpdateA, (evt) => {
  a = evt.data.a;
});

listener.listen(HostMessage.Reset, (evt) => {
  context.putImageData(image, 0, 0);
});

listener.listen(HostMessage.Init, (evt) => {
  canvas = evt.data.canvas;
  width = evt.data.width;
  height = evt.data.height;
  v1 = evt.data.v1;
  v2 = evt.data.v2;
  a = evt.data.a;

  context = canvas.getContext("2d");
  image = context.getImageData(0, 0, width, height);
});

worker.postMessage(createReadyMessage());
