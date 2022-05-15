/* eslint-disable no-undef */
import { Range } from './Range';
import { viewSliderState } from '../../../../Types/state';
import { subViewEvent } from '../../../../Types/ViewEventTypes';
import { rangeEvent } from '../../../../Types/SubViewEvents/RangeTypes';
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
};
let componentInstance: Range;
let rootNode: HTMLElement;
const componentName: string = 'jqsRange';

describe('Initialization', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Range(newElement);
  });
  test('Must be initialized', () => {
    expect(componentInstance).toBeDefined();
    expect(componentInstance).toBeInstanceOf(Range);
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
    componentInstance = new Range(newElement);
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
});
describe('isRange', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Range(newElement);
  });
  test('Must start at 0% on {isRange: false}', () => {
    componentInstance.update({
      ...defaultState,
      isRange: false,
      horizontal: true,
    });
    expect(componentInstance.componentNode.style.left).toBe('0%');
    expect(componentInstance.componentNode.style.left).not.toBe(`${defaultState.from.percent}%`);
  });
  test('Must start at "from" position on {isRange: true}', () => {
    componentInstance.update({
      ...defaultState,
      isRange: true,
      horizontal: true,
    });
    expect(componentInstance.componentNode.style.left).toBe(`${defaultState.from.percent}%`);
    expect(componentInstance.componentNode.style.width).not.toBe(`${defaultState.to.percent}%`);
  });
});
describe('Orientation align (horizontal / vertical)', () => {
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Range(newElement);
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
  test('Must have "left" + "width" and no "top" + "height" styles when {horizontal: true}', () => {
    componentInstance.update({ ...defaultState, horizontal: true });
    expect(componentInstance.componentNode.style.top).toBe('');
    expect(componentInstance.componentNode.style.height).toBe('');
    expect(componentInstance.componentNode.style.left).not.toBe('');
    expect(componentInstance.componentNode.style.width).not.toBe('');
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
  test('Must have "top" + "height" and no "left" + "width" styles when {horizontal: false}', () => {
    componentInstance.update({ ...defaultState, horizontal: false });
    expect(componentInstance.componentNode.style.left).toBe('');
    expect(componentInstance.componentNode.style.width).toBe('');
    expect(componentInstance.componentNode.style.top).not.toBe('');
    expect(componentInstance.componentNode.style.height).not.toBe('');
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
    componentInstance = new Range(newElement);
    stateCopy = {
      ...defaultState,
      horizontal: true,
      to: { ...defaultState.to, percent: 85 },
      from: { ...defaultState.from, percent: 20 },
    };
  });
  test('Must have correct position when {invert: false} and { isRange: false }', () => {
    componentInstance.update({ ...stateCopy, isRange: false, invert: false });
    expect(componentInstance.componentNode.style.width).toBe('20%');
    expect(componentInstance.componentNode.style.left).toBe('0%');
  });
  test('Must have correct position when {invert: false} and { isRange: true }', () => {
    componentInstance.update({ ...stateCopy, isRange: true, invert: false });
    expect(componentInstance.componentNode.style.width).toBe('65%');
    expect(componentInstance.componentNode.style.left).toBe('20%');
  });
  test('Must have correct position when {invert: true} and { isRange: false }', () => {
    componentInstance.update({ ...stateCopy, isRange: false, invert: true });
    expect(componentInstance.componentNode.style.width).toBe('20%');
    expect(componentInstance.componentNode.style.left).toBe(`${100 - 20}%`);
  });
  test('Must have correct position when {invert: true} and { isRange: true }', () => {
    componentInstance.update({ ...stateCopy, isRange: true, invert: true });
    expect(componentInstance.componentNode.style.width).toBe(`${85 - 20}%`);
    expect(componentInstance.componentNode.style.left).toBe(`${100 - 85}%`);
  });
});
describe('Callback and listeners', () => {
  let testCallback: (event: subViewEvent) => subViewEvent;
  let testCallbackWithMock: Mock<subViewEvent, [event: subViewEvent]>;
  let pointerEvent: { pointerdown: PointerEvent, };
  let resultEvent: { pointerdown: rangeEvent, };
  beforeEach(() => {
    const newElement = document.createElement('div');
    rootNode = newElement;
    componentInstance = new Range(newElement);
    testCallback = (event: subViewEvent) => event;
    resultEvent = {
      pointerdown: {
        target: 'range',
        type: '',
        action: 'click',
        value: {
          x: 0,
          y: 0,
          total: false,
        },
      },
    };
    pointerEvent = {
      pointerdown: new PointerEvent('pointerdown', { bubbles: true }),
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
  test('Should correctly handle a pointerdown on the range', () => {
    componentInstance.update({ ...defaultState, tips: true });
    testCallbackWithMock = jest.fn(testCallback);
    componentInstance.setCallback(testCallbackWithMock);
    componentInstance.componentNode.dispatchEvent(pointerEvent.pointerdown);
    expect(testCallbackWithMock).toBeCalledTimes(1);
    expect(testCallbackWithMock.mock.results[0].value).toEqual(resultEvent.pointerdown);
  });
});
