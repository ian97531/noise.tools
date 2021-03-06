export enum Color {
  White = 255,
  Grey = 128,
  Gray = 128,
  Black = 0,
}

export enum Opacity {
  Opaque = 255,
  Transparent = 0,
}

export enum Offset {
  Red = 0,
  Green = 1,
  Blue = 2,
  Opacity = 3,
}

export const getIndexForRowColumn = (
  width: number,
  row: number,
  column: number
): number => {
  return row * width * 4 + column * 4;
};

export const getIndexForOffset = (offset: number): number => {
  return offset * 4;
};
