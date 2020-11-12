import { DEFAULT_ECDH_CURVE } from "tls";
import {
  dotProduct,
  floor,
  fraction,
  add,
  vec2,
  Vec2,
  multiply,
  subtract,
  mix,
  Pos,
  cubic,
} from "./vectors";

const DEFAULT_V2 = vec2(12.9898, 78.233);
const DEFAULT_A = 43758.5453123;

export const randomNoise1Dto1D = (x: number, a: number = DEFAULT_A): number => {
  return fraction(Math.sin(x) * a);
};

export const randomNoise2Dto1D = (
  xy: Vec2,
  v2: Vec2 = DEFAULT_V2,
  a: number = DEFAULT_A
): number => {
  return fraction(Math.sin(dotProduct(xy, v2)) * a);
};

export const valueNoise2Dto1D = (
  xy: Vec2,
  interpolationFn: (x: Vec2) => Vec2 = cubic
): number => {
  const i: Vec2 = floor(xy);
  const f: Vec2 = fraction(xy);

  // Find the four corners of a the current 2D tile.
  const a: number = randomNoise2Dto1D(i);
  const b: number = randomNoise2Dto1D(add(i, vec2(1, 0)));
  const c: number = randomNoise2Dto1D(add(i, vec2(0, 1)));
  const d: number = randomNoise2Dto1D(add(i, vec2(1, 1)));

  // interpolation
  const u: Vec2 = interpolationFn(f);

  // Smooth interpolation of of the current point within the 2D tile
  // based on the values of the four corners.
  return (
    mix(a, b, u[Pos.x]) +
    (c - a) * u[Pos.y] * (1 - u[Pos.x]) +
    (d - b) * u[Pos.x] * u[Pos.y]
  );
};
