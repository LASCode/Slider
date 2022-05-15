import {
  checkStepProps,
  getFixedValueWithStepProps,
  getNumAfterCommaProps, getScaleItemsArrayProps, invertValueProps,
  percentToValueProps,
  pixelToPercentProps,
  pixelToValueProps, toFixedProps,
  valueToPercentProps,
  valueToPixelProps
} from '../Types/props';

const valueToPercent = (props: valueToPercentProps): number => {
  const { value, max, min } = props;
  return (100 / (max - min)) * (value - min);
};
const valueToPixel = (props: valueToPixelProps): number => {
  const { size, max, min, value } = props;
  return (size / 100) * ((100 / (max - min)) * (value - min));
};
const pixelToPercent = (props: pixelToPercentProps): number => {
  const { size, value } = props;
  return (100 / size) * value;
};
const pixelToValue = (props: pixelToValueProps): number => {
  const { value, size, max, min } = props;
  const percent = pixelToPercent({
    value: value,
    size: size,
  })
  return percentToValue({
    value: percent,
    max: max,
    min: min,
  });
};
const percentToValue = (props: percentToValueProps): number => {
  const { value, max, min, } = props;
  return (((max - min) / 100) * value) + min;
};
const toFixed = (props: toFixedProps): number => {
  const { value, fixed } = props;
  let result: number = value;
  const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  const a = value.toString().match(re);
  if (a !== null) {
    result = Number(a[0]);
  }
  return result;
  // return Number(value.toFixed(fixed));
};
const getNumAfterComma = (props: getNumAfterCommaProps): number => {
  const { value } = props;
  if (Math.floor(value) !== value) {
    return value.toString().split('.')[1].length || 0;
  }
  return 0;
};
const getFixedValueWithStep = (props: getFixedValueWithStepProps): number => {
  const { value, step } = props;
  const numberCount = getNumAfterComma({
    value: step
  })
  return toFixed({
    value: value,
    fixed: numberCount,
  });
};
const getScaleItemsArray = (props: getScaleItemsArrayProps): number[] => {
  const { max, min, step } = props;
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
  return result.map((el) => getFixedValueWithStep({
    value: el,
    step: step,
  }));
};
const invertValue = (props: invertValueProps): number => {
  const { max, min, value } = props;
  return max - value + min;
};
const checkStep = (props: checkStepProps) => {
  const { value, step } = props;
  const stepCopy = (step <= 0 ? 1 : step);
  return ((Math.round(value / stepCopy) * 100) / 100) * stepCopy;
};


export {
  valueToPercent,
  valueToPixel,
  pixelToValue,
  percentToValue,
  getScaleItemsArray,
  pixelToPercent,
  invertValue,
  getFixedValueWithStep,
  getNumAfterComma,
  checkStep,
  toFixed,
};
