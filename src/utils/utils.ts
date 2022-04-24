
const valueToPercent = (value: number, max: number, min: number): number => {
  return (100 / (max - min)) * (value - min);
};
const valueToPixel = (value: number, size: number, max: number, min: number): number => {
  return (size / 100) * ((100 / (max - min)) * (value - min));
};
const percentToValue = (value: number, max: number, min: number): number => {
  return (((max - min) / 100) * value) + min;
};
const pixelToPercent = (value: number, size: number): number => {
  return (100 / size) * value;
};
const pixelToValue = (value: number, width: number, max: number, min: number): number => {
  return percentToValue(pixelToPercent(value, width), max, min);
};
const toFixed2 = (value: number): number => {
  return Number(value.toFixed(2));
};
const getScaleItemsArray = (max: number, min: number, step: number): number[] => {
  const result: number[] = [];
  if (step > 0 && max !== min) {
    if (min < 0) result.push(min);
    for (let i = (min < 0 ? 0 : min); i < max; i = i + step) {
      result.push(i);
    }
    for (let i = 0 - step; i > min; i = i - step) {
      result.unshift(i);
    }
    result.push(max);
  }
  return result;
};
const invertValue = (max: number, value: number): number => {
  return max - value;
};


export { valueToPercent, valueToPixel, pixelToValue, toFixed2, getScaleItemsArray, pixelToPercent, invertValue };
