import {
  abs,
  add,
  cubic,
  dotProduct,
  floor,
  fraction,
  isVec2,
  isVec3,
  max,
  mix,
  multiply,
  subtract,
  sin,
  vec2,
  vec3,
  Pos,
  Vec2,
  Vec3,
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

function mod289(x: Vec2): Vec2;
function mod289(x: Vec3): Vec3;
function mod289(x: Vec2 | Vec3): Vec2 | Vec3 {
  if (isVec2(x)) {
    return subtract(x, multiply(floor(multiply(x, 1 / 289)), 289));
  }

  if (isVec3(x)) {
    return subtract(x, multiply(floor(multiply(x, 1 / 289)), 289));
  }
}

function permute(x: Vec3): Vec3 {
  return mod289(multiply(add(multiply(x, 34), 1), x));
}

export const simplexNoise2Dto1D = (xy: Vec2): number => {
  // Precomputed values to create the skewed triangular grid.

  // (3.0-sqrt(3.0))/6.0
  const Cx = 0.211324865405187;

  // 0.5*(sqrt(3.0)-1.0)
  const Cy = 0.366025403784439;

  // -1.0 + 2.0 * Cx
  const Cz = -0.577350269189626;

  // 1.0 / 41.0
  const Cw = 0.024390243902439;

  const Cxx = vec2(Cx, Cx);
  const Cyy = vec2(Cy, Cy);
  const Czz = vec2(Cz, Cz);
  const Cwww = vec3(Cw, Cw, Cw);

  // Find the first corner of the triangle (x0)
  let i: Vec2 = floor(add(xy, dotProduct(xy, Cyy)));
  const x0: Vec2 = add(subtract(xy, i), dotProduct(i, Cxx));

  // Find the next two corners of the triangle (x1, x2)
  const i1: Vec2 = x0[Pos.x] > x0[Pos.y] ? vec2(1, 0) : vec2(0, 1);
  const x1: Vec2 = subtract(add(x0, Cxx), i1);
  const x2: Vec2 = add(x0, Czz);

  // Permutations to avoid truncation.
  i = mod289(i);
  const p: Vec3 = permute(
    add(
      permute(add(i[Pos.y], vec3(0, i1[Pos.y], 1))),
      i[Pos.x],
      vec3(0, i1[Pos.x], 1)
    )
  );
  let m: Vec3 = max(
    subtract(
      0.5,
      vec3(dotProduct(x0, x0), dotProduct(x1, x1), dotProduct(x2, x2))
    ),
    0
  );

  m = multiply(m, m);
  m = multiply(m, m);

  const x: Vec3 = subtract(multiply(2, fraction(multiply(p, Cwww))), 1);
  const h: Vec3 = subtract(abs(x), 0.5);
  const ox: Vec3 = floor(add(x, 0.5));
  const a0: Vec3 = subtract(x, ox);

  m = multiply(
    m,
    subtract(
      1.79284291400159,
      multiply(0.85373472095314, add(multiply(a0, a0), multiply(h, h)))
    )
  );

  const Gx = add(multiply(a0[Pos.x], x0[Pos.x]), multiply(h[Pos.x], x0[Pos.y]));
  const Gyz = add(
    multiply(vec2(a0[Pos.y], a0[Pos.z]), vec2(x1[Pos.x], x2[Pos.x])),
    multiply(vec2(h[Pos.y], h[Pos.z]), vec2(x1[Pos.y], x2[Pos.y]))
  );
  const g = vec3(Gx, Gyz[0], Gyz[1]);
  return multiply(130, dotProduct(m, g));
};
