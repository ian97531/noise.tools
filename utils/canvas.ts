export enum Color {
  White = 255,
  Black = 1,
}

export enum Opacity {
  Opaque = 255,
  Transparent = 1,
}

const getIndexForRowColumn = (
  width: number,
  row: number,
  column: number
): number => {
  return row * width * 4 + column * 4;
};

const getIndexForOffset = (offset: number): number => {
  return offset * 4;
};

export const getOffset = (data: Uint8ClampedArray, offset: number) => {
  return data[getIndexForOffset(offset)];
};

export const getRowColumn = (
  data: Uint8ClampedArray,
  width: number,
  row: number,
  column: number
) => {
  return data[getIndexForRowColumn(width, row, column)];
};

export const setRowColumn = (
  data: Uint8ClampedArray,
  width: number,
  row: number,
  column: number,
  color: number = Color.Black,
  opacity: number = Opacity.Opaque
) => {
  const index = getIndexForRowColumn(width, row, column);
  data[index] = color;
  data[index + 1] = color;
  data[index + 2] = color;
  data[index + 3] = opacity;
};

export const addRowColumn = (
  data: Uint8ClampedArray,
  width: number,
  row: number,
  column: number,
  color: number = Color.Black,
  opacity: number = Opacity.Transparent
) => {
  const index = getIndexForRowColumn(width, row, column);
  data[index] = Math.max(Color.Black, data[index] + color);
  data[index + 1] = Math.max(Color.Black, data[index + 1] + color);
  data[index + 2] = Math.max(Color.Black, data[index + 2] + color);
  data[index + 3] = Math.max(Opacity.Transparent, data[index + 3] + opacity);
};

export const setOffset = (
  data: Uint8ClampedArray,
  offset: number,
  color: number = Color.Black,
  opacity: number = Opacity.Opaque
) => {
  const index = getIndexForOffset(offset);
  data[index] = color;
  data[index + 1] = color;
  data[index + 2] = color;
  data[index + 3] = opacity;
};

export const setAll = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  color: number = Color.Black,
  opacity: number = Opacity.Opaque
) => {
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      setRowColumn(data, width, row, column, color, opacity);
    }
  }
};

export const addArray = (
  target: Uint8ClampedArray,
  source: Uint8ClampedArray,
  shift: number = 0
) => {
  for (let index = 0; index < target.length; index++) {
    target[index] = target[index] + (source[index] + shift);
  }
};

export const printArray = (
  data: Uint8ClampedArray,
  width: number,
  height: number
) => {
  for (let row = 0; row < height; row++) {
    console.log(
      data
        .slice(
          getIndexForRowColumn(width, row, 0),
          getIndexForRowColumn(width, row + 1, 0)
        )
        .reduce((curr, el, index) => {
          if (index % 4 === 0) {
            return [...curr, el];
          } else {
            return curr;
          }
        }, [])
    );
  }
};

export const getNeighbors = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  row: number,
  column: number
): ReadonlyArray<{
  row: number;
  column: number;
  value: number;
}> => {
  const neighbors: Array<{
    row: number;
    column: number;
    value: number;
  }> = [];

  if (column < width - 1) {
    neighbors.push({
      row: row,
      column: column + 1,
      value: getRowColumn(data, width, row, column + 1),
    });
  }

  if (row < height - 1) {
    neighbors.push({
      row: row + 1,
      column,
      value: getRowColumn(data, width, row + 1, column),
    });

    if (column > 0) {
      neighbors.push({
        row: row + 1,
        column: column - 1,
        value: getRowColumn(data, width, row + 1, column - 1),
      });
    }

    if (column < width - 1) {
      neighbors.push({
        row: row + 1,
        column: column + 1,
        value: getRowColumn(data, width, row + 1, column + 1),
      });
    }
  }

  return neighbors;
};
