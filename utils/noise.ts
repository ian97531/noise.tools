import { fraction } from "./math";
import { dotProduct, Vec2 } from "./vectors";

export const randomNoise1Dto1D = (x: number, a: number): number => {
  return fraction(Math.sin(x) * a);
};

export const randomNoise2Dto1D = (xy: Vec2, v: Vec2, a: number): number => {
  return fraction(Math.sin(dotProduct(xy, v)) * a);
};
