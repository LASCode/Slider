/* eslint-disable no-undef */

import { TipFrom } from './TipFrom';
import { viewSliderState } from '../../../../Types/state';
import { subViewEvent } from '../../../../Types/ViewEventTypes';
import { tipEvent } from '../../../../Types/SubViewEvents/TipTypes';
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
let componentInstance: TipFrom;
let rootNode: HTMLElement;
const componentName: string = 'jqsTips';

describe('Initialization', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new TipFrom(newElement);
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(TipFrom);
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
    componentInstance = new TipFrom(newElement);
  });
  test('Can be mount', () => {
    componentInstance.destroyComponent();
    componentInstance.createComponent();
    expect(componentInstance.isMounted).toBe(true);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(1);
  });
  test('Can be unmount', () => {
    componentInstance.destroyComponent();
    expect(componentInstance.isMounted).toBe(false);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(0);
  });
  test('Must mount if received {tips: true}', () => {
    componentInstance.update({ ...defaultState, tips: false });
    componentInstance.update({ ...defaultState, tips: true });
    expect(componentInstance.isMounted).toBe(true);
    expect(rootNode.getElementsByClassName(`${componentName}`).length).toBe(1);
  });
  test('Must unmount if received {tips: false}', () => {
    componentInstance.update({ ...defaultState, tips: true });
    componentInstance.update({ ...defaultState, tips: false });
    expect(componentInstance.isMounted).toBe(false);
    expect(rootNode.getElementsByClassName(`${componentName}`).length).toBe(0);
  });
  test('Must not unmount if already unmounted', () => {
    componentInstance.update({ ...defaultState, tips: false });
    componentInstance.update({ ...defaultState, tips: false });
    expect(componentInstance.isMounted).toBe(false);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(0);
  });
  test('Must not be mounted if already mounted', () => {
    componentInstance.update({ ...defaultState, tips: true });
    componentInstance.update({ ...defaultState, tips: true });
    expect(componentInstance.isMounted).toBe(true);
    expect(componentInstance.sliderNode.getElementsByClassName(`${componentName}`).length).toBe(1);
  });
});
describe('Orientation align (horizontal / vertical)', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new TipFrom(newElement);
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
  test('Must have "left" and no "top" styles when {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    expect(componentInstance.componentNode.style.top).toBe('');
    expect(componentInstance.componentNode.style.left).not.toBe('');
  });
  test('Must not change the class "--horizontal" if it has already been assigned', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    componentInstance.update({ ...defaultState, horizontal: true });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--horizontal`)).toBe(true);
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
  test('Must have "left" and no "top" styles when {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    expect(componentInstance.componentNode.style.left).toBe('');
    expect(componentInstance.componentNode.style.top).not.toBe('');
  });
  test('Must not change the class "--vertical" if it has already been assigned', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    componentInstance.update({ ...defaultState, horizontal: false });
    const componentClassList = componentInstance.componentNode.classList;
    expect(componentClassList.contains(`${componentName}--vertical`)).toBe(true);
  });
});
describe('Invert', () => {
  let stateCopy: viewSliderState;
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new TipFrom(newElement);
    stateCopy = { ...defaultState, to: { ...defaultState.to, percent: 25 }, horizontal: false };
  });
  test('Must have correct position when {invert: false}', () => {
    componentInstance.update({ ...stateCopy, invert: false });
    expect(componentInstance.componentNode.style.top).toBe('25%');
  });
  test('Must have correct position when {invert: true}', () => {
    componentInstance.update({ ...stateCopy, invert: true });
    expect(componentInstance.componentNode.style.top).toBe('75%');
  });
});
describe('Callback and listeners', () => {
  let testCallback: (event: subViewEvent) => subViewEvent;
  let testCallbackWithMock: Mock<subViewEvent, [event: subViewEvent]>;
  let pointerEvent: {
    pointerdown: PointerEvent,
    pointermove: PointerEvent,
    pointerup: PointerEvent,
  };
  let resultEvent: {
    pointerdown: tipEvent,
    pointermove: tipEvent,
    pointerup: tipEvent,
  };
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new TipFrom(newElement);
    testCallback = (event: subViewEvent) => event;
    resultEvent = {
      pointerdown: {
        target: 'tip',
        type: 'from',
        action: 'click',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
      pointermove: {
        target: 'tip',
        type: 'from',
        action: 'move',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
      pointerup: {
        target: 'tip',
        type: 'from',
        action: 'drop',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
    };
    pointerEvent = {
      pointerdown: new PointerEvent('pointerdown', { bubbles: true }),
      pointermove: new PointerEvent('pointermove', { bubbles: true }),
      pointerup: new PointerEvent('pointerup', { bubbles: true }),
    };
  });
  test('Must correctly receive a callback', () => {
    componentInstance.setCallback(testCallback);
    expect(componentInstance.callback).toBeDefined();
    expect(typeof componentInstance.callback).toBe('function');
  });
  test('Must correctly send event to callback', () => {
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.sendAction(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock).toBeCalled();
    expect(testCallbackWithMock).toBeCalledTimes(1);
  });
  test('Should correctly handle a pointerdown on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    expect(testCallbackWithMock).toBeCalledTimes(1);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
  });
  test('Should correctly handle a pointermove on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    document.dispatchEvent(pointerEvent.pointermove);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[1].value).toEqual(resultEvent.pointermove);
    expect(testCallbackWithMock).toBeCalledTimes(2);
  });
  test('Should correctly handle a pointerup on the tip', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    document.dispatchEvent(pointerEvent.pointermove);
    document.dispatchEvent(pointerEvent.pointerup);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
    expect(testCallbackWithMock.mock.results[1].value).toEqual(resultEvent.pointermove);
    expect(testCallbackWithMock.mock.results[2].value).toEqual(resultEvent.pointerup);
    expect(testCallbackWithMock).toBeCalledTimes(3);
  });
});
