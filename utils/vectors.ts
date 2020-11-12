export enum Pos {
  x = 0,
  y = 1,
  z = 2,
  w = 3,
}

export enum Color {
  r = 0,
  g = 1,
  b = 2,
  a = 3,
}

export type Vec2 = readonly [x: number, y: number];
export type Vec3 = readonly [x: number, y: number, z: number];
export type Vec4 = readonly [x: number, y: number, z: number, w: number];

export type AnyVec = Vec2 | Vec3 | Vec4;

export const vec2 = (n1: number, n2?: number): Vec2 => {
  return n2 === undefined ? [n1, n1] : [n1, n2];
};

export function vec3(n1: number): Vec3;
export function vec3(n1: number, n2: number, n3: number): Vec3;
export function vec3(n1: number, n2?: number, n3?: number): Vec3 {
  return n3 === undefined ? [n1, n1, n1] : [n1, n2, n3];
}

export function vec4(n1: number): Vec4;
export function vec4(n1: number, n2: number, n3: number): Vec4;
export function vec4(n1: number, n2: number, n3: number, n4: number): Vec4;
export function vec4(n1: number, n2?: number, n3?: number, n4?: number): Vec4 {
  return n3 === undefined
    ? [n1, n1, n1, 1]
    : [n1, n2, n3, n4 === undefined ? 1 : n4];
}

export const unit2 = vec2(1);
export const unit3 = vec3(1);
export const unit4 = vec4(1);

export function dotProduct(v1: Vec2, v2: Vec2): number;
export function dotProduct(v1: Vec3, v2: Vec3): number;
export function dotProduct(v1: Vec4, v2: Vec4): number;
export function dotProduct(v1: AnyVec, v2: AnyVec): number {
  const size = v1.length;
  switch (size) {
    case 2:
      return v1[0] * v2[0] + v1[1] * v2[1];

    case 3:
      return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

    case 4:
      return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
  }
}

export function isScalarArray(
  values: readonly (AnyVec | number)[]
): values is number[] {
  return !values.find((vector) => typeof vector !== "number");
}

export function isVec2(value: AnyVec | number): value is Vec2 {
  return typeof value !== "number" && value.length === 2;
}

export function isVec3(value: AnyVec | number): value is Vec3 {
  return typeof value !== "number" && value.length === 3;
}

export function isVec4(value: AnyVec | number): value is Vec4 {
  return typeof value !== "number" && value.length === 4;
}

export function isScalar(value: AnyVec | number): value is number {
  return typeof value === "number";
}

export function addVectorsAtIndex(
  vectors: readonly (AnyVec | number)[],
  index: number
): number {
  return vectors.reduce<number>((sum: number, curr) => {
    if (typeof curr === "number") {
      return sum + curr;
    } else {
      return sum + curr[index];
    }
  }, 0);
}

export function subVectorsAtIndex(
  vectors: readonly (AnyVec | number)[],
  index: number
): number {
  return vectors.reduce<number>((sum: number, curr) => {
    if (typeof curr === "number") {
      return sum - curr;
    } else {
      return sum - curr[index];
    }
  }, 0);
}

export function multiplyVectorsAtIndex(
  vectors: readonly (AnyVec | number)[],
  index: number
): number {
  return vectors.reduce<number>((sum: number, curr) => {
    if (typeof curr === "number") {
      return sum * curr;
    } else {
      return sum * curr[index];
    }
  }, 0);
}

export function add(...vectors: readonly (Vec2 | number)[]): Vec2;
export function add(...vectors: readonly (Vec3 | number)[]): Vec3;
export function add(...vectors: readonly (Vec4 | number)[]): Vec4;
export function add(...vectors: readonly (AnyVec | number)[]): AnyVec {
  const sizeVec = vectors.find((vector) => typeof vector !== "number");
  if (isScalarArray(vectors)) {
    vectors.reduce((sum, curr) => sum + curr);
  } else {
    const sizeVec = (vectors.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          addVectorsAtIndex(vectors, 0),
          addVectorsAtIndex(vectors, 1)
        );

      case 3:
        return vec3(
          addVectorsAtIndex(vectors, 0),
          addVectorsAtIndex(vectors, 1),
          addVectorsAtIndex(vectors, 2)
        );

      case 4:
        return vec4(
          addVectorsAtIndex(vectors, 0),
          addVectorsAtIndex(vectors, 1),
          addVectorsAtIndex(vectors, 2),
          addVectorsAtIndex(vectors, 3)
        );
    }
  }
}

export function subtract(...vectors: readonly (Vec2 | number)[]): Vec2;
export function subtract(...vectors: readonly (Vec3 | number)[]): Vec3;
export function subtract(...vectors: readonly (Vec4 | number)[]): Vec4;
export function subtract(...vectors: readonly (AnyVec | number)[]): AnyVec {
  const sizeVec = vectors.find((vector) => typeof vector !== "number");
  if (isScalarArray(vectors)) {
    vectors.reduce((sum, curr) => sum - curr);
  } else {
    const sizeVec = (vectors.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1)
        );

      case 3:
        return vec3(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1),
          multiplyVectorsAtIndex(vectors, 2)
        );

      case 4:
        return vec4(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1),
          multiplyVectorsAtIndex(vectors, 2),
          multiplyVectorsAtIndex(vectors, 3)
        );
    }
  }
}

export function multiply(...vectors: readonly (Vec2 | number)[]): Vec2;
export function multiply(...vectors: readonly (Vec3 | number)[]): Vec3;
export function multiply(...vectors: readonly (Vec4 | number)[]): Vec4;
export function multiply(...vectors: readonly (AnyVec | number)[]): AnyVec {
  const sizeVec = vectors.find((vector) => typeof vector !== "number");
  if (isScalarArray(vectors)) {
    vectors.reduce((sum, curr) => sum * curr);
  } else {
    const sizeVec = (vectors.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1)
        );

      case 3:
        return vec3(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1),
          multiplyVectorsAtIndex(vectors, 2)
        );

      case 4:
        return vec4(
          multiplyVectorsAtIndex(vectors, 0),
          multiplyVectorsAtIndex(vectors, 1),
          multiplyVectorsAtIndex(vectors, 2),
          multiplyVectorsAtIndex(vectors, 3)
        );
    }
  }
}

export function cross(v1: Vec3, v2: Vec3): Vec3 {
  return vec3(
    v1[Pos.y] * v2[Pos.z] - v1[Pos.z] * v2[Pos.y],
    v1[Pos.z] * v2[Pos.x] - v1[Pos.x] * v2[Pos.z],
    v1[Pos.x] * v2[Pos.y] - v1[Pos.y] * v2[Pos.x]
  );
}

export function fraction<T extends AnyVec>(v: T): T;
export function fraction(v: number): number;
export function fraction(v: any): any {
  if (typeof v === "number") {
    return v - Math.floor(v);
  }

  return v.map((val) => val - Math.floor(val));
}

export function floor<T extends AnyVec>(v: T): T;
export function floor(v: number): number;
export function floor(v: any): any {
  if (typeof v === "number") {
    return Math.floor(v);
  }

  return v.map((val) => Math.floor(val));
}

export function mix(x: number, y: number, a: number): number;
export function mix(x: Vec2, y: Vec2, a: number): Vec2;
export function mix(x: Vec3, y: Vec3, a: number): Vec3;
export function mix(x: Vec4, y: Vec4, a: number): Vec4;
export function mix(
  x: AnyVec | number,
  y: AnyVec | number,
  a: number
): AnyVec | number {
  if (isVec2(x) && isVec2(y)) {
    return add(multiply(x, 1 - a), multiply(y, a));
  }

  if (isVec3(x) && isVec3(y)) {
    return add(multiply(x, 1 - a), multiply(y, a));
  }

  if (isVec4(x) && isVec4(y)) {
    return add(multiply(x, 1 - a), multiply(y, a));
  }

  if (isScalar(x) && isScalar(y)) {
    return add(multiply(x, 1 - a), multiply(y, a));
  }
}
