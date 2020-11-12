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

export type MathFunction =
  | ((...operands: number[]) => number)
  | ((...operands: (Vec2 | number)[]) => Vec2)
  | ((...operands: (Vec3 | number)[]) => Vec2)
  | ((...operands: (Vec4 | number)[]) => Vec4);

export type InterpolationFunction =
  | ((x: number) => number)
  | ((x: Vec2) => Vec2)
  | ((x: Vec3) => Vec3)
  | ((x: Vec4) => Vec4);

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

function addVectorsAtIndex(
  operands: readonly (AnyVec | number)[],
  index: number
): number {
  return operands.reduce<number>((result: number, curr) => {
    if (typeof curr === "number") {
      return result + curr;
    } else {
      return index < curr.length ? result + curr[index] : result;
    }
  }, 0);
}

function subVectorsAtIndex(
  operands: readonly (AnyVec | number)[],
  index: number
): number {
  if (operands.length > 1) {
    return operands.reduce<number>((result: number, curr, i) => {
      if (i === 0) {
        if (typeof curr === "number") {
          return curr;
        }

        return index < curr.length ? curr[index] : 0;
      }

      if (typeof curr === "number") {
        return result - curr;
      }

      return index < curr.length ? result - curr[index] : result;
    }, 0);
  }

  if (operands.length === 1) {
    if (typeof operands[0] === "number") {
      return operands[0];
    }

    return index < operands[0].length ? operands[0][index] : 0;
  }

  return 0;
}

function multiplyVectorsAtIndex(
  operands: readonly (AnyVec | number)[],
  index: number
): number {
  if (operands.length > 1) {
    return operands.reduce<number>((result: number, curr, i) => {
      if (i === 0) {
        if (typeof curr === "number") {
          return curr;
        }

        return index < curr.length ? curr[index] : 0;
      }

      if (typeof curr === "number") {
        return result * curr;
      }

      return index < curr.length ? result * curr[index] : 0;
    }, 0);
  }

  if (operands.length === 1) {
    if (typeof operands[0] === "number") {
      return operands[0];
    }

    return index < operands[0].length ? operands[0][index] : 0;
  }

  return 0;
}

function divideVectorsAtIndex(
  operands: readonly (AnyVec | number)[],
  index: number
): number {
  if (operands.length > 1) {
    return operands.reduce<number>((result: number, curr, i) => {
      if (i === 0) {
        if (typeof curr === "number") {
          return curr;
        }

        return index < curr.length ? curr[index] : 0;
      }

      if (typeof curr === "number") {
        return result / curr;
      }

      return index < curr.length ? result / curr[index] : 0;
    }, 0);
  }

  if (operands.length === 1) {
    if (typeof operands[0] === "number") {
      return operands[0];
    }

    return index < operands[0].length ? operands[0][index] : 0;
  }

  return 0;
}

export function add(...operands: readonly number[]): number;
export function add(...operands: readonly (Vec2 | number)[]): Vec2;
export function add(...operands: readonly (Vec3 | number)[]): Vec3;
export function add(...operands: readonly (Vec4 | number)[]): Vec4;
export function add(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  const sizeVec = operands.find((vector) => typeof vector !== "number");
  if (isScalarArray(operands)) {
    return addVectorsAtIndex(operands, 0);
  } else {
    const sizeVec = (operands.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          addVectorsAtIndex(operands, 0),
          addVectorsAtIndex(operands, 1)
        );

      case 3:
        return vec3(
          addVectorsAtIndex(operands, 0),
          addVectorsAtIndex(operands, 1),
          addVectorsAtIndex(operands, 2)
        );

      case 4:
        return vec4(
          addVectorsAtIndex(operands, 0),
          addVectorsAtIndex(operands, 1),
          addVectorsAtIndex(operands, 2),
          addVectorsAtIndex(operands, 3)
        );
    }
  }
}

export function subtract(...operands: readonly number[]): number;
export function subtract(...operands: readonly (Vec2 | number)[]): Vec2;
export function subtract(...operands: readonly (Vec3 | number)[]): Vec3;
export function subtract(...operands: readonly (Vec4 | number)[]): Vec4;
export function subtract(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  const sizeVec = operands.find((vector) => typeof vector !== "number");
  if (isScalarArray(operands)) {
    return subVectorsAtIndex(operands, 0);
  } else {
    const sizeVec = (operands.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          subVectorsAtIndex(operands, 0),
          subVectorsAtIndex(operands, 1)
        );

      case 3:
        return vec3(
          subVectorsAtIndex(operands, 0),
          subVectorsAtIndex(operands, 1),
          subVectorsAtIndex(operands, 2)
        );

      case 4:
        return vec4(
          subVectorsAtIndex(operands, 0),
          subVectorsAtIndex(operands, 1),
          subVectorsAtIndex(operands, 2),
          subVectorsAtIndex(operands, 3)
        );
    }
  }
}

export function multiply(...operands: readonly number[]): number;
export function multiply(...operands: readonly (Vec2 | number)[]): Vec2;
export function multiply(...operands: readonly (Vec3 | number)[]): Vec3;
export function multiply(...operands: readonly (Vec4 | number)[]): Vec4;
export function multiply(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  const sizeVec = operands.find((vector) => typeof vector !== "number");
  if (isScalarArray(operands)) {
    return multiplyVectorsAtIndex(operands, 0);
  } else {
    const sizeVec = (operands.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          multiplyVectorsAtIndex(operands, 0),
          multiplyVectorsAtIndex(operands, 1)
        );

      case 3:
        return vec3(
          multiplyVectorsAtIndex(operands, 0),
          multiplyVectorsAtIndex(operands, 1),
          multiplyVectorsAtIndex(operands, 2)
        );

      case 4:
        return vec4(
          multiplyVectorsAtIndex(operands, 0),
          multiplyVectorsAtIndex(operands, 1),
          multiplyVectorsAtIndex(operands, 2),
          multiplyVectorsAtIndex(operands, 3)
        );
    }
  }
}

export function divide(...operands: readonly number[]): number;
export function divide(...operands: readonly (Vec2 | number)[]): Vec2;
export function divide(...operands: readonly (Vec3 | number)[]): Vec3;
export function divide(...operands: readonly (Vec4 | number)[]): Vec4;
export function divide(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  const sizeVec = operands.find((vector) => typeof vector !== "number");
  if (isScalarArray(operands)) {
    return divideVectorsAtIndex(operands, 0);
  } else {
    const sizeVec = (operands.find(
      (vector) => typeof vector !== "number"
    ) as unknown) as AnyVec;
    const size = sizeVec.length;

    switch (size) {
      case 2:
        return vec2(
          divideVectorsAtIndex(operands, 0),
          divideVectorsAtIndex(operands, 1)
        );

      case 3:
        return vec3(
          divideVectorsAtIndex(operands, 0),
          divideVectorsAtIndex(operands, 1),
          divideVectorsAtIndex(operands, 2)
        );

      case 4:
        return vec4(
          divideVectorsAtIndex(operands, 0),
          divideVectorsAtIndex(operands, 1),
          divideVectorsAtIndex(operands, 2),
          divideVectorsAtIndex(operands, 3)
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

export function cubic(x: number): number;
export function cubic(x: Vec2): Vec2;
export function cubic(x: Vec3): Vec3;
export function cubic(x: Vec4): Vec4;
export function cubic(x: AnyVec | number): AnyVec | number {
  if (isVec2(x)) {
    return multiply(x, x, subtract(3, multiply(2, x)));
  }

  if (isVec3(x)) {
    return multiply(x, x, subtract(3, multiply(2, x)));
  }

  if (isVec4(x)) {
    return multiply(x, x, subtract(3, multiply(2, x)));
  }

  if (isScalar(x)) {
    return multiply(x, x, subtract(3, multiply(2, x)));
  }
}

export function quintic(x: number): number;
export function quintic(x: Vec2): Vec2;
export function quintic(x: Vec3): Vec3;
export function quintic(x: Vec4): Vec4;
export function quintic(x: AnyVec | number): AnyVec | number {
  if (isVec2(x)) {
    return multiply(
      x,
      x,
      x,
      add(multiply(x, subtract(multiply(x, 6), 15)), 10)
    );
  }

  if (isVec3(x)) {
    return multiply(
      x,
      x,
      x,
      add(multiply(x, subtract(multiply(x, 6), 15)), 10)
    );
  }

  if (isVec4(x)) {
    return multiply(
      x,
      x,
      x,
      add(multiply(x, subtract(multiply(x, 6), 15)), 10)
    );
  }

  if (isScalar(x)) {
    return multiply(
      x,
      x,
      x,
      add(multiply(x, subtract(multiply(x, 6), 15)), 10)
    );
  }
}
