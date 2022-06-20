/* eslint-disable no-undef */

import { Scale } from './Scale';
import { viewSliderState } from '../../../../Types/state';
import { subViewEvent } from '../../../../Types/ViewEventTypes';
import { scaleEvent } from '../../../../Types/SubViewEvents/ScaleTypes';
import Mock = jest.Mock;

const defaultState: viewSliderState = {
  max: 100,
  min: -100,
  horizontal: true,
  isRange: true,
  invert: false,
  tips: false,
  handleSplit: true,
  from: {
    movingNow: false,
    percent: 25,
    pressedLast: false,
    pressedNow: false,
    px: 102.25,
    total: -500,
  },
  to: {
    movingNow: false,
    percent: 75,
    pressedLast: false,
    pressedNow: false,
    px: 306.75,
    total: 500,
  },
  scaleItemsArray: [-1000, -750, -500, -250, 0, 250, 500, 750, 1000],
  customClass: 'slider1',
  customId: 'UwU',
  tipsValueFunction: (value) => `${value}`,
};
let componentInstance: Scale;
let rootNode: HTMLElement;
const componentName: string = 'jqsScale';

describe('Initialization', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(Scale);
    expect(componentInstance.componentNode).toBeDefined();
  });
  test('Must not have any styles on initialization', () => {
    expect(componentInstance.componentNode.style.left).toBe('');
    expect(componentInstance.componentNode.style.right).toBe('');
    expect(componentInstance.componentNode.style.top).toBe('');
    expect(componentInstance.componentNode.style.bottom).toBe('');
    expect(componentInstance.componentNode.style.width).toBe('');
    expect(componentInstance.componentNode.style.height).toBe('');
  });
});
describe('Mount / Unmount', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
  });
  test('Must unmount if get empty array of scale items', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    componentInstance.update({ ...defaultState, scaleItemsArray: [] });
    expect(componentInstance.isMounted).toBe(false);
    expect(rootNode.getElementsByClassName('jqsScale').length).toBe(0);
  });
  test('Must not unmount if already unmounted', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [] });
    componentInstance.update({ ...defaultState, scaleItemsArray: [] });
    expect(componentInstance.isMounted).toBe(false);
    expect(componentInstance.sliderNode.getElementsByClassName('jqsScale').length).toBe(0);
  });
  test('Must mount if received filled array of scale items', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    expect(componentInstance.isMounted).toBe(true);
    expect(rootNode.getElementsByClassName('jqsScale').length).toBe(1);
  });
  test('Must not be mounted if already mounted', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    expect(componentInstance.isMounted).toBe(true);
    expect(componentInstance.sliderNode.getElementsByClassName('jqsScale').length).toBe(1);
  });
});
describe('Orientation align (horizontal / vertical)', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
  });
  test('Must get class "--horizontal" on getting {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(true);
  });
  test('Must not have class "--vertical" when getting {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(false);
  });
  test('Must get class "--vertical" on getting {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(true);
  });
  test('Must not have class "--horizontal" when getting {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(false);
  });
});
describe('Invert', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
  });
  const getScaleItemValue = (element: HTMLElement): number => {
    let result: number = 0;
    const numElement = element.getElementsByClassName('jqsScale__num')[0];
    if (numElement) {
      const value = numElement.textContent;
      result = Number(value);
    }
    return result;
  };
  test('Numbers must go from smallest to largest when {invert: false}', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100], invert: false });
    expect(getScaleItemValue(componentInstance.scaleElementsArray[0])).toBe(-100);
    expect(getScaleItemValue(componentInstance.scaleElementsArray[1])).toBe(0);
    expect(getScaleItemValue(componentInstance.scaleElementsArray[2])).toBe(100);
  });
  test('Numbers must go from largest to smallest when {invert: true}', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100], invert: true });
    expect(getScaleItemValue(componentInstance.scaleElementsArray[0])).toBe(100);
    expect(getScaleItemValue(componentInstance.scaleElementsArray[1])).toBe(0);
    expect(getScaleItemValue(componentInstance.scaleElementsArray[2])).toBe(-100);
  });
});
describe('Callback and listeners', () => {
  let testCallback: (event: subViewEvent) => subViewEvent;
  let testCallbackWithMock: Mock<subViewEvent, [event: subViewEvent]>;
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
    testCallback = (event: subViewEvent) => event;
  });
  test('Must correctly receive a callback', () => {
    componentInstance.setCallback(testCallback);
    expect(componentInstance.callback).toBeDefined();
    expect(typeof componentInstance.callback).toBe('function');
  });
  test('Must correctly send event to callback', () => {
    const testViewAction: scaleEvent = {
      target: 'scale',
      type: '',
      action: 'click',
      value: {
        x: 0,
        y: 0,
        total: false,
      },
    };
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.sendAction(testViewAction);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(testViewAction);
    expect(testCallbackWithMock).toBeCalled();
    expect(testCallbackWithMock).toBeCalledTimes(1);
  });
  test('Should correctly handle a click on the scale element', () => {
    const resultViewAction: scaleEvent = {
      target: 'scale',
      type: '',
      action: 'click',
      value: {
        total: false,
      },
    };
    const pointerdownCustomEvent = new PointerEvent('pointerdown', { bubbles: true });
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.scaleElementsArray.forEach((el) => {
      el.getElementsByClassName('jqsScale__num')[0].dispatchEvent(pointerdownCustomEvent);
    });
    expect(testCallbackWithMock).toBeCalledTimes(3);
    expect(testCallbackWithMock.mock.results[0].value)
      .toEqual({ ...resultViewAction, value: { ...resultViewAction.value, total: -100 } });
    expect(testCallbackWithMock.mock.results[1].value)
      .toEqual({ ...resultViewAction, value: { ...resultViewAction.value, total: 0 } });
    expect(testCallbackWithMock.mock.results[2].value)
      .toEqual({ ...resultViewAction, value: { ...resultViewAction.value, total: 100 } });
  });
  test('Callback should not work when clicking on out scale elements', () => {
    const pointerdownCustomEvent = new PointerEvent('pointerdown', { bubbles: true });
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);

    componentInstance.componentNode.dispatchEvent(pointerdownCustomEvent);
    expect(testCallbackWithMock).not.toBeCalled();

    componentInstance.scaleElementsArray.forEach((el) => {
      el.dispatchEvent(pointerdownCustomEvent);
    });
    expect(testCallbackWithMock).not.toBeCalled();
  });
});
describe('Scale items', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Scale(newElement);
  });
  test('Must create a valid html structure of the scale division unit', () => {
    const scaleItem = componentInstance.createScaleItem(0, 0, 'top');
    expect(scaleItem.classList.contains('jqsScale__item')).toBe(true);
    expect(scaleItem.getElementsByClassName('jqsScale__num').length).toBe(1);
    expect(scaleItem.style.top).toBeDefined();
  });
  test('Must set the correct position of the scale unit', () => {
    const scaleItem = componentInstance.createScaleItem(0, 30, 'top');
    expect(scaleItem.style.top).toBe('30%');
  });
  test('Should give the correct text to the scale unit', () => {
    const scaleItem = componentInstance.createScaleItem(1000, 50, 'top');
    expect(scaleItem.textContent).toBe('1000');
  });
  test('Should correctly remove all scale items', () => {
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    componentInstance.removeAllScaleItems();
    expect(componentInstance.scaleElementsArray.length).toBe(0);
    expect(componentInstance.componentNode.getElementsByClassName('jqsScale__item').length)
      .toBe(0);
  });
  test('Must not redraw if identical array of scale numbers received', () => {
    let scaleItemsArray1: HTMLElement[] = [];
    let scaleItemsArray2: HTMLElement[] = [];
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    scaleItemsArray1 = componentInstance.scaleElementsArray;
    componentInstance.update({ ...defaultState, scaleItemsArray: [-100, 0, 100] });
    scaleItemsArray2 = componentInstance.scaleElementsArray;
    expect(scaleItemsArray1).toEqual(scaleItemsArray2);
  });
});
