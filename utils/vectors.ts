// An enum that can be used to provide indices into vectors to extract
// x, y, z, or w coordinates.
export enum Pos {
  x = 0,
  y = 1,
  z = 2,
  w = 3,
}

// An enum that can be used to provide indices into vectors to extract
// red, green, blue, or alpha values.
export enum Color {
  r = 0,
  g = 1,
  b = 2,
  a = 3,
}

// Vector Types
export type Vec2 = readonly [x: number, y: number];
export type Vec3 = readonly [x: number, y: number, z: number];
export type Vec4 = readonly [x: number, y: number, z: number, w: number];
export type AnyVec = Vec2 | Vec3 | Vec4;

// A function signature for a basic math operation that takes one or two number
// operands and returns a result.
type OperatorFunction = (op1: number, op2?: number) => number;

// A function signature for a math function that can operate on a mixed array of
// a single vector type and scalars. The function must always return the same
// vector type as provided in the array of operands, or a scalar if only scalars
// are provided in the array of operands.
export type MathFunction =
  | ((...operands: number[]) => number)
  | ((...operands: (Vec2 | number)[]) => Vec2)
  | ((...operands: (Vec3 | number)[]) => Vec2)
  | ((...operands: (Vec4 | number)[]) => Vec4);

// A function signature for an interpolation function, such as cubic or quintic,
// that will take a number or vector and return the interpolated value. If a vector
// is provided, that same vector type will be returned. If a scalar is provided, a
// scalar value will be returned.
export type InterpolationFunction =
  | ((x: number) => number)
  | ((x: Vec2) => Vec2)
  | ((x: Vec3) => Vec3)
  | ((x: Vec4) => Vec4);

// Functions for creating vectors.
export const vec2 = (n1: number, n2: number = n1): Vec2 => {
  return [n1, n2];
};

export function vec3(n1: number, n2: number = n1, n3: number = n1): Vec3 {
  return [n1, n2, n3];
}

export function vec4(
  n1: number,
  n2: number = n1,
  n3: number = n1,
  n4: number = 1
): Vec4 {
  return [n1, n2, n3, n4];
}

// Unit vectors of various sizes for convenience.
export const unit2 = vec2(1);
export const unit3 = vec3(1);
export const unit4 = vec4(1);

// Type guards for vectors, scalars, and arrays of vectors and scalars.
export function isScalarArray(
  values: readonly (AnyVec | number)[]
): values is number[] {
  return !values.find((vector) => typeof vector !== "number");
}

export function isVec2(value: AnyVec | number): value is Vec2 {
  return typeof value !== "number" && value.length === 2;
}

export function isVec2orScalarArray(
  values: readonly (AnyVec | number)[]
): values is (Vec2 | number)[] {
  return values.every(
    (value) => typeof value === "number" || value.length === 2
  );
}

export function isVec3(value: AnyVec | number): value is Vec3 {
  return typeof value !== "number" && value.length === 3;
}

export function isVec3orScalarArray(
  values: readonly (AnyVec | number)[]
): values is (Vec3 | number)[] {
  return values.every(
    (value) => typeof value === "number" || value.length === 3
  );
}

export function isVec4(value: AnyVec | number): value is Vec4 {
  return typeof value !== "number" && value.length === 4;
}

export function isVec4orScalarArray(
  values: readonly (AnyVec | number)[]
): values is (Vec4 | number)[] {
  return values.every(
    (value) => typeof value === "number" || value.length === 4
  );
}

export function isScalar(value: AnyVec | number): value is number {
  return typeof value === "number";
}

//A function that will take an operator function, an array of operands that can be a mixed array
// of any one vector type and scalar values, and index. It will reduce the array of operands using
// the operator function and return the result. If only a single operand is provided, it will be
// passed to the operator function and the result will be returned. If an empty array of operands are
// provided, the value 0 will be returned. If vectors of differing sizes are included in the array
// of operands, an error will be thrown.
function vecMathAtIndex(
  operatorFn: OperatorFunction,
  operands: readonly (AnyVec | number)[],
  index: number
): number {
  if (operands.length > 1) {
    return operands.reduce<number>((result: number, curr, i) => {
      if (i === 0) {
        if (typeof curr === "number") {
          return curr;
        }

        if (index >= curr.length) {
          throw new Error(
            `Error attempting to get element ${index} of a Vec${curr.length}`
          );
        }

        return curr[index];
      }

      if (typeof curr === "number") {
        return operatorFn(result, curr);
      }

      return index < curr.length ? operatorFn(result, curr[index]) : result;
    }, 0);
  }

  if (operands.length === 1) {
    if (typeof operands[0] === "number") {
      return operatorFn(operands[0]);
    }

    if (index >= operands[0].length) {
      throw new Error(
        `Error attempting to get element ${index} of a Vec${operands[0].length}`
      );
    }

    return operatorFn(operands[0][index]);
  }

  return 0;
}

// Functions that will perform the provided operator function an array of Vec2s, Vec3s, or
// Vec4s, and return the correspondingly typed result.
const vec2Math = (
  operatorFn: OperatorFunction,
  operands: readonly (Vec2 | number)[]
): Vec2 => {
  return vec2(
    vecMathAtIndex(operatorFn, operands, 0),
    vecMathAtIndex(operatorFn, operands, 1)
  );
};

const vec3Math = (
  operatorFn: OperatorFunction,
  operands: readonly (Vec3 | number)[]
): Vec3 => {
  return vec3(
    vecMathAtIndex(operatorFn, operands, 0),
    vecMathAtIndex(operatorFn, operands, 1),
    vecMathAtIndex(operatorFn, operands, 2)
  );
};

const vec4Math = (
  operatorFn: OperatorFunction,
  operands: readonly (Vec4 | number)[]
): Vec4 => {
  return vec4(
    vecMathAtIndex(operatorFn, operands, 0),
    vecMathAtIndex(operatorFn, operands, 1),
    vecMathAtIndex(operatorFn, operands, 2),
    vecMathAtIndex(operatorFn, operands, 3)
  );
};

// Operator functions that can be used with the above vec2Math, vec3Math, vec4Math, and
// vecMathAtIndex functions.
const addOp: OperatorFunction = (op1, op2 = 0) => op1 + op2;
const subtractOp: OperatorFunction = (op1, op2 = 0) => op1 - op2;
const multiplyOp: OperatorFunction = (op1, op2 = 1) => op1 * op2;
const divideOp: OperatorFunction = (op1, op2 = 1) => op1 / op2;
const sinOp: OperatorFunction = (op1) => Math.sin(op1);
const cosOp: OperatorFunction = (op1) => Math.cos(op1);
const floorOp: OperatorFunction = (op1) => Math.floor(op1);
const fractionOp: OperatorFunction = (op1) => op1 - Math.floor(op1);
const cubicOp: OperatorFunction = (op1) => op1 * op1 * (3 - 2 * op1);
const quinticOp: OperatorFunction = (op1) =>
  op1 * op1 * op1 * (op1 * (op1 * 6 - 15) + 10);

// The remaining functions provide common math operations that will work on a mixed
// array of a single vector type and scalar values and return a result in the vector
// type matching the input.
export function add(...operands: readonly number[]): number;
export function add(...operands: readonly (Vec2 | number)[]): Vec2;
export function add(...operands: readonly (Vec3 | number)[]): Vec3;
export function add(...operands: readonly (Vec4 | number)[]): Vec4;
export function add(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  if (isScalarArray(operands)) {
    return vecMathAtIndex(addOp, operands, 0);
  }

  if (isVec2orScalarArray(operands)) {
    return vec2Math(addOp, operands);
  }

  if (isVec3orScalarArray(operands)) {
    return vec3Math(addOp, operands);
  }

  if (isVec4orScalarArray(operands)) {
    return vec4Math(addOp, operands);
  }

  throw new Error("Invalid or inconsistent vector sizes provided.");
}

export function subtract(...operands: readonly number[]): number;
export function subtract(...operands: readonly (Vec2 | number)[]): Vec2;
export function subtract(...operands: readonly (Vec3 | number)[]): Vec3;
export function subtract(...operands: readonly (Vec4 | number)[]): Vec4;
export function subtract(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  if (isScalarArray(operands)) {
    return vecMathAtIndex(subtractOp, operands, 0);
  }

  if (isVec2orScalarArray(operands)) {
    return vec2Math(subtractOp, operands);
  }

  if (isVec3orScalarArray(operands)) {
    return vec3Math(subtractOp, operands);
  }

  if (isVec4orScalarArray(operands)) {
    return vec4Math(subtractOp, operands);
  }

  throw new Error("Invalid or inconsistent vector sizes provided.");
}

export function multiply(...operands: readonly number[]): number;
export function multiply(...operands: readonly (Vec2 | number)[]): Vec2;
export function multiply(...operands: readonly (Vec3 | number)[]): Vec3;
export function multiply(...operands: readonly (Vec4 | number)[]): Vec4;
export function multiply(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  if (isScalarArray(operands)) {
    return vecMathAtIndex(multiplyOp, operands, 0);
  }

  if (isVec2orScalarArray(operands)) {
    return vec2Math(multiplyOp, operands);
  }

  if (isVec3orScalarArray(operands)) {
    return vec3Math(multiplyOp, operands);
  }

  if (isVec4orScalarArray(operands)) {
    return vec4Math(multiplyOp, operands);
  }

  throw new Error("Invalid or inconsistent vector sizes provided.");
}

export function divide(...operands: readonly number[]): number;
export function divide(...operands: readonly (Vec2 | number)[]): Vec2;
export function divide(...operands: readonly (Vec3 | number)[]): Vec3;
export function divide(...operands: readonly (Vec4 | number)[]): Vec4;
export function divide(
  ...operands: readonly (AnyVec | number)[]
): AnyVec | number {
  if (isScalarArray(operands)) {
    return vecMathAtIndex(divideOp, operands, 0);
  }

  if (isVec2orScalarArray(operands)) {
    return vec2Math(divideOp, operands);
  }

  if (isVec3orScalarArray(operands)) {
    return vec3Math(divideOp, operands);
  }

  if (isVec4orScalarArray(operands)) {
    return vec4Math(divideOp, operands);
  }

  throw new Error("Invalid or inconsistent vector sizes provided.");
}

export function sin(operand: number): number;
export function sin(operand: Vec2 | number): Vec2;
export function sin(operand: Vec3 | number): Vec3;
export function sin(operand: Vec4 | number): Vec4;
export function sin(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(sinOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(sinOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(sinOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(sinOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
}

export function cos(operand: number): number;
export function cos(operand: Vec2 | number): Vec2;
export function cos(operand: Vec3 | number): Vec3;
export function cos(operand: Vec4 | number): Vec4;
export function cos(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(cosOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(cosOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(cosOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(cosOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
}

export function floor(operand: number): number;
export function floor(operand: Vec2): Vec2;
export function floor(operand: Vec3): Vec3;
export function floor(operand: Vec4): Vec4;
export function floor(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(floorOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(floorOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(floorOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(floorOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
}

export function fraction(operand: number): number;
export function fraction(operand: Vec2): Vec2;
export function fraction(operand: Vec3): Vec3;
export function fraction(operand: Vec4): Vec4;
export function fraction(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(fractionOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(fractionOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(fractionOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(fractionOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
}

export function cubic(operand: number): number;
export function cubic(operand: Vec2): Vec2;
export function cubic(operand: Vec3): Vec3;
export function cubic(operand: Vec4): Vec4;
export function cubic(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(cubicOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(cubicOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(cubicOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(cubicOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
}

export function quintic(operand: number): number;
export function quintic(operand: Vec2): Vec2;
export function quintic(operand: Vec3): Vec3;
export function quintic(operand: Vec4): Vec4;
export function quintic(operand: AnyVec | number): AnyVec | number {
  if (isScalar(operand)) {
    return vecMathAtIndex(quinticOp, [operand], 0);
  }

  if (isVec2(operand)) {
    return vec2Math(quinticOp, [operand]);
  }

  if (isVec3(operand)) {
    return vec3Math(quinticOp, [operand]);
  }

  if (isVec4(operand)) {
    return vec4Math(quinticOp, [operand]);
  }

  throw new Error("Invalid vector size provided.");
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

export function crossProduct(v1: Vec3, v2: Vec3): Vec3 {
  return vec3(
    v1[Pos.y] * v2[Pos.z] - v1[Pos.z] * v2[Pos.y],
    v1[Pos.z] * v2[Pos.x] - v1[Pos.x] * v2[Pos.z],
    v1[Pos.x] * v2[Pos.y] - v1[Pos.y] * v2[Pos.x]
  );
}
