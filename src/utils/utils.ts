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
const toFixed = (value: number, fixed: number): number => {
  return Number(value.toFixed(fixed));
};
const getNumAfterComma = (value: number): number => {
  if (Math.floor(value) !== value) {
    return value.toString().split('.')[1].length || 0;
  }
  return 0;
};
const getFixedValueWithStep = (value: number, step: number): number => {
  return toFixed(value, getNumAfterComma(step));
};
const getScaleItemsArray = (max: number, min: number, step: number): number[] => {
  const result: number[] = [];
  if (step > 0 && max !== min) {
    for (let i = (min < 0 ? 0 : min); i < max; i = i + step) {
      result.push(i);
    }
    for (let i = 0 - step; i > min; i = i - step) {
      result.unshift(i);
    }
    result.push(max);
  }
  if (min < 0) result.unshift(min);
  return result.map((el) => getFixedValueWithStep(el, step));;
};
const invertValue = (max: number, min: number, value: number): number => {
  return max - value + min;
};
const checkStep = (value: number, step: number) => {
  const stepCopy = (step <= 0 ? 1 : step);
  return ((Math.round(value / stepCopy) * 100) / 100) * stepCopy;
};


export {
  valueToPercent,
  valueToPixel,
  pixelToValue,
  getScaleItemsArray,
  pixelToPercent,
  invertValue,
  getFixedValueWithStep,
  getNumAfterComma,
  checkStep,
};
