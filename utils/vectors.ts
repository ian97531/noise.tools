export type Vec2 = readonly [number, number];
export type Vec3 = readonly [number, number, number];

export const vec2 = (n1: number, n2?: number): Vec2 => {
  return n2 === undefined ? [n1, n1] : [n1, n2];
};

export function vec3(n1: number): Vec3;
export function vec3(n1: number, n2: number, n3: number): Vec3;
export function vec3(n1: number, n2?: number, n3?: number): Vec3 {
  return n3 === undefined ? [n1, n1, n1] : [n1, n2, n3];
}

export function dotProduct(v1: Vec2, v2: Vec2): number;
export function dotProduct(v1: Vec3, v2: Vec3): number;
export function dotProduct(v1: Vec2 | Vec3, v2: Vec2 | Vec3): number {
  return v1.length === 2
    ? v1[0] * v2[0] + v1[1] * v2[1]
    : v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
