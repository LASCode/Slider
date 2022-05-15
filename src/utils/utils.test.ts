/* eslint-disable no-undef */
import {
  checkStep,
  getFixedValueWithStep,
  getNumAfterComma,
  getScaleItemsArray, invertValue,
  percentToValue,
  pixelToPercent,
  pixelToValue, toFixed,
  valueToPercent,
  valueToPixel,
} from './utils';

describe('Test valueToPixel', () => {
  test('Should work correctly with negative MIN', () => {
    expect(valueToPixel({
      max: 1000,
      min: -200,
      size: 1000,
      value: -50,
    })).toBe(125);
  });
  test('Should work correctly with a positive MIN', () => {
    expect(valueToPixel({
      max: 1000,
      min: 500,
      size: 1000,
      value: 750,
    })).toBe(500);
  });
  test('Should work correctly with zero MIN', () => {
    expect(valueToPixel({
      max: 300,
      min: 0,
      size: 1000,
      value: 150,
    })).toBe(500);
  });
});
describe('Test valueToPercent', () => {
  test('Should work correctly with negative MIN', () => {
    expect(valueToPercent({
      max: 1000,
      min: -200,
      value: 100,
    })).toBe(25);
  });
  test('Should work correctly with a positive MIN', () => {
    expect(valueToPercent({
      max: 1000,
      min: 500,
      value: 750,
    })).toBe(50);
  });
  test('Should work correctly with zero MIN', () => {
    expect(valueToPercent({
      max: 500,
      min: 0,
      value: 200,
    })).toBe(40);
  });
});
describe('Test pixelToPercent', () => {
  test('Should work correctly with negative VALUE', () => {
    expect(pixelToPercent({
      size: 1000,
      value: -100,
    })).toBe(-10);
  });
  test('Should work correctly with a positive VALUE', () => {
    expect(pixelToPercent({
      size: 1000,
      value: 350,
    })).toBe(35);
  });
  test('Should work correctly with zero VALUE', () => {
    expect(pixelToPercent({
      size: 1000,
      value: 0,
    })).toBe(0);
  });
});
describe('Test pixelToValue', () => {
  test('Should work correctly with negative MIN', () => {
    expect(pixelToValue({
      max: 1000,
      min: -500,
      size: 1000,
      value: 50,
    })).toBe(-425);
  });
  test('Should work correctly with a positive MIN', () => {
    expect(pixelToValue({
      max: 1000,
      min: 500,
      size: 1000,
      value: 50,
    })).toBe(525);
  });
  test('Should work correctly with zero MIN', () => {
    expect(pixelToValue({
      max: 1000,
      min: 0,
      size: 1000,
      value: 350,
    })).toBe(350);
  });
});
describe('Test percentToValue', () => {
  test('Should work correctly with negative MIN', () => {
    expect(percentToValue({
      max: 1000,
      min: -500,
      value: 50,
    })).toBe(250);
  });
  test('Should work correctly with a positive MIN', () => {
    expect(percentToValue({
      max: 1000,
      min: 500,
      value: 50,
    })).toBe(750);
  });
  test('Should work correctly with zero MIN', () => {
    expect(percentToValue({
      max: 1000,
      min: 0,
      value: 25,
    })).toBe(250);
  });
});
describe('Test toFixed', () => {
  test('Should correctly truncate the number when it is negative', () => {
    expect(toFixed({
      value: -15.55484821312539,
      fixed: 5,
    })).toBe(-15.55484);
  });
  test('Should correctly truncate the number when it is positive', () => {
    expect(toFixed({
      value: 1.2345678,
      fixed: 5,
    })).toBe(1.23456);
  });
  test('Should correctly truncate the number when it is zero', () => {
    expect(toFixed({
      value: 1.2345678,
      fixed: 0,
    })).toBe(1);
  });
});
describe('Test getNumAfterComma', () => {
  test('Should correctly truncate the number when it is negative', () => {
    expect(getNumAfterComma({
      value: -15.123456789,
    })).toBe(9);
  });
  test('Should correctly truncate the number when it is positive', () => {
    expect(getNumAfterComma({
      value: 1.12345,
    })).toBe(5);
  });
  test('Should correctly truncate the number when it is zero', () => {
    expect(getNumAfterComma({
      value: 0,
    })).toBe(0);
  });
});
describe('Test getFixedValueWithStep', () => {
  test('Should correctly truncate the value when step is 0.00001', () => {
    expect(getFixedValueWithStep({
      value: -15.123456789,
      step: 0.00001,
    })).toBe(-15.12345);
  });
  test('Should correctly truncate the value when step is 1+', () => {
    expect(getFixedValueWithStep({
      value: 755.2421251,
      step: 1,
    })).toBe(755);
  });
});
describe('Test scaleItemsArray', () => {
  test('1', () => {
    const result = [-1000, -500, 0, 500, 1000];
    expect(getScaleItemsArray({
      max: 1000,
      min: -1000,
      step: 500,
    })).toEqual(result);
  });
  test('2', () => {
    const result = [-500, -250, 0, 250, 500, 750, 1000];
    expect(getScaleItemsArray({
      max: 1000,
      min: -500,
      step: 250,
    })).toEqual(result);
  });
  test('3', () => {
    const result = [0, 10, 20, 30, 40, 50, 55];
    expect(getScaleItemsArray({
      max: 55,
      min: 0,
      step: 10,
    })).toEqual(result);
  });
});
describe('Test invertValue', () => {
  test('Should work correctly with negative VALUE', () => {
    expect(invertValue({
      max: 1000,
      min: -1000,
      value: -500,
    })).toBe(500);
  });
  test('Should work correctly with a positive VALUE', () => {
    expect(invertValue({
      max: 1000,
      min: 500,
      value: 600,
    })).toBe(900);
  });
  test('Should work correctly with zero VALUE', () => {
    expect(invertValue({
      max: 1000,
      min: 0,
      value: 0,
    })).toBe(1000);
  });
});
describe('Test checkStep', () => {
  test('Should work correctly with negative VALUE', () => {
    expect(checkStep({
      value: -150,
      step: 200,
    })).toBe(-200);
  });
  test('Should work correctly with a positive VALUE', () => {
    expect(checkStep({
      value: 15,
      step: 30,
    })).toBe(30);
  });
  test('Should work correctly with zero VALUE', () => {
    expect(checkStep({
      value: 0,
      step: 100,
    })).toBe(0);
  });
});
