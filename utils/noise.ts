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
  sin,
  quintic,
} from "./vectors";

const DEFAULT_1D_V1 = vec2(12.9898, 78.233);
const DEFAULT_2D_V1 = vec2(127.1, 311.7);
const DEFAULT_2D_V2 = vec2(269.5, 183.3);
const DEFAULT_A = 43758.5453123;

const TOP_LEFT = vec2(0, 0);
const TOP_RIGHT = vec2(1, 0);
const BOTTOM_LEFT = vec2(0, 1);
const BOTTOM_RIGHT = vec2(1, 1);

export const randomNoise1Dto1D = (x: number, a: number = DEFAULT_A): number => {
  return fraction(Math.sin(x) * a);
};

export const randomNoise2Dto1D = (
  xy: Vec2,
  v1: Vec2 = DEFAULT_1D_V1,
  a: number = DEFAULT_A
): number => {
  return fraction(multiply(sin(dotProduct(xy, v1)), a));
};

export const randomNoise2Dto2D = (
  xy: Vec2,
  v1: Vec2 = DEFAULT_2D_V1,
  v2: Vec2 = DEFAULT_2D_V2,
  a = DEFAULT_A
): Vec2 => {
  const st: Vec2 = vec2(dotProduct(xy, v1), dotProduct(xy, v2));
  return add(-1, multiply(2, fraction(multiply(sin(st), a))));
};

export const valueNoise2Dto1D = (
  xy: Vec2,
  interpolationFn: (x: Vec2) => Vec2 = cubic
): number => {
  const i: Vec2 = floor(xy);
  const f: Vec2 = fraction(xy);

  // Find the four corners of a the current 2D tile.
  const a: number = randomNoise2Dto1D(add(i, TOP_LEFT));
  const b: number = randomNoise2Dto1D(add(i, TOP_RIGHT));
  const c: number = randomNoise2Dto1D(add(i, BOTTOM_LEFT));
  const d: number = randomNoise2Dto1D(add(i, BOTTOM_RIGHT));

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

export const gradientNoise2Dto1D = (
  xy: Vec2,
  interpolationFn: (x: Vec2) => Vec2 = cubic
): number => {
  const i: Vec2 = floor(xy);
  const f: Vec2 = fraction(xy);

  // Find the four corners of a the current 2D tile.
  const a: Vec2 = randomNoise2Dto2D(add(i, TOP_LEFT));
  const b: Vec2 = randomNoise2Dto2D(add(i, TOP_RIGHT));
  const c: Vec2 = randomNoise2Dto2D(add(i, BOTTOM_LEFT));
  const d: Vec2 = randomNoise2Dto2D(add(i, BOTTOM_RIGHT));

  const u = interpolationFn(f);

  return mix(
    mix(
      dotProduct(a, subtract(f, TOP_LEFT)),
      dotProduct(b, subtract(f, TOP_RIGHT)),
      u[Pos.x]
    ),
    mix(
      dotProduct(c, subtract(f, BOTTOM_LEFT)),
      dotProduct(d, subtract(f, BOTTOM_RIGHT)),
      u[Pos.x]
    ),
    u[Pos.y]
  );
};
